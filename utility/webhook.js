const { getWebSettings } = require('../utility/general');
const { updateUserBalance, getUserDetailsByUid } = require('../utility/userInfo');
const { createTransactionHistory, getTransactionByTransactionNo, updateTransactionStatusByTransactionNo } = require('../utility/history');
const { taskVerification } = require('../utility/referralVerification');
const logger = require('../utility/logger');
const monitor = require('../utility/monitor');

require('dotenv').config();

// Helper to convert XAF to USD
async function convertXafToUsd(xafAmount, xafRate) {
  const usdAmount = xafAmount / xafRate;
  return usdAmount;
}

// ---------------------- FAPSHI WEBHOOK ----------------------
const fapshiWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const { transId, userId, amount, status } = payload;

    if (status !== 'SUCCESSFUL') {
      logger.info('Ignored (status not SUCCESSFUL)', { transId, userId, amount, status });
      return res.status(200).json({ message: 'Ignored (status not SUCCESSFUL)' });
    }

    if (!transId || !userId || !amount) {
      logger.error('Missing required fields for successful transaction', { transId, userId, amount });
      return res.status(400).json({ error: 'Missing required fields for successful transaction' });
    }

    const settings = await getWebSettings();
    const xafRate = settings?.xaf_rate;

    if (!xafRate || isNaN(xafRate)) {
      logger.error('Exchange rate not available or invalid');
      return res.status(500).json({ error: 'Exchange rate not available or invalid' });
    }

    const usdAmount = await convertXafToUsd(amount, xafRate);

    const userDetails = await getUserDetailsByUid(userId);
    const currentBalance = parseFloat(userDetails.account_balance || 0);
    const newBalance = currentBalance + parseFloat(usdAmount);

    const updateResult = await updateUserBalance(userId, newBalance);
    if (!updateResult.success) {
      logger.error('Failed to update user balance', { userId, currentBalance, newBalance });
      monitor.error('Fapshi: balance update failed', { userId, currentBalance, newBalance });
      return res.status(500).json({ error: 'Failed to update user balance' });
    }

    const transactionHistoryResult = await createTransactionHistory(
      userId,
      usdAmount,
      'Momo/Orange Deposit',
      'completed'
    );

    if (!transactionHistoryResult.success) {
      logger.warn('Transaction history creation failed', { userId });
    }

    monitor.success('Fapshi deposit credited', { userId, usdAmount, transId });

    // Respond first
    res.status(200).json({ success: true });

    // Background referral task check
    taskVerification(userId)
      .then(() => logger.info('Referral task verified (fapshi)', { userId }))
      .catch((err) => logger.error('Referral task verification failed (fapshi)', { userId, error: err.message }));

  } catch (error) {
    logger.error('Unhandled error during Fapshi webhook', { error: error.message });
    monitor.error('Fapshi webhook crash', { stack: error.stack, message: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ---------------------- CRYPTOMUS WEBHOOK ----------------------
const cryptomusWebhook = async (req, res) => {
  try {
    const getClientIP = (req) => {
      const forwarded = req.headers['x-forwarded-for'];
      return forwarded ? forwarded.split(',')[0].trim() : req.ip;
    };

    const allowedIP = process.env.CRYPTOMUS_IP;
    const clientIP = getClientIP(req);

    if (!clientIP.includes(allowedIP)) {
      logger.warn('Blocked: Unauthorized IP', { clientIP });
      monitor.warn('Cryptomus: blocked unauthorized IP', { clientIP });
      return res.status(403).json({ error: 'Forbidden - Unauthorized IP' });
    }

    const payload = req.body;
    const { order_id, amount, status } = payload;

    if (status !== 'paid') {
      logger.info('Ignored (status not paid)', { order_id, amount, status });
      return res.status(200).json({ message: 'Ignored (status not paid)' });
    }

    if (!order_id || !amount || !status) {
      logger.error('Missing required fields', { order_id, amount, status });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userUid = order_id.charAt(0);
    const userDetails = await getUserDetailsByUid(userUid);

    if (!userDetails) {
      logger.error('User not found', { userUid });
      return res.status(404).json({ error: 'User not found' });
    }

    const currentBalance = Number(userDetails.account_balance) || 0;
    const newBalance = currentBalance + Number(amount);

    const updateResult = await updateUserBalance(userUid, newBalance);
    if (!updateResult.success) {
      logger.error('Balance update failed', { userUid, currentBalance, newBalance });
      monitor.error('Cryptomus: balance update failed', { userUid, currentBalance, newBalance });
      return res.status(500).json({ error: 'Balance update failed' });
    }

    await createTransactionHistory(userUid, amount, 'Cryptomus Deposit', 'completed');

    monitor.success('Cryptomus deposit credited', { userUid, amount, order_id });

    // Respond to webhook
    res.status(200).json({ success: true });

    // Background referral verification
    taskVerification(userUid)
      .then(() => logger.info('Referral task verified (cryptomus)', { userUid }))
      .catch((err) => logger.error('Referral task verification failed (cryptomus)', { userUid, error: err.message }));

  } catch (error) {
    logger.error('Webhook Error (cryptomus)', { error: error.message });
    monitor.error('Cryptomus webhook crash', { stack: error.stack, message: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// ---------------------- FLUTTERWAVE WEBHOOK ----------------------
const flutterwaveWebhook = async (req, res) => {
  try {
    // -------- VERIFY SIGNATURE --------
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    console.log("Flutterwave webhook received", { signature, event: req.body?.event });

    if (!signature || !secretHash || signature !== secretHash) {
      console.warn("Flutterwave webhook signature mismatch", { signature, hasSecret: !!secretHash });
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Flutterwave signature verified");

    // ACK FAST
    res.status(200).json({ received: true });

    const payload = req.body;

    // Only handle successful charge events
    if (payload?.event !== "charge.completed") {
      console.log("Flutterwave webhook ignored (event not charge.completed)", { event: payload?.event });
      return;
    }

    const data = payload?.data;
    if (!data || data.status !== "successful") {
      console.log("Flutterwave webhook ignored (status not successful)", { status: data?.status });
      return;
    }

    const tx_ref = data?.tx_ref;
    if (!tx_ref) {
      console.warn("Flutterwave webhook missing tx_ref", { data });
      return;
    }

    console.log("Flutterwave charge successful", { tx_ref, amount: data?.amount, currency: data?.currency, customer: data?.customer?.email });

    // -------- GET TRANSACTION --------
    const txn = await getTransactionByTransactionNo(tx_ref);
    if (!txn.success) {
      console.warn("Flutterwave transaction not found in DB", { tx_ref });
      return;
    }

    const { amount, user_uid } = txn;
    console.log("Flutterwave transaction found", { tx_ref, amount, user_uid });

    // -------- UPDATE TRANSACTION STATUS --------
    const statusUpdate = await updateTransactionStatusByTransactionNo(tx_ref, "completed");
    if (!statusUpdate.success) {
      console.error("Flutterwave failed to update transaction status", { tx_ref, message: statusUpdate.message });
      return;
    }

    console.log("Flutterwave transaction status updated to completed", { tx_ref });

    // -------- CREDIT USER --------
    const userDetails = await getUserDetailsByUid(user_uid);
    if (!userDetails) {
      console.error("Flutterwave user not found", { user_uid });
      return;
    }

    const currentBalance = Number(userDetails.account_balance) || 0;
    const newBalance = currentBalance + Number(amount);

    console.log("Flutterwave crediting user", { user_uid, currentBalance, amount, newBalance });

    const balanceUpdate = await updateUserBalance(user_uid, newBalance);
    if (!balanceUpdate.success) {
      console.error("Flutterwave balance update failed", { user_uid, currentBalance, newBalance });
      monitor.error("Flutterwave: balance update failed", { user_uid, currentBalance, newBalance, tx_ref });
      return;
    }

    console.log("Flutterwave user balance updated successfully", { user_uid, newBalance });
    monitor.success("Flutterwave deposit credited", { user_uid, amount, tx_ref });

    // -------- REFERRAL TASK --------
    taskVerification(user_uid)
      .then(() => console.log("Flutterwave referral task verified", { user_uid }))
      .catch((err) => console.error("Flutterwave referral task verification failed", { user_uid, error: err.message }));

  } catch (error) {
    console.error("Flutterwave webhook crash", { error: error.message });
    monitor.error("Flutterwave webhook crash", { stack: error.stack, message: error.message });
    res.status(200).end();
  }
};


module.exports = { fapshiWebhook, cryptomusWebhook, flutterwaveWebhook };

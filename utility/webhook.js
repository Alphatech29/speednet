const { getWebSettings } = require('../utility/general');
const { updateUserBalance, getUserDetailsByUid } = require('../utility/userInfo');
const { createTransactionHistory, getTransactionByTransactionNo, updateTransactionStatusByTransactionNo } = require('../utility/history');
const { taskVerification } = require('../utility/referralVerification');
const crypto = require('crypto');
const logger = require('../utility/logger');

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

    // Respond first
    res.status(200).json({ success: true });

    // Background referral task check
    taskVerification(userId)
      .then(() => logger.info('Referral task verified (fapshi)', { userId }))
      .catch((err) => logger.error('Referral task verification failed (fapshi)', { userId, error: err.message }));

  } catch (error) {
    logger.error('Unhandled error during Fapshi webhook', { error: error.message });
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
      return res.status(500).json({ error: 'Balance update failed' });
    }

    await createTransactionHistory(userUid, amount, 'Cryptomus Deposit', 'completed');

    // Respond to webhook
    res.status(200).json({ success: true });

    // Background referral verification
    taskVerification(userUid)
      .then(() => logger.info('Referral task verified (cryptomus)', { userUid }))
      .catch((err) => logger.error('Referral task verification failed (cryptomus)', { userUid, error: err.message }));

  } catch (error) {
    logger.error('Webhook Error (cryptomus)', { error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// ---------------------- MONNIFY WEBHOOK ----------------------
const monnifyWebhook = async (req, res) => {
  try {
    // -------- RAW BODY --------
    let rawBody = "";
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString("utf8");
    } else if (typeof req.body === "object") {
      rawBody = JSON.stringify(req.body);
    }

    // -------- VERIFY SIGNATURE --------
    const settings = await getWebSettings();
    const secretKey = settings?.monnify_secretKey;
    const signature = req.headers["monnify-signature"];

    if (!signature || !secretKey) {
      logger.warn("Missing Monnify signature or secret");
      return res.status(200).json({ received: true });
    }

    const computedHash = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    let valid = false;
    try {
      valid = crypto.timingSafeEqual(
        Buffer.from(computedHash, "hex"),
        Buffer.from(signature, "hex")
      );
    } catch {
      valid = false;
    }

    // ACK FAST (Monnify requires this)
    res.status(200).json({ received: true });
    if (!valid) return;

    // -------- PARSE PAYLOAD --------
    const payload = JSON.parse(rawBody);
    console.log("Parsed Payload:", payload);

    // Only handle successful payments
    if (payload?.eventType !== "SUCCESSFUL_TRANSACTION") return;

    const eventData = payload?.eventData;
    const paymentReference = eventData?.paymentReference;
    const amountPaid = Number(eventData?.amountPaid);

    if (!paymentReference || !amountPaid) {
      console.warn("Invalid webhook data");
      return;
    }

    // -------- GET TRANSACTION --------
    const txn = await getTransactionByTransactionNo(paymentReference);
    if (!txn.success) {
      console.warn("Transaction not found:", paymentReference);
      return;
    }

    const { amount, user_uid } = txn;


    // -------- UPDATE TRANSACTION STATUS --------
    const statusUpdate = await updateTransactionStatusByTransactionNo(
      paymentReference,
      "completed"
    );

    if (!statusUpdate.success) {
      console.warn("Failed to update transaction:", statusUpdate.message);
      return;
    }

    // -------- CREDIT USER --------
    const userDetails = await getUserDetailsByUid(user_uid);
    if (!userDetails) {
      logger.error("User not found", { user_uid });
      return;
    }

    const currentBalance = Number(userDetails.account_balance) || 0;
    const newBalance = currentBalance + Number(amount);

    const balanceUpdate = await updateUserBalance(user_uid, newBalance);
    if (!balanceUpdate.success) {
      logger.error("Balance update failed", { user_uid, currentBalance, newBalance });
      return;
    }

    // -------- REFERRAL TASK --------
    const userUid = user_uid;
    taskVerification(userUid)
      .then(() =>
        logger.info("Referral task verified (monnify)", { userUid })
      )
      .catch((err) =>
        logger.error("Referral task verification failed (monnify)", {
          userUid,
          error: err.message,
        })
      );

  } catch (error) {
    console.error("Webhook crash:", error);
    res.status(200).end();
  }
};


module.exports = { fapshiWebhook, cryptomusWebhook, monnifyWebhook };

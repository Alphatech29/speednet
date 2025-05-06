const { getWebSettings } = require('../utility/general');
const { updateUserBalance, getUserDetailsByUid } = require('../utility/userInfo');
const { createTransactionHistory } = require('../utility/history');
const crypto = require('crypto');



require('dotenv').config();

// Fapshi Webhook Handler
const fapshiWebhook = async (req, res) => {
  try {
    // Extract payload
    const payload = req.body;
    const { transId, userId, amount, status } = payload;

    // Ignore unsuccessful transactions
    if (status !== 'SUCCESSFUL') {
      return res.status(200).json({ message: 'Ignored (status not SUCCESSFUL)' });
    }

    // Validate required fields
    if (!transId || !userId || !amount) {
      return res.status(400).json({ error: 'Missing required fields for successful transaction' });
    }

    // Fetch web settings
    const settings = await getWebSettings();
    const xafRate = settings?.xaf_rate;

    if (!xafRate || isNaN(xafRate)) {
      return res.status(500).json({ error: 'Exchange rate not available or invalid' });
    }

    // Convert XAF to USD
    const usdAmount = await convertXafToUsd(amount, xafRate);

    // Fetch user details
    const userDetails = await getUserDetailsByUid(userId);
    const currentBalance = parseFloat(userDetails.account_balance || 0);
    const newBalance = currentBalance + parseFloat(usdAmount);

    // Update user balance
    const updateResult = await updateUserBalance(userId, newBalance);

    if (!updateResult.success) {
      return res.status(500).json({ error: 'Failed to update user balance' });
    }

    // Log transaction history
    const transactionHistoryResult = await createTransactionHistory(
      userId,
      usdAmount,
      'Momo/Orange Deposit',
      'completed'
    );

    if (!transactionHistoryResult.success) {
      console.error('❌ Failed to create transaction history for user:', userId);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Unhandled error during webhook processing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Convert XAF to USD helper
async function convertXafToUsd(xafAmount, xafRate) {
  const usdAmount = xafAmount / xafRate;
  return usdAmount;
}

/*----------------------Border between Fapshi webhook and Cryptomus webhook---------------------*/

// Main Cryptomus Webhook Handler
const cryptomusWebhook = async (req, res) => {
  try {
    // Restrict to allowed IP
    const getClientIP = (req) => {
      const forwarded = req.headers['x-forwarded-for'];
      return forwarded ? forwarded.split(',')[0].trim() : req.ip;
    };

    const allowedIP = process.env.CRYPTOMUS_IP;
    const clientIP = getClientIP(req);


    if (!clientIP.includes(allowedIP)) {
      console.warn('Blocked: Unauthorized IP', clientIP);
      return res.status(403).json({ error: 'Forbidden - Unauthorized IP' });
    }

    const payload = req.body;

    // Use the requested destructuring of payload
    const { order_id, amount, status } = payload;

    if (status !== 'paid') {
      return res.status(200).json({ message: 'Ignored (status not paid)' });
    }

    // Validate required fields
    if (!order_id || !amount || !status) {
      console.error('Error: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userUid = order_id.charAt(0);
    const userDetails = await getUserDetailsByUid(userUid);
    if (!userDetails) {
      console.error('Error: User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const currentBalance = Number(userDetails.account_balance) || 0;
    const newBalance = currentBalance + Number(amount);

    const updateResult = await updateUserBalance(userUid, newBalance);
    if (!updateResult.success) {
      console.error('Error: Failed to update balance');
      return res.status(500).json({ error: 'Balance update failed' });
    }

    await createTransactionHistory(userUid, amount, 'Cryptomus Deposit', 'completed');

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { fapshiWebhook, cryptomusWebhook };

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

    console.log('📥 Received Fapshi Webhook Payload:', payload);
    console.log('🌐 Incoming Headers:', req.headers);

    // Ignore unsuccessful transactions
    if (status !== 'SUCCESSFUL') {
      console.log(`⚠️ Transaction ${transId || 'N/A'} ignored — status: ${status}`);
      return res.status(200).json({ message: 'Ignored (status not SUCCESSFUL)' });
    }

    // Validate required fields
    if (!transId || !userId || !amount) {
      console.log('❌ Missing required fields:', { transId, userId, amount });
      return res.status(400).json({ error: 'Missing required fields for successful transaction' });
    }

    // Fetch web settings
    const settings = await getWebSettings();
    const xafRate = settings?.xaf_rate;

    if (!xafRate || isNaN(xafRate)) {
      console.log('❌ Invalid or missing exchange rate:', xafRate);
      return res.status(500).json({ error: 'Exchange rate not available or invalid' });
    }

    // Convert XAF to USD
    const usdAmount = await convertXafToUsd(amount, xafRate);
    console.log(`💵 Converted XAF ${amount} @ ${xafRate} = USD ${usdAmount}`);

    // Fetch user details
    const userDetails = await getUserDetailsByUid(userId);
    const currentBalance = parseFloat(userDetails.account_balance || 0);
    const newBalance = currentBalance + parseFloat(usdAmount);

    console.log(`🔁 Updating balance from ${currentBalance} to ${newBalance}`);

    // Update user balance
    const updateResult = await updateUserBalance(userId, newBalance);
    console.log('📝 Update balance result:', updateResult);

    if (!updateResult.success) {
      console.log('❌ Failed to update user balance for user:', userId);
      return res.status(500).json({ error: 'Failed to update user balance' });
    }

    // Log transaction history
    const transactionHistoryResult = await createTransactionHistory(
      userId,
      usdAmount,
      'Momo/Orange Deposit',
      'completed'
    );
    console.log('📚 Transaction history creation result:', transactionHistoryResult);

    if (!transactionHistoryResult.success) {
      console.error('❌ Failed to create transaction history for user:', userId);
    }

    console.log('✅ Webhook processing complete for transaction:', transId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Unhandled error during webhook processing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Convert XAF to USD helper
async function convertXafToUsd(xafAmount, xafRate) {
  const usdAmount = xafAmount / xafRate;
  console.log(`🔄 Converting XAF ${xafAmount} to USD using rate ${xafRate}: ${usdAmount}`);
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
    console.log('Incoming IP:', clientIP);

    if (!clientIP.includes(allowedIP)) {
      console.warn('Blocked: Unauthorized IP', clientIP);
      return res.status(403).json({ error: 'Forbidden - Unauthorized IP' });
    }

    const payload = req.body;
    console.log('Parsed Payload:', payload);

    // Use the requested destructuring of payload
    const { order_id, amount, status } = payload;

    if (status !== 'paid') {
      console.log('Ignored: Payment not completed');
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
    console.log(`Updating Balance: ${currentBalance} → ${newBalance}`);

    const updateResult = await updateUserBalance(userUid, newBalance);
    if (!updateResult.success) {
      console.error('Error: Failed to update balance');
      return res.status(500).json({ error: 'Balance update failed' });
    }

    await createTransactionHistory(userUid, amount, 'Cryptomus Deposit', 'completed');
    console.log('Transaction logged:', createTransactionHistory);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { fapshiWebhook, cryptomusWebhook };

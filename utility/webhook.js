const { getWebSettings } = require('../utility/general');
const { updateUserBalance, getUserDetailsByUid } = require('../utility/userInfo');
const { createTransactionHistory } = require('../utility/history');
const crypto = require('crypto');

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
    console.log('📡 Incoming Webhook Request Headers:', req.headers);
    console.log('📩 Incoming Webhook Request Body:', req.body);

    const payload = req.body;
    const { uuid, order_id, amount, payment_amount, status, txid, sign } = payload;

    console.log('📝 Extracted Payload Fields:', {
      uuid, order_id, amount, payment_amount, status, txid, sign
    });

    // Step 1: Load API key from settings
    const settings = await getWebSettings();
    console.log('⚙️ Fetched Web Settings:', settings);

    const cryptomusApiKey = settings?.cryptomus_api_key;
    console.log('🔐 Using Cryptomus API Key:', cryptomusApiKey);

    if (!cryptomusApiKey) {
      console.error('❌ Missing Cryptomus API Key in settings');
      return res.status(500).json({ error: 'Cryptomus API Key missing in settings' });
    }

    // Step 2: Verify Signature
    const isValid = verifyWebhookSignature(payload, sign, cryptomusApiKey);
    console.log('🔎 Signature Verification Result:', isValid);

    if (!isValid) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // Step 3: Check if payment was successful
    console.log('💳 Payment Status:', status);
    if (status !== 'paid') {
      console.warn(`⚠️ Skipping transaction ${uuid} — Status: ${status}`);
      return res.status(200).json({ message: 'Ignored (status not paid)' });
    }

    // Step 4: Validate fields
    if (!uuid || !order_id || !amount || !payment_amount || !txid) {
      console.error('❌ Missing required fields:', {
        uuid, order_id, amount, payment_amount, txid
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Step 5: Identify user from order_id
    const userUid = order_id.charAt(0); // Adjust logic as needed
    console.log('👤 Identified User UID from order_id:', userUid);

    // Step 6: Get and compute balance
    const userDetails = await getUserDetailsByUid(userUid);
    console.log('👤 Retrieved User Details:', userDetails);

    const currentBalance = parseFloat(userDetails.account_balance);
    const newBalance = currentBalance + parseFloat(amount);
    console.log(`💰 Balance Update: Current = ${currentBalance}, New = ${newBalance}`);

    // Step 7: Update balance
    const updateResult = await updateUserBalance(userUid, newBalance);
    console.log('📤 Update Balance Result:', updateResult);

    if (!updateResult.success) {
      console.error('❌ Failed to update user balance');
      return res.status(500).json({ error: 'Balance update failed' });
    }

    console.log('✅ User balance updated successfully');

    // Step 8: Log transaction
    const transactionResult = await createTransactionHistory(
      userUid,
      amount,
      'Cryptomus Deposit',
      'completed'
    );

    console.log('📘 Transaction History Log Result:', transactionResult);

    if (!transactionResult.success) {
      console.warn('⚠️ Failed to log transaction history');
    } else {
      console.log('📝 Transaction history recorded successfully');
    }

    // Step 9: Respond OK to webhook
    console.log('✅ Webhook processing complete for transaction:', uuid);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 🔐 Webhook Signature Verification
function verifyWebhookSignature(payload, expectedSign, cryptomus_api_key) {
  const payloadString = JSON.stringify(payload);
  console.log('📦 Payload Stringified for Signature:', payloadString);

  const computedSign = generateSignature(payloadString, cryptomus_api_key);
  console.log('🔐 Computed Signature:', computedSign);
  console.log('🔏 Expected Signature:', expectedSign);

  return computedSign === expectedSign;
}

// 🔐 HMAC Signature Generator
function generateSignature(payload, cryptomus_api_key) {
  console.log('🔧 Generating HMAC with Key:', cryptomus_api_key);
  return crypto.createHmac('sha256', cryptomus_api_key).update(payload).digest('hex');
}

module.exports = { fapshiWebhook, cryptomusWebhook };

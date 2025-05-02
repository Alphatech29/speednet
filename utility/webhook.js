const { getWebSettings } = require('../utility/general');
const { updateUserBalance, getUserDetailsByUid } = require('../utility/userInfo');
const { createTransactionHistory } = require('../utility/history');

// Fapshi Webhook Handler
const fapshiWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const { transId, userId, amount, status } = payload;

    console.log('📥 Received Fapshi Webhook Payload:', payload);

    // Only proceed if status is SUCCESSFUL
    if (status !== 'SUCCESSFUL') {
      console.log(`⚠️ Transaction ${transId || 'N/A'} ignored — status: ${status}`);
      return res.status(200).json({ message: 'Ignored (status not SUCCESSFUL)' });
    }

    // Validate essential fields
    if (!transId || !userId || !amount) {
      console.log('❌ Missing required fields:', { transId, userId, amount });
      return res.status(400).json({ error: 'Missing required fields for successful transaction' });
    }

    const userUid = userId;

    // Fetch exchange rate
    const settings = await getWebSettings();
    const xafRate = settings?.xaf_rate;

    if (!xafRate || isNaN(xafRate)) {
      console.log('❌ Invalid or missing exchange rate:', xafRate);
      return res.status(500).json({ error: 'Exchange rate not available or invalid' });
    }

    // Convert XAF to USD
    const usdAmount = await convertXafToUsd(amount, xafRate);
    console.log(`💵 Converted XAF ${amount} @ ${xafRate} = USD ${usdAmount}`);

    // Fetch current balance using helper
    const userDetails = await getUserDetailsByUid(userUid);
    const currentBalance = parseFloat(userDetails.account_balance);
    const newBalance = currentBalance + parseFloat(usdAmount);

    console.log(`🔁 Updating balance from ${currentBalance} to ${newBalance}`);

    // Update user balance using helper
    const updateResult = await updateUserBalance(userUid, newBalance);
    console.log('📝 Update balance result:', updateResult);

    if (!updateResult.success) {
      console.log('❌ Failed to update user balance for user:', userUid);
      return res.status(500).json({ error: 'Failed to update user balance' });
    }

    // Record transaction history
    const transactionHistoryResult = await createTransactionHistory(userUid, usdAmount, 'Momo/Orange Deposit', 'completed');
    console.log('📚 Transaction history creation result:', transactionHistoryResult);

    if (!transactionHistoryResult.success) {
      console.error('❌ Failed to create transaction history for user:', userUid);
    }

    console.log('✅ Webhook processing complete for transaction:', transId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Unhandled error during webhook processing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Convert XAF to USD
async function convertXafToUsd(xafAmount, xafRate) {
  const usdAmount = xafAmount / xafRate;
  console.log(`🔄 Converting XAF ${xafAmount} to USD using rate ${xafRate}: ${usdAmount}`);
  return usdAmount;
}

module.exports = { fapshiWebhook };

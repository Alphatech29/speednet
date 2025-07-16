const { getDepositTransactionsByUserUid } = require('./history');
const { getReferralByReferredUser, updateReferralById } = require('./referral');
const { getOrdersByUser } = require('./accountOrder');
const { getUserDetailsByUid, updateReferralBalance } = require('./userInfo');

/**
 * Verifies if a referred user made a valid deposit (≥ $25) and placed an order.
 * Updates first_deposit immediately upon success, then waits for order to continue.
 */
async function taskVerification(userId) {
  try {
    if (!userId || isNaN(Number(userId))) {
      console.error('Invalid user ID provided');
      return;
    }

    const user_uid = String(userId).trim();

    const depositResult = await getDepositTransactionsByUserUid(Number(user_uid));
    if (!depositResult.success || !Array.isArray(depositResult.data) || depositResult.data.length !== 1) return;

    const depositAmount = parseFloat(depositResult.data[0].amount || 0);
    if (isNaN(depositAmount) || depositAmount < 25) return;

    const referralResult = await getReferralByReferredUser(Number(user_uid));
    if (!referralResult.success) return;

    const referral = referralResult.data;
    const referralId = referral.id;
    const referral1Id = referral.referral1_id;
    const referralBonus = parseFloat(referral.referral_amount || 0);

    if (referral.referral_status === 1 || referralBonus <= 0) return;

    await updateReferralById(referralId, 'first_deposit', 1);

    const orderResult = await getOrdersByUser(user_uid);
    if (!orderResult.success || !Array.isArray(orderResult.data) || orderResult.data.length === 0) return;

    await updateReferralById(referralId, 'first_order', 1);

    const statusUpdate = await updateReferralById(referralId, 'referral_status', 1);
    if (!statusUpdate.success) return;

    let referrerDetails;
    try {
      referrerDetails = await getUserDetailsByUid(referral1Id);
    } catch (err) {
      console.error(`Failed to fetch details for referral1 (${referral1Id}):`, err.message);
      return;
    }

    const currentBalance = parseFloat(referrerDetails.referral_balance || 0);
    const newBalance = currentBalance + referralBonus;

    const balanceUpdate = await updateReferralBalance(referral1Id, newBalance);
    if (!balanceUpdate.success) {
      console.error(`Failed to credit referral1 (${referral1Id}):`, balanceUpdate.message || balanceUpdate.error);
    }

  } catch (error) {
    console.error(`Error in task verification for user ${userId}:`, error.message);
  }
}

module.exports = {
  taskVerification,
};

const { getDepositTransactionsByUserUid } = require('./history');

async function taskVerification(userId) {
  try {
    if (!userId || isNaN(Number(userId))) {
      console.error('Invalid user_Id provided');
      return { success: false, message: 'Invalid user ID' };
    }

    const user_uid = Number(userId);
    const result = await getDepositTransactionsByUserUid(user_uid);
    
    // Log result here
    console.log('User Deposit Transactions:', result);

    return result;
  } catch (error) {
    console.error('Error retrieving user deposit transactions:', error.message);
    return { success: false, message: 'Something went wrong' };
  }
}


module.exports = {
  taskVerification,
};
// 
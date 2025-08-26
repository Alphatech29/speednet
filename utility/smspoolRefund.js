const { getSmsServiceRecord, updateSmsServiceRecord, createTransactionHistory } = require("./history");
const { getUserDetailsByUid, updateUserBalance } = require("./userInfo");

async function smspoolRefund(time, orderid) {
  if (!time || !orderid) {
    throw new Error("Both time and orderid are required.");
  }

  const order = await getSmsServiceRecord(orderid);

  if (!order) {
    return {
      success: false,
      message: `Order ${orderid} not found.`,
    };
  }

  // Only process if code is missing
  if (order.code === undefined || order.code === null || order.code === "") {
    const now = Math.floor(Date.now() / 1000);
    const delay = Math.max((time - now) * 1000, 0);

    await new Promise((resolve) => setTimeout(resolve, delay));

    const updatedOrder = await getSmsServiceRecord(orderid);

    if (updatedOrder.code !== undefined && updatedOrder.code !== null && updatedOrder.code !== "") {
      return {
        success: false,
        message: `Order ${orderid} now has a code. Aborted.`,
      };
    } else {
      const updateResult = await updateSmsServiceRecord(orderid, "", 2);

      const userId = updatedOrder.user_id;
      const user = await getUserDetailsByUid(userId);

      // Compute new balance and update user
      const amount = updatedOrder.amount || 0;
      const newBalance = Number(user.account_balance) + Number(amount);
      const balanceUpdate = await updateUserBalance(userId, newBalance);

      // Create transaction history
      const transactionHistory = await createTransactionHistory(
        userId,
        Number(amount),
        "Refund for Unused SMS service",
        "completed"
      );

      return {
        success: true,
        message: `Order ${orderid} had no code. Record updated to 2, user balance updated, transaction logged.`,
        updateResult,
        balanceUpdate,
        transactionHistory,
        user,
      };
    }
  }

  // If code exists initially, do nothing
  return {
    success: false,
    message: `Order ${orderid} already has a code. No refund processed.`,
  };
}

module.exports = { smspoolRefund };

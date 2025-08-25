const { getUserDetailsByUid, updateUserBalance } = require("../../../utility/userInfo");
const { createTransactionHistory } = require("../../../utility/history");

const transfer = async (req, res) => {
  try {
    const { userId, amount } = req.body;


    // Validate input presence
    if (!userId || !amount) {
      console.error("Missing required fields: userId or amount");
      return res.status(400).json({
        success: false,
        message: "userId and amount are required.",
      });
    }

    // Validate input values
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error("Invalid amount:", amount);
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number.",
      });
    }



    // Fetch user
    const user = await getUserDetailsByUid(userId);
    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }


    // Compute new balance
    const previousBalance = Number(user.account_balance) || 0;
    const newBalance = previousBalance + numericAmount;
 

    // Update user balance
    let updatedUser;
    try {
      updatedUser = await updateUserBalance(userId, newBalance);
    } catch (updateError) {
      console.error("Error updating user balance:", updateError);
      return res.status(500).json({
        success: false,
        message: "Failed to update user balance.",
        error: updateError.message,
      });
    }

    if (!updatedUser || !updatedUser.success || updatedUser.affectedRows < 1) {
      console.error("Update result invalid:", updatedUser);
      return res.status(500).json({
        success: false,
        message: "User balance update failed. Please try again later.",
      });
    }


    // Record transaction history
    let historyResponse;
    try {
      historyResponse = await createTransactionHistory(
        userId,
        numericAmount,
        "Fund from Admin",
        "Completed"
      );
    } catch (historyError) {
      console.error("Error recording transaction history:", historyError);
      return res.status(500).json({
        success: false,
        message: "Failed to record transaction history.",
        error: historyError.message,
      });
    }

    if (!historyResponse || !historyResponse.success) {
      console.error("Transaction history failed:", historyResponse);
      return res.status(500).json({
        success: false,
        message: "Transaction history logging failed.",
        error: historyResponse?.message || "Unknown error",
      });
    }


    // Final success response
    const result = {
      userId,
      previousBalance,
      newBalance,
      user: updatedUser,
    };


    return res.status(200).json({
      success: true,
      message: `Transferred $${numericAmount} to ${user.full_name || user.email}.`,
      data: result,
    });

  } catch (error) {
    console.error("Transfer Error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while processing the transfer.",
      error: error.message || "Unknown error",
    });
  }
};

module.exports = transfer;

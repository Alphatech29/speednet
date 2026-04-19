const { storeWithdrawal } = require("../../utility/withdrawal");
const { generateUniqueRandomNumber } = require("../../utility/random");
const {
  getUserDetailsByUid,
  updateUser,
} = require("../../utility/userInfo");
const logger = require("../../utility/logger");
const monitor = require("../../utility/monitor");
const { storeMerchantTransaction } = require("../../utility/merchantHistory");
const { sendWithdrawalNotificationEmail } = require("../../email/mails/withdrawal");

// Minimum withdrawal per method
const MIN_WITHDRAWAL = {
  Bank:   10,
  Crypto: 15,
  MOMO:   5,
};

const WithdrawalRequest = async (req, res) => {
  try {
    const {
      userId,
      amount,
      method,
      bankAccount,
      bankName,
      accountName,
      walletAddress,
      walletNetwork,
      coinName,
      momoNumber,
    } = req.body;

    // Validate essential fields
    if (!userId || !amount || !method) {
      return res.status(400).json({
        message: "userId, amount, and method are required.",
      });
    }

    // Get user details
    const user = await getUserDetailsByUid(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const accountBalance = parseFloat(user.merchant_balance || 0);
    const withdrawalAmount = parseFloat(amount);

    // Ensure sufficient balance
    if (withdrawalAmount > accountBalance) {
      return res
        .status(400)
        .json({ message: "Insufficient balance for this withdrawal." });
    }

    // Enforce per-method minimum
    const minAllowed = MIN_WITHDRAWAL[method];
    if (minAllowed === undefined) {
      return res.status(400).json({ message: "Invalid withdrawal method." });
    }
    if (withdrawalAmount < minAllowed) {
      return res.status(400).json({
        message: `Minimum withdrawal for ${method} is $${minAllowed}.`,
      });
    }

    // Deduct new balance and update
    const newBalance = accountBalance - withdrawalAmount;
    const balanceUpdateResult = await updateUser(userId, {
      merchant_balance: newBalance,
    });

    if (!balanceUpdateResult || !balanceUpdateResult.success) {
      return res
        .status(500)
        .json({ message: "Failed to update user balance." });
    }

    // Generate unique transaction reference
    const reference = generateUniqueRandomNumber(13);

    // Prepare withdrawal record
    const withdrawalData = {
      user_id: userId,
      amount: withdrawalAmount,
      method,
      reference,
      status: "pending",
    };

    // Handle method-specific fields
    switch (method) {
      case "Bank":
        if (!bankAccount || !bankName) {
          return res.status(400).json({
            message: "Bank details are required for bank withdrawal.",
          });
        }
        withdrawalData.bankAccount = bankAccount;
        withdrawalData.bankName = bankName;
        if (accountName) withdrawalData.accountName = accountName;
        break;

      case "Crypto":
        if (!walletAddress || !walletNetwork || !coinName) {
          return res.status(400).json({
            message: "Wallet details are required for crypto withdrawal.",
          });
        }
        withdrawalData.walletAddress = walletAddress;
        withdrawalData.walletNetwork = walletNetwork;
        withdrawalData.coinName = coinName;
        break;

      case "MOMO":
        if (!momoNumber) {
          return res.status(400).json({
            message: "Momo number is required for MOMO withdrawal.",
          });
        }
        withdrawalData.momoNumber = momoNumber;
        break;

    }

    // Store the withdrawal
    const result = await storeWithdrawal(withdrawalData);
    if (!result || !result.insertId) {
      throw new Error("Failed to store withdrawal request.");
    }

    // Log transaction
    const transactionLogged = await storeMerchantTransaction({
      seller_id: userId,
      transaction_id: reference,
      transaction_type: "Withdrawal Request",
      amount: withdrawalAmount,
      status: "pending",
    });

    if (!transactionLogged) {
      logger.warn("Transaction history logging failed", {
        userId,
        reference,
      });
    }

    // Send withdrawal email notification
    try {
      await sendWithdrawalNotificationEmail(user, {
        amount: withdrawalAmount,
        method,
        reference,
        currencySymbol: "$"
      });
    } catch (emailError) {
      logger.warn("Withdrawal email notification failed", {
        userId,
        reference,
        error: emailError.message,
      });
    }

    monitor.success("Withdrawal request submitted", { userId, amount: withdrawalAmount, method, reference });

    // Success response
    return res.status(201).json({
      message: "Withdrawal request received successfully.",
      data: {
        reference,
        amount: withdrawalAmount,
        method,
        status: "pending",
      },
    });
  } catch (error) {
    logger.error("WithdrawalRequest error", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    monitor.error("Withdrawal request error", { stack: error.stack, message: error.message, userId: req.body?.userId });
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  WithdrawalRequest,
};

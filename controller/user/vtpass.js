const asyncHandler = require("../../middleware/asyncHandler");
const { rechargeAirtime } = require("../../utility/vtpass");
const { getUserDetailsByUid, updateUserBalance } = require("../../utility/userInfo");
const { validateTransactionPin } = require("../../controller/user/TransactionPin");
const { convertNairaToDollar } = require("../../utility/convertNaira");
const { createTransactionHistory } = require("../../utility/history");

const ALLOWED_NETWORK_TYPES = ["mtn", "glo", "airtel", "9mobile"];

const checkUserBalance = async (userId, amount) => {
  try {
    const user = await getUserDetailsByUid(userId);
    const userBalance = parseFloat(user.account_balance || 0);

    if (isNaN(userBalance)) {
      return { status: false, message: "Invalid account balance for user." };
    }

    if (userBalance < amount) {
      return {
        status: false,
        message: "Insufficient account balance.",
        balance: userBalance,
      };
    }

    return {
      status: true,
      balance: userBalance,
    };
  } catch (error) {
    console.error("Error in checkUserBalance:", error.message);
    return {
      status: false,
      message: "Error checking user balance.",
    };
  }
};

const airtimePurchase = asyncHandler(async (req, res) => {

  const { amount, phone, type, pin } = req.body;
  const userId = req.user?.userId;

  if (!amount || !phone || !type || !pin) {
    return res.status(400).json({ status: false, message: "Missing required fields." });
  }

  const pinValidationResult = await validateTransactionPin(userId, pin);
  if (!pinValidationResult.success) {
    return res.status(pinValidationResult.code || 401).json({
      status: false,
      message: pinValidationResult.message || "PIN validation failed.",
    });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ status: false, message: "Invalid amount provided." });
  }

  const network = type.toLowerCase();
  if (!ALLOWED_NETWORK_TYPES.includes(network)) {
    return res.status(400).json({ status: false, message: "Invalid network type provided." });
  }

  // Step 1: Convert Naira to Dollar
  let amountInDollar;
  try {
    amountInDollar = await convertNairaToDollar(parsedAmount);
  } catch (error) {
    console.error("Currency conversion error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Failed to convert Naira to Dollar: " + error.message,
    });
  }

  // Step 2: Check user balance
  const balanceCheck = await checkUserBalance(userId, amountInDollar);
  if (!balanceCheck.status) {
    return res.status(400).json(balanceCheck);
  }

  // Step 3: Deduct balance BEFORE recharge
  const newBalance = balanceCheck.balance - amountInDollar;
  try {
    await updateUserBalance(userId, newBalance);
  } catch (err) {
    console.error("Failed to deduct user balance:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to deduct user balance before recharge.",
    });
  }

  // Step 4: Attempt Airtime Recharge
  const result = await rechargeAirtime(parsedAmount, network, phone);

  const vtpassTransaction = result?.data?.content?.transactions || {};
  const transactionStatus = vtpassTransaction?.status?.toLowerCase() === "delivered" ? "successful" : "failed";


  // Step 5: Create transaction history
  try {
    const vtpassType = vtpassTransaction?.type || type.toUpperCase();

    await createTransactionHistory(
      userId,
      amountInDollar,
      vtpassType,
      transactionStatus
    );
  } catch (err) {
    console.error("Failed to log transaction history:", err.message);
  }

  // Step 6: Final response
  if (transactionStatus === "successful") {
    return res.status(200).json({
      status: true,
      message: "Airtime purchase successful.",
      data: vtpassTransaction,
    });
  }

  console.warn(`Recharge failed for user ${userId}. Refund of $${amountInDollar} should be processed.`);

  return res.status(400).json({
    status: false,
    message: "Airtime recharge failed. Refund will be processed shortly.",
  });
});

module.exports = {
  airtimePurchase,
};

const asyncHandler = require("../../middleware/asyncHandler");
const bcrypt = require("bcryptjs");
const { rechargeAirtime } = require("../../utility/vtpass");
const { getUserDetailsByUid, updateUserBalance } = require("../../utility/user");
const { getUserPinByUid } = require("../../utility/pinValidation");

// Allowed network types
const ALLOWED_NETWORK_TYPES = ["mtn", "glo", "airtel", "9mobile"];

/**
 * ✅ Check if user has sufficient balance
 */
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
    console.error("❌ Error in checkUserBalance:", error.message);
    return {
      status: false,
      message: "Error checking user balance.",
    };
  }
};

/**
 * 🔁 Airtime Purchase Handler
 */
const airtimePurchase = asyncHandler(async (req, res) => {
  console.log("🔵 Incoming airtime purchase request:", req.body);

  const { amount, phone, type, pin } = req.body;
  const userId = req.user?.userId;
 
  console.log("🔵 User ID:", userId);
  // ✅ Validate required fields
  if (!amount || !phone || !type || !pin) {
    return res.status(400).json({ status: false, message: "Missing required fields." });
  }

  // ✅ Step 0: Validate PIN
  const storedPinHash = await getUserPinByUid(userId);
  if (!storedPinHash) {
    return res.status(404).json({ status: false, message: "PIN not set for user." });
  }

  const isPinValid = await bcrypt.compare(pin, storedPinHash);
  if (!isPinValid) {
    return res.status(401).json({ status: false, message: "Invalid PIN provided." });
  }

  // ✅ Validate amount
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ status: false, message: "Invalid amount provided." });
  }

  // ✅ Validate network type
  const network = type.toLowerCase();
  if (!ALLOWED_NETWORK_TYPES.includes(network)) {
    return res.status(400).json({ status: false, message: "Invalid network type provided." });
  }

  // ✅ Step 1: Check user balance
  const balanceCheck = await checkUserBalance(userId, parsedAmount);
  if (!balanceCheck.status) {
    return res.status(400).json(balanceCheck);
  }

  // ✅ Step 2: Attempt Airtime Recharge
  const result = await rechargeAirtime(parsedAmount, network, phone);
  if (!result.success) {
    return res.status(400).json({
      status: false,
      message: result.error || "Airtime recharge failed.",
    });
  }

  const vtpassTransaction = result?.data?.content?.transactions || {};
  const transactionStatus = vtpassTransaction?.status?.toLowerCase() === "delivered" ? "successful" : "failed";

  // ✅ Step 3: Update balance if recharge was successful
  if (transactionStatus === "successful") {
    const newBalance = balanceCheck.balance - parsedAmount;
    try {
      await updateUserBalance(userId, newBalance);
    } catch (err) {
      console.error("❌ Failed to update user balance:", err);
      return res.status(500).json({
        status: false,
        message: "Recharge completed but balance update failed.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Airtime purchase successful.",
      data: vtpassTransaction,
    });
  }

  // ❌ Fallback: Recharge failed
  return res.status(400).json({
    status: false,
    message: "Airtime recharge failed. Please try again.",
  });
});

module.exports = {
  airtimePurchase,
};

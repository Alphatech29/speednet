const asyncHandler = require("../../middleware/asyncHandler");
const { rechargeAirtime, dataVariations, rechargeData } = require("../../utility/vtpass");
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
    console.error("Error in checkUserBalance:", error);
    return {
      status: false,
      message: "Error checking user balance.",
    };
  }
};

// Airtime Purchase Handler
const airtimePurchase = asyncHandler(async (req, res) => {
  const { amount, phone, type, pin } = req.body;
  const userId = req.user?.userId;

  if (!amount || !phone || !type || !pin) {
    return res.status(400).json({ status: false, message: "Missing required fields." });
  }

  // Validate PIN
  const pinValidation = await validateTransactionPin(userId, pin);
  if (!pinValidation.success) {
    return res.status(pinValidation.code || 401).json({
      status: false,
      message: pinValidation.message || "PIN validation failed.",
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

  // Convert amount to dollars
  let amountInDollar;
  try {
    amountInDollar = await convertNairaToDollar(parsedAmount);
  } catch (error) {
    console.error("Currency conversion error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to convert Naira to Dollar.",
    });
  }

  // Check user balance
  const balanceCheck = await checkUserBalance(userId, amountInDollar);
  if (!balanceCheck.status) {
    return res.status(400).json(balanceCheck);
  }

  // Attempt Airtime Recharge
  let result;
  try {
    result = await rechargeAirtime(parsedAmount, network, phone);
  } catch (error) {
    console.error("Airtime recharge error:", error);
    return res.status(500).json({
      status: false,
      message: "Airtime recharge failed due to an internal error.",
    });
  }

  const vtpassTransaction = result?.data?.content?.transactions || {};
  const transactionStatus = vtpassTransaction?.status?.toLowerCase() === "delivered" ? "successful" : "failed";

  if (transactionStatus === "successful") {
    // Deduct user balance only if recharge is successful
    try {
      const newBalance = balanceCheck.balance - amountInDollar;
      await updateUserBalance(userId, newBalance);
    } catch (err) {
      console.error("Failed to deduct user balance:", err);
      return res.status(500).json({
        status: false,
        message: "Failed to update user balance after successful recharge.",
      });
    }

    // Log transaction history
    try {
      const vtpassType = vtpassTransaction?.type || type.toUpperCase();
      const transactionNoFromApi = result.data.requestId || null;
      await createTransactionHistory(userId, amountInDollar, vtpassType, transactionStatus, transactionNoFromApi);
    } catch (err) {
      console.error("Failed to log transaction history:", err);
    }

    return res.status(200).json({
      status: true,
      message: "Airtime purchase successful.",
      data: vtpassTransaction,
    });
  }

  // Recharge failed - log warning and return failure response
  console.warn(`Airtime recharge failed for user ${userId}. Amount $${amountInDollar} not deducted.`);

  return res.status(400).json({
    status: false,
    message: "Airtime recharge failed. No balance was deducted.",
  });
});


// Data Purchase Handler
const dataPurchase = asyncHandler(async (req, res) => {
  const { amount, phone, serviceID, pin, variation_code } = req.body;
  const userId = req.user?.userId;

  if (!amount || !phone || !serviceID || !pin || !variation_code) {
    return res.status(400).json({ status: false, message: "Missing required fields." });
  }

  // Validate PIN
  const pinValidation = await validateTransactionPin(userId, pin);
  if (!pinValidation.success) {
    return res.status(pinValidation.code || 401).json({
      status: false,
      message: pinValidation.message || "PIN validation failed.",
    });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ status: false, message: "Invalid amount provided." });
  }

  // Convert amount to dollars
  let amountInDollar;
  try {
    amountInDollar = await convertNairaToDollar(parsedAmount);
  } catch (error) {
    console.error("Currency conversion error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to convert Naira to Dollar.",
    });
  }

  // Check user balance
  const balanceCheck = await checkUserBalance(userId, amountInDollar);
  if (!balanceCheck.status) {
    return res.status(400).json(balanceCheck);
  }

  // Call rechargeData with properly destructured parameters
  let result;
  try {
    result = await rechargeData(parsedAmount, serviceID.toLowerCase(), phone, variation_code);
  } catch (error) {
    console.error("Data recharge error:", error);
    return res.status(500).json({
      status: false,
      message: "Data recharge failed due to an internal error.",
    });
  }

  const vtpassTransaction = result?.data?.content?.transactions || {};
  const transactionStatus = vtpassTransaction?.status?.toLowerCase() === "delivered" ? "successful" : "failed";

  if (transactionStatus === "successful") {
    // Deduct user balance only if recharge is successful
    try {
      const newBalance = balanceCheck.balance - amountInDollar;
      await updateUserBalance(userId, newBalance);
    } catch (err) {
      console.error("Failed to deduct user balance:", err);
      return res.status(500).json({
        status: false,
        message: "Failed to update user balance after successful recharge.",
      });
    }

    // Log transaction history
    try {
      const vtpassType = vtpassTransaction?.product_name || serviceID.toUpperCase();
      const transactionNoFromApi = result.data.requestId || null;
      await createTransactionHistory(userId, amountInDollar, vtpassType, transactionStatus, transactionNoFromApi);
    } catch (err) {
      console.error("Failed to log transaction history:", err);
    }

    return res.status(200).json({
      status: true,
      message: "Data purchase successful.",
      data: vtpassTransaction,
    });
  }

  console.warn(`Data recharge failed for user ${userId}. Amount $${amountInDollar} not deducted.`);

  return res.status(400).json({
    status: false,
    message: "Data recharge failed. No balance was deducted.",
  });
});


// Get Data Variations Handler
const getDataVariations = asyncHandler(async (req, res) => {
  const { serviceID } = req.params;

  if (!serviceID) {
    return res.status(400).json({ success: false, error: "Missing serviceID in route." });
  }

  try {
    const result = await dataVariations(serviceID);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("Error fetching data variations:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch data variations.",
    });
  }
});

module.exports = {
  airtimePurchase,
  getDataVariations,
  dataPurchase,
};

const asyncHandler = require("../../middleWare/asyncHandler");
const { rechargeAirtime, dataVariations, rechargeData, rechargeInternationalAirtime  } = require("../../utility/vtpass");
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


// International Airtime/Data/PIN Purchase Handler
const internationalPurchase = asyncHandler(async (req, res) => {
  const {
    phone,
    email,
    pin,
    operatorId,
    variationCode,
    countryCode,
    productTypeId,
    amount,
  } = req.body;

  const userId = req.user?.userId;

  console.log("📥 Incoming request body:", req.body);
  console.log("👤 Authenticated user ID:", userId);

  // Check required fields
  if (
    !phone ||
    !email ||
    !pin ||
    !operatorId ||
    !variationCode ||
    !countryCode ||
    !productTypeId
  ) {
    console.warn("⚠️ Missing required fields.");
    return res.status(400).json({ status: false, message: "Missing required fields." });
  }

  const parsedPhone = Number(phone);
  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedPhone)) {
    return res.status(400).json({ status: false, message: "Invalid phone number format." });
  }

  // Validate PIN
  console.log("🔐 Validating transaction PIN...");
  const pinValidation = await validateTransactionPin(userId, pin);
  console.log("🔐 PIN validation result:", pinValidation);

  if (!pinValidation.success) {
    return res.status(pinValidation.code || 401).json({
      status: false,
      message: pinValidation.message || "PIN validation failed.",
    });
  }

  // Convert Naira to Dollar for wallet deduction (even if VTpass ignores it)
  let amountInDollar;
  try {
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new Error("Invalid amount.");
    }
    console.log("💱 Converting amount to USD...");
    amountInDollar = await convertNairaToDollar(parsedAmount);
    console.log(`💵 Converted ₦${parsedAmount} => $${amountInDollar}`);
  } catch (error) {
    console.error("❌ Currency conversion error:", error.message);
    return res.status(400).json({ status: false, message: error.message });
  }

  // Check user wallet balance
  console.log("Checking user balance...");
  const balanceCheck = await checkUserBalance(userId, amountInDollar);
  console.log(" Balance check result:", balanceCheck);

  if (!balanceCheck.status) {
    return res.status(400).json(balanceCheck);
  }

  // Make recharge call
  let result;
  try {
    console.log(" Processing international airtime recharge...");
    result = await rechargeInternationalAirtime({
      variationCode: String(variationCode),
      operatorId: String(operatorId),
      countryCode: String(countryCode),
      phone: parsedPhone,
      email: String(email),
      productTypeId: String(productTypeId),
      amount: parsedAmount,
    });

    console.log("🌍 Recharge result:", result);
  } catch (error) {
    console.error("❌ International recharge error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Recharge failed due to an internal error.",
    });
  }

  const vtpassTransaction = result?.data?.content?.transactions || {};
  const transactionStatus = vtpassTransaction?.status?.toLowerCase() === "delivered"
    ? "successful"
    : "failed";

  if (transactionStatus === "successful") {
    try {
      const newBalance = balanceCheck.balance - amountInDollar;
      console.log(`💸 Updating user balance: Old: ${balanceCheck.balance} | New: ${newBalance}`);
      await updateUserBalance(userId, newBalance);
    } catch (err) {
      console.error("❌ Failed to deduct user balance:", err.message);
      return res.status(500).json({
        status: false,
        message: "Failed to update user balance after successful recharge.",
      });
    }

    try {
      const vtpassType = vtpassTransaction?.product_name || "INTERNATIONAL";
      const transactionNoFromApi = result.data.requestId || null;
      console.log("🗃️ Logging transaction history...");
      await createTransactionHistory(userId, amountInDollar, vtpassType, transactionStatus, transactionNoFromApi);
    } catch (err) {
      console.error("❌ Failed to log transaction history:", err.message);
    }

    return res.status(200).json({
      status: true,
      message: "International purchase successful.",
      data: vtpassTransaction,
    });
  }

  console.warn("❌ Recharge failed or not delivered. No deduction made.");
  return res.status(400).json({
    status: false,
    message: result?.error || "Recharge failed. No balance was deducted.",
  });
});




module.exports = {
  airtimePurchase,
  getDataVariations,
  dataPurchase,
  internationalPurchase
};

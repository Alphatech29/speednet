const { 
  getAllNordVPNPackages, 
  getAllNordHistory 
} = require("../../utility/nordVpn");

const {
  getUserDetailsByUid,
  updateUserBalance,
} = require("../../utility/userInfo");

const { createTransactionHistory } = require("../../utility/history");
const { handleNordSubscription } = require("../../utility/nordLogic");

const NordPurchase = async (req, res) => {
  const payload = req.body;
  console.log("Received NordVPN purchase payload:", payload);

  const userId = req.user?.userId;
  const { email, full_name, country, zip_code, plan, total } = payload;

  if (!userId || !email || !plan || !plan.package_name || !total || !full_name || !country || !zip_code) {
    return res.status(400).json({
      success: false,
      message: "Please login and provide all required fields to make a purchase",
    });
  }

  try {
    const user = await getUserDetailsByUid(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const currentBalance = Number(user.account_balance ?? 0);
    const purchaseAmount = Number(total);

    if (currentBalance < purchaseAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

    try {
      await handleNordSubscription(email, plan, userId, full_name, country, zip_code);
      console.log("handleNordSubscription executed.");
    } catch (subscriptionError) {
      console.error("Error in handleNordSubscription:", subscriptionError);
      return res.status(500).json({
        success: false,
        message: "Failed to process NordVPN subscription.",
        error: subscriptionError.message || "Unknown error",
      });
    }

    const newBalance = currentBalance - purchaseAmount;
    const updateResult = await updateUserBalance(userId, newBalance);

    if (!updateResult.success) {
      console.error("Failed to update user balance");
      return res.status(500).json({
        success: false,
        message: "Failed to update account balance.",
      });
    }

    const txnResult = await createTransactionHistory(
      userId,
      purchaseAmount,
      `Nordvpn_${plan.package_name}`,
      "completed"
    );

    if (!txnResult.success) {
      console.warn("Failed to log transaction history:", txnResult.message);
    } else {
      console.log("Transaction history logged:", txnResult.transaction_no);
    }

    return res.status(201).json({
      success: true,
      message: `Nordvpn_${plan.package_name} purchase successful`,
      data: {
        email,
        full_name,
        country,
        zip_code,
        plan,
        total,
        package: `Nordvpn_${plan.package_name}`,
      },
      balance: newBalance,
      transaction: txnResult.transaction_no ?? null,
    });
  } catch (error) {
    console.error("Unexpected error in NordPurchase:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while processing your NordVPN purchase.",
      error: error.message || "Unknown server error",
    });
  }
};

const fetchAllPackages = async (req, res) => {
  try {
    const packages = await getAllNordVPNPackages();
    return res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("Error fetching NordVPN packages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve NordVPN packages.",
    });
  }
};

// ✅ NEW: Controller to fetch all nord_history with user details
const fetchAllNordHistory = async (req, res) => {
  try {
    const history = await getAllNordHistory();
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching NordVPN history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve NordVPN purchase history.",
    });
  }
};

module.exports = {
  fetchAllPackages,
  NordPurchase,
  fetchAllNordHistory // ← make sure this is exported
};

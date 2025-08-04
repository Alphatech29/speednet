const { getAllNordVPNPackages } = require("../../utility/nordVpn");
const { getUserDetailsByUid, updateUserBalance } = require("../../utility/userInfo");
const { createTransactionHistory } = require("../../utility/history");

const NordPurchase = async (req, res) => {
  const payload = req.body;
  console.log("🛒 Received NordVPN purchase payload:", payload);

  const userId = req.user?.userId;
  const { email, plan, total } = payload;

  // Basic input validation
  if (!userId || !email || !plan || !plan.package_name || !total) {
    return res.status(400).json({
      success: false,
      message: "Please login and provide all required fields to make a purchase",
    });
  }

  try {
    // Fetch user details
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

    // Update user balance
    const newBalance = currentBalance - purchaseAmount;
    const updateResult = await updateUserBalance(userId, newBalance);

    if (!updateResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to update account balance.",
      });
    }

    // Create transaction history
    const txnResult = await createTransactionHistory(
      userId,
      purchaseAmount,
      `Nordvpn_${plan.package_name}`,
      "completed"
    );

    if (!txnResult.success) {
      console.warn(" Failed to log transaction history:", txnResult.message);
    } else {
      console.log(" Transaction history logged successfully:", txnResult.transaction_no);
    }

    return res.status(201).json({
      success: true,
      message: "Purchase created successfully.",
      data: {
        email,
        plan,
        total,
        package: `Nordvpn_${plan.package_name}`,
      },
      balance: newBalance,
      transaction: txnResult.transaction_no ?? null,
    });

  } catch (error) {
    console.error(" Error during NordVPN purchase:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process NordVPN purchase.",
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
    console.error(" Error fetching NordVPN packages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve NordVPN packages.",
    });
  }
};

module.exports = {
  fetchAllPackages,
  NordPurchase,
};

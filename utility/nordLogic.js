const pool = require("../model/db");
const { createNordHistory } = require("./nordVpn");
const {
  sendLowNordBalanceAlertEmailToAdmin,
} = require("../email/mails/nordAdminBalance");

async function handleNordSubscription(
  email,
  plan,
  user_id,
  full_name,
  country,
  zip_code
) {
  try {
    // Fetch admin balance
    const [rows] = await pool.query("SELECT balance FROM admin LIMIT 1");

    if (!rows || rows.length === 0) {
      throw new Error("Admin record not found.");
    }

    const adminBalance = Number(rows[0].balance ?? 0);
    const amount = Number(plan.amount);

    console.log("Admin Balance:", adminBalance, "Plan Amount:", amount);

    // Ensure balance does not go below 200
    const minimumBalance = 200;
    if (adminBalance - amount < minimumBalance) {
      // Send alert email in background
      sendLowNordBalanceAlertEmailToAdmin({
        balance: adminBalance.toFixed(2),
        currencySymbol: "$",
      })
        .then(() => {
          console.log(" Low balance alert email sent in background.");
        })
        .catch((err) => {
          console.error(" Failed to send low balance email:", err.message);
        });

      throw new Error(
        "Insufficient admin balance to process subscription. Minimum balance of $200 must be maintained."
      );
    }

    // Deduct from admin balance
    await pool.query("UPDATE admin SET balance = balance - ? LIMIT 1", [
      amount,
    ]);
    console.log(`Deducted $${amount} from admin balance.`);

    // Log to subscription history
    await createNordHistory({
      user_id,
      plan_id: plan.id,
      amount,
      status: "completed",
      email,
      full_name,
      country,
      zip_code,
    });

    console.log("Subscription history saved.");
    console.log("handleNordSubscription completed successfully.");

    return {
      success: true,
      message: "Subscription processed.",
      deducted: amount,
      remainingBalance: adminBalance - amount,
    };
  } catch (error) {
    console.error("handleNordSubscription Error:", error.message);
    throw new Error(`Subscription failed: ${error.message}`);
  }
}

module.exports = { handleNordSubscription };

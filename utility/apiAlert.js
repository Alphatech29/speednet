const cron = require("node-cron");
const { apis } = require("./apis");
const sendApiExpiryAlertToAdmin = require("../email/mails/sendApiExpiryAlertToAdmin");

const ALERT_THRESHOLD_DAYS = 10;

const checkAndSendAlerts = async () => {
  for (const api of apis) {
    // Skip Chat IPv4 API
    if (api.name.toLowerCase().includes("chat ipv4 api")) {
      console.log(`Skipping alert for Chat IPv4 API: ${api.name}`);
      continue;
    }

    // Determine alert type
    let type = null;
    if (api.days_remaining === 0) {
      type = "expired";
    } else if (api.days_remaining <= ALERT_THRESHOLD_DAYS) {
      type = "aboutToExpire";
    }

    if (type) {
      try {
        await sendApiExpiryAlertToAdmin({ api, type });
        console.log(
          `Alert sent: ${api.name} ${
            type === "expired"
              ? "has expired."
              : `is expiring in ${api.days_remaining} days.`
          }`
        );
      } catch (err) {
        console.error("Failed to send API alert:", err);
      }
    }
  }
};

// Run immediately on server start
console.log("Running immediate test...");
checkAndSendAlerts();

// Schedule daily at midnight (00:00)
cron.schedule("0 0 * * *", () => {
  console.log("Running daily API expiry check at midnight...");
  checkAndSendAlerts();
});

module.exports = { checkAndSendAlerts };

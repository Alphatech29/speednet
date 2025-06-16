const db = require("../model/db");
const logger = require("../utility/logger");

const getWebSettings = async (req, res) => {
  try {
    // ✅ Fetch web settings from database
    const [rows] = await db.execute("SELECT * FROM web_settings LIMIT 1");

    if (!rows || rows.length === 0) {
      logger.error("Web settings not found.");
      if (res) return res.status(404).json({ error: "Web settings not found" });
      return null;
    }

    const settings = rows[0];

    if (!settings.merchant_activation_fee) {
      logger.error("Error: 'merchant_activation_fee' is missing in web_settings");
    }

    // ✅ If used as API, send JSON response
    if (res) return res.status(200).json(settings);

    return settings;
  } catch (error) {
    logger.error(`Database error: ${error.message || error}`);
    if (res) return res.status(500).json({ error: "Internal server error" });
    return null;
  }
};

// ✅ New function to get referral_commission
const getReferralCommission = async () => {
  try {
    const [rows] = await db.execute("SELECT referral_commission FROM web_settings LIMIT 1");

    if (!rows || rows.length === 0) {
      logger.error("Referral commission not found in web_settings.");
      return null;
    }

    const { referral_commission } = rows[0];

    if (referral_commission === undefined || referral_commission === null) {
      logger.error("Missing 'referral_commission' in web_settings.");
      return null;
    }

    return referral_commission;
  } catch (error) {
    logger.error(`Failed to fetch referral_commission: ${error.message || error}`);
    return null;
  }
};

module.exports = {
  getWebSettings,
  getReferralCommission,
};

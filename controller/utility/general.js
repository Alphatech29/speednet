const db = require("../../model/db");

const getWebSettings = async (req, res) => {
  try {
    // ✅ Fetch web settings from database
    const [rows] = await db.execute("SELECT * FROM web_settings LIMIT 1");

    if (!rows || rows.length === 0) {
      console.error("❌ Web settings not found.");
      if (res) return res.status(404).json({ error: "Web settings not found" });
      return null;
    }

    const settings = rows[0];

    console.log("✅ Web settings fetched:", settings);

    if (!settings.merchant_activation_fee) {
      console.error("❌ Error: 'merchant_activation_fee' is missing in web_settings");
    }

    // ✅ If used as API, send JSON response
    if (res) return res.status(200).json(settings);

    return settings;
  } catch (error) {
    console.error("❌ Database error:", error.message || error);
    if (res) return res.status(500).json({ error: "Internal server error" });
    return null;
  }
};

module.exports = { getWebSettings };

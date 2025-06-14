const db = require("../../../model/db");

// This function retrieves all web settings from the database.
const getAllWebSettings = async (req, res) => {
  try {
    const [settings] = await db.execute(`
      SELECT * FROM web_settings
    `);

    if (!settings || settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No web settings found",
      });
    }

    return res.status(200).json({
      success: true,
      count: settings.length,
      data: settings,
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Update web settings (only changed fields)
const updateWebSettings = async (req, res) => {
  try {
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update.",
      });
    }

    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }

    const sql = `UPDATE web_settings SET ${setClauses.join(", ")} LIMIT 1`;

    const [result] = await db.execute(sql, values);

    // ✅ Log the update
    console.log("✅ Web settings updated at", new Date().toISOString());
    console.log("Updated fields:", updates);

    return res.status(200).json({
      success: true,
      message: "Web settings updated successfully",
      data: updates,
    });

  } catch (error) {
    console.error("❌ Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



module.exports = {
  getAllWebSettings,  updateWebSettings
};

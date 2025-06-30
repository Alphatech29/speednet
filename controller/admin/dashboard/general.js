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
    const files = req.files;
    const body = req.body;

    const updatedData = {};

    // Add image paths from files if uploaded
    if (files?.logo?.[0]) {
      updatedData.logo = `/uploads/${files.logo[0].filename}`;
    }

    if (files?.favicon?.[0]) {
      updatedData.favicon = `/uploads/${files.favicon[0].filename}`;
    }

    // Merge text fields
    for (const [key, value] of Object.entries(body)) {
      updatedData[key] = value;
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ success: false, message: "No data to update." });
    }

    // Build dynamic SQL
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updatedData)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }

    const sql = `UPDATE web_settings SET ${setClauses.join(', ')} LIMIT 1`;

    const [result] = await db.execute(sql, values);

    return res.status(200).json({
      success: true,
      message: "Web settings updated successfully.",
      data: updatedData,
    });

  } catch (error) {
    console.error("Error updating web settings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


module.exports = {
  getAllWebSettings,  updateWebSettings
};

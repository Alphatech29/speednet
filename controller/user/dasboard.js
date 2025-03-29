const db = require("../../model/db"); 

const getUserDetails = async (req, res) => {
  try {
    if (!req || !res) {
      console.error("Request or response object is missing");
      return;
    }

    // Extract UID safely from params, query, or body
    const uid = req.params?.uid || req.body?.uid || req.query?.uid;

    // Validate UID (Ensure it's a number)
    if (!uid || isNaN(uid)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Secure SQL Query using placeholders
    const [rows] = await db.query("SELECT * FROM users WHERE uid = ?", [uid]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Database error:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserDetails };

const db = require("../../model/db");

const getUser = async (req, res) => {
  try {
    const { userUid } = req.params;

    // ✅ Validate userUid
    if (!userUid || typeof userUid !== "string") {
      console.error("❌ Invalid userUid provided:", userUid);
      return res.status(400).json({ error: "Invalid user UID" });
    }

    // ✅ Fetch user from the database
    const [rows] = await db.execute("SELECT * FROM users WHERE uid = ? LIMIT 1", [userUid]);

    if (!rows || rows.length === 0) {
      console.error("❌ User not found:", userUid);
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(rows[0]);

  } catch (error) {
    console.error("❌ Database error:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUser };

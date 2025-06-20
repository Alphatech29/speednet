const pool = require('../model/db');

const getUserPinByUid = async (uid) => {
  try {
    const [rows] = await pool.query("SELECT pin FROM users WHERE uid = ? LIMIT 1", [uid]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0].pin;
  } catch (error) {
    console.error("❌ Error fetching user PIN:", error.message);
    throw new Error("Database error fetching PIN.");
  }
};

module.exports = { getUserPinByUid };

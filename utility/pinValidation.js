const pool = require('../model/db');

// This function retrieves the user's PIN from the database by their UID
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

// This function inserts or updates the user's PIN in the database
const insertUserPinByUid = async (uid, hashedPin) => {
  try {
    const [rows] = await pool.query(
      "UPDATE users SET pin = ? WHERE uid = ?",
      [hashedPin, uid]
    );

    if (rows.affectedRows === 0) {
      throw new Error("User not found or update failed.");
    }

    return { success: true, message: "PIN set successfully." };
  } catch (error) {
    console.error("❌ Error inserting user PIN:", error.message);
    throw new Error("Failed to set user PIN.");
  }
};

module.exports = {
  getUserPinByUid,
  insertUserPinByUid,
};

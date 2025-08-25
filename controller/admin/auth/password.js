const bcrypt = require("bcryptjs");
const pool = require("../../../model/db");

const adminUpdatePassword = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { oldPassword, newPassword } = req.body;


    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "Old and new passwords are required",
      });
    }

    // Validate new password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        code: "WEAK_PASSWORD",
        message:
          "New password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // Get admin from DB
    const query = `SELECT * FROM admin WHERE uid = ? LIMIT 1`;
    const [results] = await pool.query(query, [userId]);

    if (!results || results.length === 0) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "Admin account not found",
      });
    }

    const admin = results[0];

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        code: "INVALID_PASSWORD",
        message: "Old password is incorrect",
      });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE admin SET password = ? WHERE uid = ?`, [hashedPassword, userId]);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("System Error:", error.message);
    return res.status(500).json({
      code: "SYSTEM_ERROR",
      message: "Internal system error while updating password",
    });
  }
};

module.exports = adminUpdatePassword;

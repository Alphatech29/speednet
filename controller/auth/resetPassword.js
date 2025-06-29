const jwt = require("jsonwebtoken");
const pool = require("../../model/db");

const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;

    // Validate input
    if (!token || !password?.trim()) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "Token and password are required.",
      });
    }

    // 🔐 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        code: "INVALID_OR_EXPIRED_TOKEN",
        message: "Token is invalid or has expired.",
      });
    }

    const userEmail = decoded.email;

    // Find user
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [userEmail]);
    if (!results || results.length === 0) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User does not exist.",
      });
    }

    const user = results[0];

    // Hash new password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await pool.query("UPDATE users SET password = ? WHERE uid = ?", [hashedPassword, user.uid]);

    return res.json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(500).json({
      code: "SYSTEM_ERROR",
      message: "Internal server error.",
    });
  }
};

module.exports = { resetPassword };

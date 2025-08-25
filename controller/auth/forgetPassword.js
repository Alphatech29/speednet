const jwt = require("jsonwebtoken");
const pool = require("../../model/db");
const { getWebSettings } = require("../../utility/general");
const { sendResetPasswordEmail } = require("../../email/mails/resetPassword");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        code: "INVALID_EMAIL",
        message: "Email is required",
      });
    }

    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email.trim(),
    ]);

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ code: "USER_NOT_FOUND", message: "No user with that email" });
    }

    const user = results[0];

    // 🔐 Generate JWT with 10-minute expiry
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const settings = await getWebSettings();
    const resetLink = `${settings.web_url}/auth/reset-password/${token}`;

   await sendResetPasswordEmail(user.email, user.full_name, resetLink);


    return res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    return res.status(500).json({
      code: "SYSTEM_ERROR",
      message: "Internal server error",
    });
  }
};

module.exports = { forgotPassword };

const bcrypt = require("bcryptjs");
const pool = require("../../model/db");
const jwt = require("jsonwebtoken");
const { sendLoginNotificationEmail } = require("../../email/mails/login");

const validateJWTConfig = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("Invalid JWT_SECRET configuration");
  }
};

const login = async (req, res) => {
  try {
    console.log("SignIn attempt:", req.body);

    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Email and Password are required",
      });
    }

    validateJWTConfig();

    const sanitizedInput = email.trim();
    const passwordInput = password.trim();

    const query = `SELECT * FROM users WHERE email = ?`;
    const [results] = await pool.query(query, [sanitizedInput]);

    if (!results || results.length === 0) {
      return res.status(404).json({ code: "USER_NOT_FOUND", message: "Account not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(passwordInput, user.password);

    if (!isMatch) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Incorrect password" });
    }

    delete user.password;

    const token = jwt.sign({ userId: user.uid }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // ✅ Send login notification email
    try {
      await sendLoginNotificationEmail(user, req.ip, req.headers['user-agent']);
      console.log("📧 Login notification email sent");
    } catch (emailErr) {
      console.error("⚠️ Failed to send login notification email:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      user,
      tokenMetadata: { expiresIn: 90000000 },
      token,
    });

  } catch (error) {
    console.error("System Error:", error.message);
    return res.status(500).json({ code: "SYSTEM_ERROR", message: "Internal authentication system error" });
  }
};

module.exports = login;

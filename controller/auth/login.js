const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../model/db");
const { sendLoginNotificationEmail } = require("../../email/mails/login");

const ACCESS_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Email and Password are required",
      });
    }

    const [results] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email.trim()]
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ code: "USER_NOT_FOUND", message: "Account not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ code: "INVALID_CREDENTIALS", message: "Incorrect password" });
    }

    delete user.password; // Remove password before logging or sending

    const token = jwt.sign(
      { userId: user.uid },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Set auth cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: ACCESS_EXPIRY,
    });

    try {
      await sendLoginNotificationEmail(user, req.ip, req.headers["user-agent"]);
    } catch (emailErr) {
      console.error(
        "⚠️ Failed to send login notification email:",
        emailErr.message
      );
    }

    return res.status(200).json({
      success: true,
      user,
      tokenMetadata: { expiresIn: ACCESS_EXPIRY },
    });
  } catch (error) {
    console.error("System Error:", error.message);
    return res
      .status(500)
      .json({ code: "SYSTEM_ERROR", message: "Internal authentication system error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  login,
  logout,
};

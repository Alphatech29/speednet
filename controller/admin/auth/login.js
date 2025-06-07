const bcrypt = require("bcryptjs");
const pool = require("../../../model/db");
const jwt = require("jsonwebtoken");

const validateJWTConfig = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("Invalid JWT_SECRET configuration");
  }
};

const adminLogin = async (req, res) => {
  try {
    console.log("Login attempt:", req.body);

    const { username, password } = req.body;

    if (!username || !password || !username.trim() || !password.trim()) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Username and Password are required",
      });
    }

    validateJWTConfig();

    const sanitizedUsername = username.trim();
    const passwordInput = password.trim();

    const query = `SELECT * FROM admin WHERE username = ? LIMIT 1`;
    const [results] = await pool.query(query, [sanitizedUsername]);

    if (!results || results.length === 0) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "Account not found",
      });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(passwordInput, user.password);
    if (!isMatch) {
      return res.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "Incorrect password",
      });
    }

    delete user.password;

    const token = jwt.sign(
      { userId: user.uid }, // ✅ No role included
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      tokenMetadata: { expiresIn: 15 * 60 * 1000 },
      token,
    });

  } catch (error) {
    console.error("System Error:", error.message);
    return res.status(500).json({
      code: "SYSTEM_ERROR",
      message: "Internal authentication system error",
    });
  }
};

module.exports = adminLogin;

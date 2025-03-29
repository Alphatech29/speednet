const bcrypt = require("bcryptjs");
const pool = require("../../model/db");
const jwt = require("jsonwebtoken");

// Validate JWT Secret environment variable
const validateJWTConfig = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("Invalid JWT_SECRET configuration");
  }
};

// Sign-in handler
const login = async (req, res) => {
  try {
    console.log("SignIn attempt:", req.body);

    const { email, password } = req.body;

    // Check for missing credentials
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Email and Password are required",
      });
    }

    validateJWTConfig();

    const sanitizedInput = email.trim();
    const passwordInput = password.trim();

    // Fetch all user details dynamically
    const query = `SELECT * FROM users WHERE email = ?`;
    
    const [results] = await pool.query(query, [sanitizedInput]);

    if (!results || results.length === 0) {
      return res.status(404).json({ code: "USER_NOT_FOUND", message: "Account not found" });
    }

    const user = results[0];

    // Compare password with hash in DB
    const isMatch = await bcrypt.compare(passwordInput, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Incorrect password" });
    }

    // Remove password from user object before sending response
    delete user.password;

    // Generate JWT token
    const token = jwt.sign({ userId: user.uid }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Return all user data dynamically
    return res.status(200).json({
      success: true,
      user, 
      tokenMetadata: {
        expiresIn: 90000000,
      },
      token,
    });
  } catch (error) {
    console.error("System Error:", error.message);
    return res.status(500).json({ code: "SYSTEM_ERROR", message: "Internal authentication system error" });
  }
};

module.exports = login;

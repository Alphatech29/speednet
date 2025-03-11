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
    console.log("SignIn attempt:", req.body); // Log incoming request

    const { email, password } = req.body;

    // Check for missing credentials
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Email and Password are required"
      });
    }

    validateJWTConfig(); // Ensure JWT_SECRET is configured

    const sanitizedInput = email.trim();
    const passwordInput = password.trim();

    // Database query to fetch user by email
    const query = `
      SELECT uid, email, password, full_name, phone_number
      FROM users
      WHERE email = ?
    `;
    
    console.log("Executing DB query...");
    const [results] = await pool.query(query, [sanitizedInput]);
    console.log("DB query results:", results);

    if (!results || results.length === 0) {
      return res.status(404).json({ code: "USER_NOT_FOUND", message: "Account not found" });
    }

    const user = results[0];

    // Compare password with hash in DB
    const isMatch = await bcrypt.compare(passwordInput, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.uid }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Return response with user details and token
    return res.status(200).json({
      success: true,
      user: {
        userId: user.uid,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number
      },
      tokenMetadata: {
        expiresIn: 900
      },
      token: token
    });
  } catch (error) {
    console.error("System Error:", error.message);
    return res.status(500).json({ code: "SYSTEM_ERROR", message: "Internal authentication system error" });
  }
};

module.exports = login;

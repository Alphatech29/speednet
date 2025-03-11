const bcrypt = require("bcryptjs");
const pool = require("../../model/db");

const register = async (req, res) => {
  try {
    console.log("📥 Incoming request data:", req.body);

    const { full_name, email, phone_number, password } = req.body;

    // ✅ Validate inputs
    if (!full_name || !email || !phone_number || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // ✅ Check if email or phone number already exists
    const [results] = await pool.query(
      `SELECT email, phone_number FROM users WHERE email = ? OR phone_number = ?`,
      [email, phone_number]
    );

    if (results.length > 0) {
      const errors = [];
      results.forEach((user) => {
        if (user.email === email) errors.push("Email is already in use");
        if (user.phone_number === phone_number) errors.push("Phone number is already registered");
      });

      return res.status(409).json({
        success: false,
        message: "Registration failed",
        errors, // Sends detailed error list
      });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user into database
    const [insertResult] = await pool.query(
      `INSERT INTO users (full_name, email, phone_number, password) 
       VALUES (?, ?, ?, ?)`,
      [full_name, email, phone_number, hashedPassword]
    );

    console.log("✅ User registered successfully:", {
      userId: insertResult.insertId,
      full_name,
      email,
      phone_number,
    });

    // ✅ Send response to frontend
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        userId: insertResult.insertId,
        full_name,
        email,
        phone_number,
      },
    });
  } catch (error) {
    console.error("❌ Error during sign-up:", error);

    // ✅ Send error response to frontend
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : null, 
    });
  }
};

module.exports = register;

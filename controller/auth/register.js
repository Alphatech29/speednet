const bcrypt = require("bcryptjs");
const pool = require("../../model/db");
const { sendWelcomeEmail } = require("../../email/mails/onboarding");
const { createReferral } = require("../../utility/referral");
const { getUserDetailsByUid } = require("../../utility/userInfo");
const { getReferralCommission } = require("../../utility/general");

const register = async (req, res) => {
  try {
    let { full_name, email, phone_number, password, country, referral_code } = req.body;

    // Trim input values
    full_name = full_name?.trim();
    email = email?.trim();
    phone_number = phone_number?.trim();
    password = password?.trim();
    country = country?.trim();
    referral_code = referral_code?.trim();

    // Validate required fields
    if (!full_name || !email || !phone_number || !password || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Validate email format (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query(
      `SELECT email, phone_number FROM users WHERE email = ? OR phone_number = ?`,
      [email, phone_number]
    );

    if (existingUsers.length > 0) {
      const errors = [];
      existingUsers.forEach((user) => {
        if (user.email === email) errors.push("Email is already in use.");
        if (user.phone_number === phone_number) errors.push("Phone number is already registered.");
      });

      return res.status(409).json({
        success: false,
        message: "Registration failed due to existing credentials.",
        errors,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [insertResult] = await pool.query(
      `INSERT INTO users (full_name, country, email, phone_number, password) 
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, country, email, phone_number, hashedPassword]
    );

    const newUserId = insertResult.insertId;

    const newUser = {
      id: newUserId,
      name: full_name,
      email,
    };

    // Handle referral if code is provided
    if (referral_code) {
      try {
        const referrer = await getUserDetailsByUid(referral_code);
        if (referrer?.uid) {
          const commission = await getReferralCommission() || 0;
          await createReferral(referrer.uid, newUserId, commission, 0);
        } else {
          console.warn("No user found with referral UID:", referral_code);
        }
      } catch (err) {
        console.error("Error processing referral:", err);
      }
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(newUser);
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: newUser,
    });

  } catch (error) {
    console.error("Error during sign-up:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = register;

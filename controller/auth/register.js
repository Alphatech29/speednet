const bcrypt = require("bcryptjs");
const pool = require("../../model/db");
const { sendWelcomeEmail } = require("../../email/mails/onboarding");
const { createReferral } = require("../../utility/referral");
const { getUserDetailsByUid } = require("../../utility/userInfo");
const { getReferralCommission } = require("../../utility/general");

const register = async (req, res) => {
  try {
    console.log("📥 Incoming request data:", req.body);

    const { full_name, email, phone_number, password, country, referral_code } = req.body;

    // Validate inputs
    if (!full_name || !email || !phone_number || !password || !country) {
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

    //  Check if email or phone number already exists
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
        errors,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const [insertResult] = await pool.query(
      `INSERT INTO users (full_name, country, email, phone_number, password) 
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, country, email, phone_number, hashedPassword]
    );

    const newUserId = insertResult.insertId;
    const newUser = {
      id: newUserId,
      name: full_name,
      email: email,
    };

    //  Handle referral logic using UID as referral_code
    if (referral_code) {
      try {
        const referrer = await getUserDetailsByUid(referral_code);
        console.log("🔍 Referrer details:", referrer);

        //  Update here: check for referrer.uid instead of referrer.id
        if (referrer && referrer.uid) {
          const referralCommission = await getReferralCommission() || 0;

          const referralResponse = await createReferral(
            referrer.uid,
            newUserId,
            referralCommission,
            0 
          );

          console.log("🔗 Referral recorded:", referralResponse);
        } else {
          console.warn(" No user found with referral UID:", referral_code);
        }
      } catch (referralErr) {
        console.error("Error processing referral:", referralErr);
      }
    }

    // ✅ Send Welcome Email
    try {
      await sendWelcomeEmail(newUser);
      console.log("📧 Welcome email triggered for:", email);
    } catch (emailErr) {
      console.error("⚠️ Failed to send welcome email:", emailErr);
    }

    // ✅ Final Response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });

  } catch (error) {
    console.error(" Error during sign-up:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : null,
    });
  }
};

module.exports = register;

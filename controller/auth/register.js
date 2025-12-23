const pool = require("../../model/db");
const { sendWelcomeEmail } = require("../../email/mails/welcome-email");
const { createReferral } = require("../../utility/referral");
const { getUserDetailsByUid } = require("../../utility/userInfo");
const { getReferralCommission } = require("../../utility/general");
const { insertUser } = require("../../utility/user");
const logger = require("../../utility/logger");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const register = async (req, res) => {
  try {
    let {
      full_name,
      username,
      email,
      phone_number,
      password,
      country,
      referral_code,
      role,
    } = req.body;

    console.log("Registration request received:", {reqBody: req.body});


    // Trim inputs
    full_name = full_name?.trim();
    username = username?.trim();
    email = email?.trim();
    phone_number = phone_number?.trim();
    password = password?.trim();
    country = country?.trim();
    role = role?.trim();
    referral_code = referral_code?.trim();

    if (!full_name || !username || !email || !phone_number || !password || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    const [existingUsers] = await pool.query(
      `SELECT email, phone_number, username FROM users WHERE email = ? OR phone_number = ? OR username = ?`,
      [email, phone_number, username]
    );

    if (existingUsers.length > 0) {
      const errors = [];
      existingUsers.forEach(user => {
        if (user.email === email) errors.push("Email is already in use.");
        if (user.phone_number === phone_number) errors.push("Phone number is already registered.");
        if (user.username === username) errors.push("Username is already taken.");
      });

      return res.status(409).json({
        success: false,
        message: "Registration failed due to existing credentials.",
        errors,
      });
    }

    const saltRounds = 10;
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (hashError) {
      logger.error("Password hashing failed", { error: hashError.message });
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your password.",
      });
    }

    let userUid;
    try {
      userUid = await insertUser({
        full_name,
        username,
        email,
        phone_number,
        password: hashedPassword,
        country,
        role: role || "user",
      });
    } catch (err) {
      logger.error("Error inserting user", {
        values: { full_name, username, email, phone_number, country },
        error: err.message,
      });

      return res.status(500).json({
        success: false,
        message: "Failed to register user.",
        error: err.message,
      });
    }

    const newUser = {
      uid: userUid,
      full_name,
      email,
      username,
      phone_number,
      country,
    };

  
    if (referral_code) {
      try {
        const referrer = await getUserDetailsByUid(referral_code);
        if (referrer?.uid && newUser.uid) {
          const commission = await getReferralCommission() || 0;
          const referralRes = await createReferral(
            referrer.uid,      // referral1_id
            newUser.uid,       // referral2_id
            commission,        // referral_amount
            0                  // referral_status
          );

          if (referralRes.success) {
            logger.info("Referral created", {
              referral1_id: referrer.uid,
              referral2_id: newUser.uid,
              commission,
            });
          } else {
            console.warn("Referral creation failed", referralRes.error);
            logger.warn("Referral creation failed", {
              referral_code,
              error: referralRes.error,
            });
          }
        } else {
          console.warn("Invalid referral code or missing UID.");
          logger.warn("Invalid referral code or user UID missing", {
            referral_code,
            referrer_uid: referrer?.uid,
            new_user_uid: newUser.uid,
          });
        }
      } catch (referralErr) {
        logger.error("Referral processing failed", {
          referral_code,
          error: referralErr.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: newUser,
    });

    setImmediate(async () => {
      try {
        await sendWelcomeEmail(newUser);
        logger.info("Welcome email sent", { to: email });
      } catch (emailErr) {
        logger.error("Failed to send welcome email", {
          to: email,
          error: emailErr.message,
        });
      }
    });

  } catch (error) {
    logger.error("Unexpected error during registration", {
      error: error.stack || error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = register;

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
    } = req.body;

    // Trim inputs
    full_name = full_name?.trim();
    username = username?.trim();
    email = email?.trim();
    phone_number = phone_number?.trim();
    password = password?.trim();
    country = country?.trim();
    referral_code = referral_code?.trim();

    logger.info("Received registration request", { email, phone_number });

    // Validate required fields
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

    // Check for existing user
    logger.info("Checking for existing user credentials...");
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

    // Hash the password
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

    // Insert user
    logger.info("Inserting new user...");
    let insertResult;
    try {
      insertResult = await insertUser({
        full_name,
        username,
        email,
        phone_number,
        password: hashedPassword,
        country,
      });

      logger.info("User inserted successfully", { userId: insertResult.uid });
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
      uid: insertResult.uid,
      name: full_name,
      email,
      username,
    };

    // Handle referral
    if (referral_code) {
      try {
        const referrer = await getUserDetailsByUid(referral_code);
        if (referrer?.uid) {
          const commission = await getReferralCommission() || 0;
          await createReferral(referrer.uid, newUser.uid, commission, 0);
          logger.info("Referral created", { referrerId: referrer.uid, refereeId: newUser.uid });
        } else {
          logger.warn("Invalid referral code used", { referral_code });
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

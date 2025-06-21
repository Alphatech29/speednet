const bcrypt = require("bcryptjs");
const { getUserPinByUid, insertUserPinByUid } = require("../../utility/pinValidation");

/**
 * Set or update a user's transaction PIN
 */
const setTransactionPin = async (req, res) => {
  const userId = req.user?.userId;
  const { newPin, oldPin } = req.body;

  // Validate input
  if (!userId || !/^\d{4}$/.test(newPin)) {
    return res.status(400).json({
      status: false,
      message: "Invalid request. A 4-digit newPin is required.",
    });
  }

  try {
    const existingHashedPin = await getUserPinByUid(userId);

    if (existingHashedPin) {
      // Changing PIN — validate oldPin
      if (!oldPin || !/^\d{4}$/.test(oldPin)) {
        return res.status(400).json({
          status: false,
          message: "Old PIN is required to change your PIN.",
        });
      }

      const isOldPinCorrect = await bcrypt.compare(oldPin, existingHashedPin);
      if (!isOldPinCorrect) {
        return res.status(401).json({
          status: false,
          message: "Old PIN is incorrect.",
        });
      }
    }

    // Hash and store new PIN
    const hashedNewPin = await bcrypt.hash(newPin, 10);
    await insertUserPinByUid(userId, hashedNewPin);

    return res.status(200).json({
      status: true,
      message: existingHashedPin
        ? "PIN changed successfully."
        : "Transaction PIN set successfully.",
    });

  } catch (err) {
    console.error(" Error setting PIN:", err.message);
    return res.status(500).json({
      status: false,
      message: "An error occurred while setting your PIN.",
    });
  }
};

/**
 * Validate a user's transaction PIN
 */
const validateTransactionPin = async (userId, pin) => {
  if (!userId || !pin) {
    return {
      success: false,
      code: 400,
      message: "User ID and PIN are required.",
    };
  }

  try {
    const hashedPin = await getUserPinByUid(userId);
    if (!hashedPin) {
      return {
        success: false,
        code: 404,
        message: "No PIN set for this user.",
      };
    }

    const isMatch = await bcrypt.compare(pin, hashedPin);
    if (!isMatch) {
      return {
        success: false,
        code: 401,
        message: "Incorrect transaction PIN.",
      };
    }

    return {
      success: true,
      message: "PIN validated successfully.",
    };
  } catch (err) {
    console.error(" Error validating PIN:", err.message);
    return {
      success: false,
      code: 500,
      message: "Internal error during PIN validation.",
    };
  }
};


module.exports = {
  setTransactionPin,
  validateTransactionPin,
};

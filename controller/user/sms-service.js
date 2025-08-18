// controllers/onlinesimController.js
const {
  getTariffs,
  getServicesByCountry,
  buyNumber,
  getState,
} = require("../../utility/smsActivate");

const { getUserDetailsByUid, updateUserBalance } = require("../../utility/userInfo");
const { createSmsServiceRecord, createTransactionHistory } = require("../../utility/history");
const { startSmsCountdown } = require("../../utility/smsTimeEngine");
const {getWebSettings} = require("../../utility/general");

// Fetch OnlineSim Countries
const fetchOnlineSimCountries = async (req, res) => {
  try {
    const apiResponse = await getTariffs();

    if (!apiResponse || typeof apiResponse !== "object" || !apiResponse.countries) {
      console.warn("[fetchOnlineSimCountries] Invalid API response structure:", apiResponse);
      return res.status(502).json({
        response: 0,
        error: "Invalid response structure from OnlineSim (countries)",
      });
    }

    return res.status(200).json({
      response: 1,
      countries: apiResponse.countries,
    });
  } catch (error) {
    console.error("[fetchOnlineSimCountries] Error fetching OnlineSim countries:", error);
    return res.status(500).json({
      response: 0,
      error: error.message || "Internal server error",
    });
  }
};


// Fetch OnlineSim Services by Country
const fetchOnlineSimServicesByCountry = async (req, res) => {
  try {
    const { countryCode } = req.params;

    if (!countryCode) {
      return res.status(400).json({
        response: 0,
        error: "Missing country code parameter",
      });
    }

    const apiResponse = await getServicesByCountry(countryCode);
    if (!apiResponse || typeof apiResponse !== "object" || typeof apiResponse.services !== "object") {
      return res.status(502).json({
        response: 0,
        error: "Invalid response structure from OnlineSim (services)",
      });
    }

    const webSettings = await getWebSettings();
    const ratePercent = Number(webSettings?.onlinesim_rate || 0);

    const adjustedServices = {};
    for (const [serviceName, serviceData] of Object.entries(apiResponse.services)) {
      const basePrice = Number(serviceData?.price || 0);
      const newPrice = basePrice + (basePrice * (ratePercent / 100));

      adjustedServices[serviceName] = {
        ...serviceData,
        price: Number(newPrice.toFixed(4)),
      };
    }

    return res.status(200).json({
      response: 1,
      countryCode,
      services: adjustedServices,
      rateApplied: `${ratePercent}%`,
    });
  } catch (error) {
    console.error("[fetchOnlineSimServicesByCountry] Error:", error);
    return res.status(500).json({
      response: 0,
      error: error.message || "Internal server error",
    });
  }
};


// Buy OnlineSim Number
const buyOnlineSimNumber = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ response: 0, message: "Unauthorized: No user ID found." });

    const currentUser = await getUserDetailsByUid(userId);
    if (!currentUser) return res.status(404).json({ response: 0, message: "User not found." });

    const { service, country, price } = req.body;
    if (!service || typeof service !== "string") return res.status(400).json({ response: 0, message: "Invalid service." });
    if (typeof price !== "number" || price <= 0) return res.status(400).json({ response: 0, message: "Invalid price." });
    if (currentUser.account_balance < price) return res.status(402).json({ response: 0, message: "Insufficient balance." });

    // Call OnlineSim API
    let apiResponse;
    try {
      const result = await buyNumber({ service, country, userId });
      const resultArray = Array.isArray(result) ? result : [result];
      if (!resultArray.length) return res.status(500).json({ response: 0, message: "OnlineSim API returned no data." });
      apiResponse = resultArray[0];
    } catch (apiError) {
      return res.status(502).json({ response: 0, message: apiError.message || "Failed to communicate with OnlineSim API." });
    }

    if (typeof apiResponse.response === "string" && apiResponse.response.startsWith("ERROR")) {
      const errorMap = {
        ERROR_NO_SERVICE: "Requested service is not available.",
        ERROR_NO_NUMBERS: "No numbers available for the requested service and country.",
        ERROR_BALANCE_LOW: "Insufficient balance in OnlineSim account.",
        ERROR_NO_BALANCE: "Insufficient balance in OnlineSim account.",
        ERROR_WRONG_SERVICE: "Invalid service specified."
      };
      return res.status(400).json({
        response: 0,
        message: errorMap[apiResponse.response] || `OnlineSim error: ${apiResponse.response}`,
        error: apiResponse.response
      });
    }

    // Deduct user balance and create records only on success
    if (apiResponse.response === 1 && apiResponse.tzid) {
      const deductionAmount = apiResponse.sum || price;
      const newBalance = currentUser.account_balance - deductionAmount;

      // Update user balance
      await updateUserBalance(userId, newBalance);

      // Create transaction history
      await createTransactionHistory(userId, deductionAmount, "Sms Service Purchase", "completed");

      // Create SMS service record
      const historyRecord = await createSmsServiceRecord(
        userId,
        apiResponse.country,
        deductionAmount,
        apiResponse.service,
        apiResponse.number,
        null,
        apiResponse.tzid,
        0,
        apiResponse.time
      );

      // Start countdown timer
      if (apiResponse.time && apiResponse.tzid) startSmsCountdown(apiResponse.time, apiResponse.tzid);

      return res.status(200).json({
        response: 1,
        message: "Number purchased successfully.",
        data: apiResponse,
        smsRecordId: historyRecord?.insertId || null,
      });
    }

    return res.status(500).json({ response: 0, message: "Unexpected response from OnlineSim.", error: apiResponse });
  } catch (error) {
    console.error("[buyOnlineSimNumber] Internal error:", error);
    return res.status(500).json({
      response: 0,
      message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
      error: process.env.NODE_ENV === "production" ? "Internal server error" : error.stack,
    });
  }
};

// Fetch OnlineSim State
const fetchOnlineSimState = async (req, res) => {
  try {
    const { tzid } = req.params;
    if (!tzid) return res.status(400).json({ response: 0, error: "Missing required parameter: tzid" });

    const apiResponse = await getState(tzid);
    if (!apiResponse || (Array.isArray(apiResponse) && apiResponse.length === 0)) {
      return res.status(502).json({ response: 0, error: "Invalid or empty response from Server." });
    }

    return res.status(200).json({ response: 1, data: apiResponse });
  } catch (error) {
    console.error("[fetchOnlineSimState] Error:", error);
    return res.status(500).json({ response: 0, error: error.message || "Internal server error" });
  }
};

module.exports = {
  fetchOnlineSimCountries,
  fetchOnlineSimServicesByCountry,
  buyOnlineSimNumber,
  fetchOnlineSimState,
};

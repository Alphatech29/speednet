// controllers/onlinesimController.js
const {
  getTariffs,
  getServicesByCountry,
  buyNumber,
  getState,
} = require("../../utility/smsActivate");
const { getUserDetailsByUid } = require("../../utility/userInfo");
const { createSmsServiceRecord } = require("../../utility/history");



const fetchOnlineSimCountries = async (req, res) => {
  try {
    const apiResponse = await getTariffs();

    if (
      !apiResponse ||
      typeof apiResponse !== "object" ||
      !apiResponse.countries
    ) {
      console.warn(
        "[fetchOnlineSimCountries] Invalid API response structure:",
        apiResponse
      );
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
    console.error(
      "[fetchOnlineSimCountries] Error fetching OnlineSim countries:",
      error
    );
    return res.status(500).json({
      response: 0,
      error: error.message || "Internal server error",
    });
  }
};

const fetchOnlineSimServicesByCountry = async (req, res) => {
  try {
    const { countryCode } = req.params;

    if (!countryCode) {
      console.warn(
        "[fetchOnlineSimServicesByCountry] Missing country code parameter"
      );
      return res.status(400).json({
        response: 0,
        error: "Missing country code parameter",
      });
    }

    const apiResponse = await getServicesByCountry(countryCode);

    if (
      !apiResponse ||
      typeof apiResponse !== "object" ||
      typeof apiResponse.services !== "object"
    ) {
      console.warn(
        "[fetchOnlineSimServicesByCountry] Invalid API response structure:",
        apiResponse
      );
      return res.status(502).json({
        response: 0,
        error: "Invalid response structure from OnlineSim (services)",
      });
    }
    return res.status(200).json({
      response: 1,
      countryCode,
      services: apiResponse.services,
    });
  } catch (error) {
    console.error(
      "[fetchOnlineSimServicesByCountry] Error fetching OnlineSim services by country:",
      error
    );
    return res.status(500).json({
      response: 0,
      error: error.message || "Internal server error",
    });
  }
};

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
      let clientMessage = `OnlineSim error: ${apiResponse.response}`;
      if (apiResponse.response === "ERROR_NO_SERVICE") clientMessage = "Requested service is not available.";
      if (apiResponse.response === "ERROR_NO_NUMBERS") clientMessage = "No numbers available for the requested service and country.";
      if (["ERROR_BALANCE_LOW", "ERROR_NO_BALANCE"].includes(apiResponse.response)) clientMessage = "Insufficient balance in OnlineSim account.";
      if (apiResponse.response === "ERROR_WRONG_SERVICE") clientMessage = "Invalid service specified.";
      return res.status(400).json({ response: 0, message: clientMessage, error: apiResponse.response });
    }

    if (apiResponse.response === 1 && apiResponse.tzid) {
      const historyRecord = await createSmsServiceRecord(
        userId,
        apiResponse.country,
        apiResponse.sum || price,
        apiResponse.service,
        apiResponse.number,
        null,
        apiResponse.tzid,
        0,
        apiResponse.time
      );

      return res.status(200).json({
        response: 1,
        message: "Number purchased successfully.",
        data: apiResponse,
        historyRecordId: historyRecord?.insertId || null,
      });
    }

    return res.status(500).json({ response: 0, message: "Unexpected response from OnlineSim API.", error: apiResponse });

  } catch (error) {
    return res.status(500).json({
      response: 0,
      message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
      error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
  }
};


// ✅ New controller to fetch OnlineSim state
const fetchOnlineSimState = async (req, res) => {
  try {
    const { tzid } = req.params; // only tzid now

    if (!tzid) {
      return res.status(400).json({
        response: 0,
        error: "Missing required parameter: tzid",
      });
    }

    // Pass tzid directly to getState
    const apiResponse = await getState(tzid);

    if (
      !apiResponse ||
      (Array.isArray(apiResponse) && apiResponse.length === 0)
    ) {
      return res.status(502).json({
        response: 0,
        error: "Invalid or empty response from OnlineSim API.",
      });
    }

    return res.status(200).json({
      response: 1,
      data: apiResponse,
    });
  } catch (error) {
    console.error("[fetchOnlineSimState] Error:", error);
    return res.status(500).json({
      response: 0,
      error: error.message || "Internal server error",
    });
  }
};




module.exports = {
  fetchOnlineSimCountries,
  fetchOnlineSimServicesByCountry,
  buyOnlineSimNumber,
  fetchOnlineSimState,

};

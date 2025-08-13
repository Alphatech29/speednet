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
    if (!userId) {
      return res.status(401).json({
        response: 0,
        message: "Unauthorized: No user ID found.",
        error: "Unauthorized: No user ID found.",
      });
    }

    const currentUser = await getUserDetailsByUid(userId);
    if (!currentUser) {
      return res.status(404).json({
        response: 0,
        message: "User not found.",
        error: "User not found.",
      });
    }

    const { service, country, price } = req.body;

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        response: 0,
        message: "Missing or invalid 'price' parameter",
        error: "Missing or invalid 'price' parameter",
      });
    }

    if (currentUser.account_balance < price) {
      return res.status(402).json({
        response: 0,
        message: "Insufficient balance to complete purchase.",
        error: "Insufficient balance to complete purchase.",
      });
    }

    if (!service || typeof service !== "string") {
      return res.status(400).json({
        response: 0,
        message: "Missing or invalid required parameter: service",
        error: "Missing or invalid required parameter: service",
      });
    }

    if (country && typeof country !== "string") {
      return res.status(400).json({
        response: 0,
        message: "Invalid parameter type: country must be a string",
        error: "Invalid parameter type: country must be a string",
      });
    }

    // Call OnlineSim API
    let apiResponse;
    try {
      const result = await buyNumber({ service, country, userId });
      if (!Array.isArray(result) || result.length === 0) {
        return res.status(500).json({
          response: 0,
          message: "OnlineSim API returned no data.",
          error: "No data from API",
        });
      }
      apiResponse = result[0]; 
    } catch (apiError) {
      return res.status(502).json({
        response: 0,
        message: apiError.message || "Failed to communicate with OnlineSim API.",
        error: apiError.message || "Failed to communicate with OnlineSim API.",
      });
    }

    // Handle OnlineSim API errors
    if (typeof apiResponse.response === "string" && apiResponse.response.startsWith("ERROR")) {
      let statusCode = 400;
      let clientMessage = "Failed to purchase number.";

      switch (apiResponse.response) {
        case "ERROR_NO_SERVICE":
          clientMessage = "Requested service is not available.";
          statusCode = 404;
          break;
        case "ERROR_NO_NUMBERS":
          clientMessage = "No numbers available for the requested service and country.";
          statusCode = 404;
          break;
        case "ERROR_BALANCE_LOW":
        case "ERROR_NO_BALANCE":
          clientMessage = "Insufficient balance in OnlineSim account.";
          statusCode = 402;
          break;
        case "ERROR_WRONG_SERVICE":
          clientMessage = "Invalid service specified.";
          statusCode = 400;
          break;
        default:
          clientMessage = `OnlineSim error: ${apiResponse.response}`;
      }

      return res.status(statusCode).json({
        response: 0,
        message: clientMessage,
        error: apiResponse.response,
      });
    }

    // Ensure required fields exist
    if (!apiResponse.number || !apiResponse.country || !apiResponse.tzid || !apiResponse.time) {
      return res.status(500).json({
        response: 0,
        message: "OnlineSim API returned incomplete data.",
        error: "Missing required fields in API response",
      });
    }

    // Map fields from API response
    const countryId = Number(apiResponse.country);
    const amount = price;
    const number = String(apiResponse.number);
    const tzid = Number(apiResponse.tzid);
    const status = 0;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expiryTimestamp = currentTimestamp + Number(apiResponse.time);

    // Create SMS service record
    const smsCreateResult = await createSmsServiceRecord(
      userId,
      countryId,
      amount,
      service,
      number,
      tzid,
      status,
      expiryTimestamp
    );

    if (!smsCreateResult?.success) {
      console.error(
        "[buyOnlineSimNumber] Failed to create SMS service record:",
        smsCreateResult?.message
      );
    }

    return res.status(200).json({
      response: 1,
      message: "OnlineSim number purchased successfully.",
      data: apiResponse,
      smsServiceRecordId: smsCreateResult?.insertId || null,
    });
  } catch (error) {
    console.error("[buyOnlineSimNumber] Unexpected error:", error);
    return res.status(500).json({
      response: 0,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message || "Internal server error",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message || "Internal server error",
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

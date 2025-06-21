const axios = require("axios");
const { getWebSettings } = require("../utility/general");
const generateHash = require("../utility/generateHash");
const { generateUniqueRandomNumber } = require("../utility/random");

// ✅ Generate authentication headers (with hash)
const getAuthHeaders = (payload, vtpass_api_key, vtpass_pk, vtpass_sk, isPost = true) => {
  const headers = {
    "api-key": vtpass_api_key,
    "Content-Type": "application/json",
  };

  if (isPost) {
    const hash = generateHash(payload, vtpass_sk);
    headers["secret-key"] = vtpass_sk;
    headers["hash"] = hash;
  } else {
    headers["public-key"] = vtpass_pk;
  }

  return headers;
};

//  Check VTpass Wallet Balance
exports.checkVtuBalance = async () => {
  try {
    const settings = await getWebSettings();

    if (!settings || typeof settings !== "object") {
      throw new Error("VTU settings are missing.");
    }

    const { vtpass_api_key, vtpass_pk, vtpass_sk, vtpass_url } = settings;

    if (!vtpass_url || typeof vtpass_url !== "string") {
      throw new Error(`Invalid VTU API base URL: ${JSON.stringify(vtpass_url)}`);
    }

    const headers = getAuthHeaders({}, vtpass_api_key, vtpass_pk, vtpass_sk, false);
    const apiUrl = `${vtpass_url}/api/balance`;

    const result = await axios.get(apiUrl, { headers });

    if (result.data.code === 1) {
      const balance = parseFloat(result.data.contents.balance);
      return { success: true, balance };
    }

    return {
      success: false,
      error: result.data.response_description || "Failed to fetch balance",
    };
  } catch (error) {
    console.error("\u274C Error in checkVtuBalance:", error.message);
    return { success: false, error: error.message };
  }
};

//  Direct Airtime Recharge
exports.rechargeAirtime = async (amount, type, phone) => {
  try {
    const balanceCheck = await exports.checkVtuBalance();

    if (!balanceCheck.success || balanceCheck.balance < amount) {
      throw new Error("Insufficient VTU balance.");
    }

    const settings = await getWebSettings();

    if (!settings || typeof settings !== "object") {
      throw new Error("VTU settings are missing.");
    }

    const { vtpass_api_key, vtpass_pk, vtpass_sk, vtpass_url } = settings;
    const url = `${vtpass_url}/api/pay`;

    const payload = {
      serviceID: type,
      request_id: generateUniqueRandomNumber(),
      amount,
      phone,
    };

    const headers = getAuthHeaders(payload, vtpass_api_key, vtpass_pk, vtpass_sk);
    const result = await axios.post(url, payload, { headers });


    if (result.data.code === "000") {
      return { success: true, message: "Airtime recharge successful", data: result.data };
    }

    return { success: false, error: result.data.response_description || "Recharge failed" };
  } catch (error) {
    console.error("VTPass Airtime Error:", error.message); 
    return { success: false, error: error.message };
  }
};


//  International Airtime Recharge Function
exports.rechargeInternationalAirtime = async (amount, countryCode, phone) => {
  try {
    const balanceCheck = await exports.checkVtuBalance();
    if (!balanceCheck.success || balanceCheck.balance < amount) {
      throw new Error("Insufficient VTU balance.");
    }

    const settings = await getWebSettings();

    if (!settings || typeof settings !== "object") {
      throw new Error("VTU settings are missing.");
    }

    const { vtpass_api_key, vtpass_pk, vtpass_sk, vtpass_url } = settings;
    const url = `${vtpass_url}/api/pay`;

    const payload = {
      serviceID: "intl_airtime",
      request_id: generateUniqueRandomNumber(),
      amount,
      phone,
      country: countryCode,
    };

    const headers = getAuthHeaders(payload, vtpass_api_key, vtpass_pk, vtpass_sk);
    const result = await axios.post(url, payload, { headers });

    if (result.data.code === "000") {
      return { success: true, message: "International airtime sent", data: result.data };
    }

    return {
      success: false,
      error: result.data.response_description || "International recharge failed",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// utility/smsActivate.js
const pool = require("../model/db");
const { getWebSettings } = require("./general");
const axios = require("axios");

// Function to create axios client dynamically from web settings
async function getClient() {
  const settings = await getWebSettings(); 
  const BASE_URL = settings.onlinesim_api_url;
  const API_KEY = settings.onlinesim_api_key;

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "User-Agent": "OnlineSimClient/1.0",
    },
    params: {
      apikey: API_KEY,
    },
  });
}

// Get OnlineSim tariffs
async function getTariffs(params = {}) {
  try {
    const client = await getClient();
    const resp = await client.get("getTariffs.php", {
      params: { lang: "en", ...params },
    });
    return resp.data;
  } catch (err) {
    console.error("[getTariffs] Failed:", err.response?.data || err.message);
    return err.response?.data || { error: err.message };
  }
}

// Get services by country
async function getServicesByCountry(countryCode, params = {}) {
  try {
    const client = await getClient();
    const resp = await client.get("getNumbersStats.php", {
      params: { country: countryCode, lang: "en", ...params },
    });
    return resp.data;
  } catch (err) {
    console.error("[getServicesByCountry] Failed:", err.response?.data || err.message);
    return err.response?.data || { error: err.message };
  }
}

// Get state by tzid
async function getState(tzid, lang = "en") {
  if (!tzid) throw new Error("tzid is required");
  try {
    const client = await getClient();
    const resp = await client.get("getState.php", { params: { lang, tzid } });
    return resp.data;
  } catch (err) {
    console.error("[getState] Failed:", err.response?.data || err.message);
    return {
      response: 0,
      error: err.response?.data?.error || err.message || "Unknown error",
    };
  }
}

// Buy number
async function buyNumber({ service, country, userId, lang = "en", ...extraParams }) {
  try {
    if (!service) throw new Error("Service name is required.");
    if (!userId) throw new Error("User ID is required.");

    const client = await getClient();

    // Check balance
    const balanceResp = await client.get("getBalance.php", { params: { lang } });
    if (!balanceResp.data || balanceResp.data.balance === undefined) {
      throw new Error("Unable to fetch balance.");
    }
    if (balanceResp.data.balance <= 0) {
      throw new Error(`Insufficient balance: ${balanceResp.data.balance}`);
    }

    // Prepare parameters for buying number
    const params = { service, lang, userId, ...extraParams };
    if (country) params.country = country;

    const resp = await client.get("getNum.php", { params });

    if (typeof resp.data.response === "string" && resp.data.response.startsWith("ERROR")) {
      return resp.data; // Let caller handle API errors
    }

    if (resp.data.response !== 1 || !resp.data.tzid) {
      throw new Error("Failed to get transaction ID (tzid)");
    }

    const tzid = resp.data.tzid;

    // Poll getState until number available or timeout
    const timeoutMs = 30000; // 30 seconds max
    const intervalMs = 2000; // poll every 2 seconds
    let elapsed = 0;
    let numberInfo = null;

    while (elapsed < timeoutMs) {
      const stateResp = await getState(tzid, lang);
      numberInfo = Array.isArray(stateResp) ? stateResp[0] : stateResp;
      if (numberInfo?.number) break;

      await new Promise((r) => setTimeout(r, intervalMs));
      elapsed += intervalMs;
    }

    if (!numberInfo?.number) throw new Error("Timeout waiting for number assignment from OnlineSim");

    return {
      ...resp.data,
      number: numberInfo.number,
      service: numberInfo.service,
      country: numberInfo.country,
      price: numberInfo.sum,
      tzid: numberInfo.tzid,
      time: numberInfo.time,
      userId,
    };
  } catch (err) {
    return err.response?.data || { error: err.message, userId };
  }
}

// Get SMS service records by user
async function getSmsServiceByUserId(req, res) {
  try {
    const user_id = req.params.user_id || req.user?.userId;
    if (!user_id) return res.status(400).json({ success: false, message: "User ID is required" });
    if (isNaN(user_id)) return res.status(400).json({ success: false, message: "Invalid User ID format" });

    const [rows] = await pool.execute(
      "SELECT * FROM sms_service WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: "No records found for this user" });

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching SMS service records:", error);
    return res.status(500).json({ success: false, message: "Database error", error: error.message });
  }
}

module.exports = {
  getTariffs,
  getServicesByCountry,
  getState,
  buyNumber,
  getSmsServiceByUserId,
};

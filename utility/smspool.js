// smspool.js
const axios = require("axios");
const { getWebSettings } = require("./general");
const qs = require("qs");
const pool = require("../model/db"); // Ensure this points to your DB connection

let smspool = null;

// Initialize API client (singleton)
const initClient = async () => {
  if (smspool) return smspool;

  const settings = await getWebSettings();
  const API_KEY = settings?.onlinesim_api_key;
  const BASE_URL = settings?.onlinesim_api_url;

  if (!API_KEY || !BASE_URL) {
    throw new Error("API key or Base URL missing in web settings");
  }

  smspool = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  return smspool;
};

// Get country list
const getCountries = async () => {
  const client = await initClient();
  const response = await client.get("/country/retrieve_all");
  return response.data;
};

// Retrieve pricing by country
const postRetrievePricing = async ({ country }) => {
  const client = await initClient();
  const payload = qs.stringify(country ? { country: Number(country) } : {});
  const response = await client.post("/request/pricing", payload, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

// Get services + merge pricing + add % increase from onlinesim_rate
const getServicesByCountry = async (countryId) => {
  if (!countryId || isNaN(Number(countryId))) {
    throw new Error("Invalid countryId. It must be a number.");
  }

  const client = await initClient();

  // Get percentage rate from web settings
  const settings = await getWebSettings();
  const percentIncrease = Number(settings?.onlinesim_rate) || 0;

  // Fetch services
  const servicesResponse = await client.get("/service/retrieve_all", {
    params: { country: Number(countryId) },
  });
  const services = servicesResponse.data;

  // Fetch pricing
  const pricingResponse = await postRetrievePricing({ country: Number(countryId) });

  // Map pricing
  const pricingMap = {};
  pricingResponse.forEach((p) => {
    const serviceKey = p.service_id ?? p.service;
    if (serviceKey !== undefined) {
      pricingMap[serviceKey] = pricingMap[serviceKey] || { pools: [] };
      pricingMap[serviceKey].pools.push({
        pool: p.pool ?? null,
        price: p.price !== undefined ? Number(p.price) : null,
      });
    }
  });

  // Merge pricing into services
  let servicesWithPricing = services.map((service) => {
    const pricingInfo = pricingMap[service.ID];
    let finalPrice = null;
    let selectedPool = null;

    if (pricingInfo?.pools?.length) {
      // Try to get pool 7 first
      let pool7 = pricingInfo.pools.find((p) => p.pool === 7);
      if (pool7) {
        finalPrice = pool7.price;
        selectedPool = 7;
      } else {
        const randomPick = pricingInfo.pools[Math.floor(Math.random() * pricingInfo.pools.length)];
        finalPrice = randomPick.price;
        selectedPool = randomPick.pool;
      }

      if (finalPrice !== null) {
        finalPrice = Number((finalPrice * (1 + percentIncrease / 100)).toFixed(2));
      }
    }

    return {
      ...service,
      pool: selectedPool,
      price: finalPrice,
    };
  });

  // Sort services by price
  servicesWithPricing.sort((a, b) => (a.price === null ? 1 : b.price === null ? -1 : a.price - b.price));

  return servicesWithPricing;
};

// Check SMSPool balance
const getBalance = async () => {
  const client = await initClient();
  const response = await client.get("/request/balance");
  return parseFloat(response.data.balance || 0);
};

// Place SMS order
const postOrderSMS = async ({ country, service, pool, max_price, activation_type = "SMS" }) => {
  const client = await initClient();
  const numericCountry = Number(country);
  const numericService = Number(service);

  if (isNaN(numericCountry) || isNaN(numericService)) {
    throw new Error("Country and Service must be valid numbers");
  }

  const payload = qs.stringify({
    country: numericCountry,
    service: numericService,
    pool,
    pricing_option: max_price,
    activation_type,
  });

  const response = await client.post("/purchase/sms", payload, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return { order: response.data };
};

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
  getCountries,
  getServicesByCountry,
  getBalance,
  postOrderSMS,
  getSmsServiceByUserId,
};

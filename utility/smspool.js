// smspool.js
const axios = require("axios");
const { getWebSettings } = require("./general");
const qs = require("qs");

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

// Internal: Retrieve the cheapest pricing
const postRetrievePricing = async ({ country }) => {
  try {
    const client = await initClient();

    const payload = qs.stringify(
      country ? { country: Number(country) } : {}
    );

    const response = await client.post("/request/pricing", payload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const pricingData = response.data;

    if (!Array.isArray(pricingData) || pricingData.length === 0) {
      return null; // No pricing available
    }

    // Find the cheapest price (ignore null prices)
    const cheapest = pricingData
      .filter(p => p.price !== null && p.price !== undefined)
      .sort((a, b) => Number(a.price) - Number(b.price))[0];

    return cheapest || null;
  } catch (error) {
    console.error("Error fetching pricing:", error.response?.data || error.message);
    throw new Error(error.response?.data || error.message);
  }
};


// Get services by country + merged pricing + sorted by price
const getServicesByCountry = async (countryId) => {
  try {
    if (!countryId || isNaN(Number(countryId))) {
      throw new Error("Invalid countryId. It must be a number.");
    }

    const client = await initClient();

    // Fetch services
    const servicesResponse = await client.get("/service/retrieve_all", {
      params: { country: Number(countryId) },
    });
    const services = servicesResponse.data;

    // Fetch pricing
    const pricingResponse = await postRetrievePricing({ country: Number(countryId) });

    // Map pricing by service ID for fast lookup
    const pricingMap = {};
    pricingResponse.forEach((p) => {
      const serviceKey = p.service_id ?? p.service;
      if (serviceKey !== undefined) {
        pricingMap[serviceKey] = {
          pool: p.pool ?? null,
          price: p.price !== undefined ? Number(p.price) : null,
        };
      }
    });

    // Merge pricing into services using service.ID
    let servicesWithPricing = services.map((service) => {
      const pricingInfo = pricingMap[service.ID];
      return {
        ...service,
        pool: pricingInfo?.pool ?? null,
        price: pricingInfo?.price ?? null,
      };
    });

    // Sort by price ascending, placing null prices at the end
    servicesWithPricing = servicesWithPricing.sort((a, b) => {
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return a.price - b.price;
    });

    return servicesWithPricing;
  } catch (error) {
    console.error("Error fetching services/pricing by country:", error.response?.data || error.message);
    throw new Error(error.response?.data || error.message);
  }
};

// Check SMSPool account balance
const getBalance = async () => {
  try {
    const client = await initClient();
    const response = await client.get("/request/balance");
    const balance = parseFloat(response.data.balance || 0);
    return balance;
  } catch (error) {
    console.error("Error fetching SMSPool balance:", error.response?.data || error.message);
    throw new Error(error.response?.data || error.message);
  }
};

// Place SMS order
const postOrderSMS = async ({ country, service, max_price, activation_type = "SMS" }) => {
  try {
    const client = await initClient();
    const numericCountry = Number(country);
    const numericService = Number(service);

    if (isNaN(numericCountry) || isNaN(numericService)) {
      throw new Error("Country and Service must be valid numbers");
    }

    const payload = qs.stringify({
      country: numericCountry,
      service: numericService,
      pricing_option: max_price,
      activation_type,
    });

    const response = await client.post("/purchase/sms", payload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return { order: response.data };
  } catch (error) {
    console.error("Error creating SMS order:", error.response?.data || error.message);
    throw new Error(error.response?.data || error.message);
  }
};

module.exports = {
  getCountries,
  getServicesByCountry,
  getBalance,
  postOrderSMS,
};

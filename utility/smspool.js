// smspool.js — HeroSMS API (SMS-Activate compatible)
const axios = require("axios");
const { getWebSettings } = require("./general");
const pool = require("../model/db");

const getCredentials = async () => {
  const settings = await getWebSettings();
  const apiKey = settings?.onlinesim_api_key;
  const baseUrl = settings?.onlinesim_api_url;
  if (!apiKey) throw new Error("SMS API key missing in web settings");
  if (!baseUrl) throw new Error("SMS base URL missing in web settings");
  return { apiKey, baseUrl };
};

// All calls are GET requests with action + api_key as query params
const heroGet = async (params) => {
  const { apiKey, baseUrl } = await getCredentials();
  const response = await axios.get(baseUrl, { params: { ...params, api_key: apiKey } });
  return response.data;
};

// Map exact API English names → ISO alpha-2 codes for flag display
const COUNTRY_ISO = {
  "Russia": "ru", "Ukraine": "ua", "Kazakhstan": "kz", "China": "cn",
  "Philippines": "ph", "Myanmar": "mm", "Indonesia": "id", "Malaysia": "my",
  "Kenya": "ke", "Tanzania": "tz", "Vietnam": "vn", "Kyrgyzstan": "kg",
  "Israel": "il", "Hong Kong": "hk", "Poland": "pl", "United Kingdom": "gb",
  "Madagascar": "mg", "DR Congo": "cd", "Nigeria": "ng", "Macao": "mo",
  "Egypt": "eg", "India": "in", "Ireland": "ie", "Cambodia": "kh",
  "Laos": "la", "Haiti": "ht", "Ivory Coast": "ci", "Gambia": "gm",
  "Serbia": "rs", "Yemen": "ye", "South Africa": "za", "Romania": "ro",
  "Colombia": "co", "Estonia": "ee", "Azerbaijan": "az", "Canada": "ca",
  "Morocco": "ma", "Ghana": "gh", "Argentina": "ar", "Uzbekistan": "uz",
  "Cameroon": "cm", "Chad": "td", "Germany": "de", "Lithuania": "lt",
  "Croatia": "hr", "Sweden": "se", "Iraq": "iq", "Netherlands": "nl",
  "Latvia": "lv", "Austria": "at", "Belarus": "by", "Thailand": "th",
  "Saudi Arabia": "sa", "Mexico": "mx", "Taiwan": "tw", "Spain": "es",
  "Iran": "ir", "Algeria": "dz", "Slovenia": "si", "Bangladesh": "bd",
  "Senegal": "sn", "Turkey": "tr", "Czech": "cz", "Sri Lanka": "lk",
  "Peru": "pe", "Pakistan": "pk", "New Zealand": "nz", "Guinea": "gn",
  "Mali": "ml", "Venezuela": "ve", "Ethiopia": "et", "Mongolia": "mn",
  "Brazil": "br", "Afghanistan": "af", "Uganda": "ug", "Angola": "ao",
  "Cyprus": "cy", "France": "fr", "Papua": "pg", "Mozambique": "mz",
  "Nepal": "np", "Belgium": "be", "Bulgaria": "bg", "Hungary": "hu",
  "Moldova": "md", "Italy": "it", "Paraguay": "py", "Honduras": "hn",
  "Tunisia": "tn", "Nicaragua": "ni", "Timor-Leste": "tl", "Bolivia": "bo",
  "Costa Rica": "cr", "Guatemala": "gt", "UAE": "ae", "Zimbabwe": "zw",
  "Puerto Rico": "pr", "Sudan": "sd", "Togo": "tg", "Kuwait": "kw",
  "Salvador": "sv", "Libya": "ly", "Jamaica": "jm", "Trinidad and Tobago": "tt",
  "Ecuador": "ec", "Swaziland": "sz", "Oman": "om", "Bosnia": "ba",
  "Dominican Republic": "do", "Syria": "sy", "Qatar": "qa", "Panama": "pa",
  "Cuba": "cu", "Mauritania": "mr", "Sierra Leone": "sl", "Jordan": "jo",
  "Portugal": "pt", "Barbados": "bb", "Burundi": "bi", "Benin": "bj",
  "Brunei": "bn", "Bahamas": "bs", "Botswana": "bw", "Belize": "bz",
  "Central African Republic": "cf", "Dominica": "dm", "Grenada": "gd",
  "Georgia": "ge", "Greece": "gr", "Guinea-Bissau": "gw", "Guyana": "gy",
  "Iceland": "is", "Comoros": "km", "Saint Kitts and Nevis": "kn",
  "Liberia": "lr", "Lesotho": "ls", "Malawi": "mw", "Namibia": "na",
  "Niger": "ne", "Rwanda": "rw", "Slovakia": "sk", "Suriname": "sr",
  "Tajikistan": "tj", "Monaco": "mc", "Bahrain": "bh", "Reunion": "re",
  "Zambia": "zm", "Armenia": "am", "Somalia": "so", "Congo": "cg",
  "Chile": "cl", "Burkina Faso": "bf", "Lebanon": "lb", "Gabon": "ga",
  "Albania": "al", "Uruguay": "uy", "Mauritius": "mu", "Bhutan": "bt",
  "Maldives": "mv", "Guadeloupe": "gp", "Turkmenistan": "tm",
  "French Guiana": "gf", "Finland": "fi", "Saint Lucia": "lc",
  "Luxembourg": "lu", "Saint Vincent and the Grenadines": "vc",
  "Equatorial Guinea": "gq", "Djibouti": "dj", "Antigua and Barbuda": "ag",
  "Cayman Islands": "ky", "Montenegro": "me", "Denmark": "dk",
  "Switzerland": "ch", "Norway": "no", "Australia": "au", "Eritrea": "er",
  "South Sudan": "ss", "Sao Tome and Principe": "st", "Aruba": "aw",
  "Montserrat": "ms", "Anguilla": "ai", "Japan": "jp",
  "North Macedonia": "mk", "Seychelles": "sc", "New Caledonia": "nc",
  "Cape Verde": "cv", "USA": "us", "Palestine": "ps", "Fiji": "fj",
  "South Korea": "kr", "Singapore": "sg", "Samoa": "ws", "Malta": "mt",
  "Gibraltar": "gi", "Kosovo": "xk", "Niue": "nu",
  "USA (virtual)": "us", "North Korea": "kp", "Western Sahara": "eh",
  "Solomon Islands": "sb", "Jersey": "je", "Bermuda": "bm", "Tonga": "to",
  "Liechtenstein": "li", "Faroe Islands": "fo",
};

// Get country list — returns [{ID, name, short_name}]
const getCountries = async () => {
  const data = await heroGet({ action: "getCountries" });
  if (!Array.isArray(data)) return [];
  return data
    .filter((c) => c.visible !== 0)
    .map((c) => {
      const name = c.eng || c.rus || String(c.id);
      return {
        ID: c.id,
        name,
        short_name: COUNTRY_ISO[name] || "",
      };
    });
};

// Get services + prices for a country with % markup
// Returns [{ID, code, name, price, count}]
const getServicesByCountry = async (countryId) => {
  if (!countryId || isNaN(Number(countryId))) throw new Error("Invalid countryId");

  const settings = await getWebSettings();
  const percentIncrease = Number(settings?.onlinesim_rate) || 0;
  const country = Number(countryId);

  // Fetch services and prices in parallel
  const [servicesRes, pricesRes] = await Promise.all([
    heroGet({ action: "getServicesList", country, lang: "en" }),
    heroGet({ action: "getPrices", country }),
  ]);

  const services = servicesRes?.services || [];

  // Build price map: { serviceCode: { cost, count } }
  // Response shape: { "1": { "tg": { cost, count }, ... } }
  const priceMap = (pricesRes && typeof pricesRes === "object" && !Array.isArray(pricesRes))
    ? (pricesRes[String(country)] || pricesRes[Object.keys(pricesRes)[0]] || {})
    : {};

  const result = services.map((svc) => {
    const info = priceMap[svc.code];
    let price = info?.cost != null ? Number(info.cost) : null;
    if (price !== null && percentIncrease > 0) {
      price = Number((price * (1 + percentIncrease / 100)).toFixed(4));
    }
    return {
      ID: svc.code,
      code: svc.code,
      name: svc.name,
      count: info?.count ?? 0,
      price,
    };
  });

  // Available first, then sort by price ascending
  result.sort((a, b) => {
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return a.price - b.price;
  });

  return result;
};

// Get balance — parses "ACCESS_BALANCE:100.5"
const getBalance = async () => {
  const data = await heroGet({ action: "getBalance" });
  const match = String(data).match(/ACCESS_BALANCE:([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
};

// Place SMS order using getNumberV2 (returns JSON)
// No maxPrice passed — let HeroSMS assign the cheapest available number
const postOrderSMS = async ({ country, service }) => {
  const { apiKey, baseUrl } = await getCredentials();
  const params = {
    action: "getNumberV2",
    service,
    country: Number(country),
    api_key: apiKey,
  };

  try {
    const response = await axios.get(baseUrl, { params });
    const d = response.data;

    if (!d?.activationId) {
      // Plain text error like "NO_NUMBERS", "WRONG_SERVICE" etc.
      const msg = typeof d === "string" ? d : JSON.stringify(d);
      return { order: { success: false, message: msg, type: msg } };
    }

    // Convert activationEndTime to unix timestamp.
    // HeroSMS returns time without timezone (e.g. "2025-04-15 10:30:00") in Moscow time (UTC+3).
    // Append +03:00 so JS parses it correctly regardless of our server's local timezone.
    let expiration = null;
    if (d.activationEndTime) {
      const raw = String(d.activationEndTime).trim();
      // If already has timezone info (contains +, Z, or T...Z) use as-is, else assume UTC+3
      const hasTimezone = /[Z+]/.test(raw.slice(10));
      const dateStr = hasTimezone ? raw : raw.replace(" ", "T") + "+01:00";
      expiration = Math.floor(new Date(dateStr).getTime() / 1000);
    }

    return {
      order: {
        success: true,
        orderid: String(d.activationId),
        number: d.phoneNumber,
        country: d.countryCode,
        service,
        expiration,
        cost: d.activationCost,
      },
    };
  } catch (err) {
    const apiError = err.response?.data;
    console.error("[postOrderSMS] API error:", apiError || err.message);
    if (apiError) return { order: { success: false, message: String(apiError), type: String(apiError) } };
    throw err;
  }
};

// Cancel an activation on HeroSMS (called on refund)
const cancelActivation = async (activationId) => {
  try {
    const { apiKey, baseUrl } = await getCredentials();
    await axios.get(baseUrl, {
      params: { action: "cancelActivation", id: activationId, api_key: apiKey },
    });
    console.log(`[cancelActivation] Cancelled activation ${activationId}`);
  } catch (err) {
    // Non-critical — log but don't throw
    console.error(`[cancelActivation] Failed for ${activationId}:`, err.response?.data || err.message);
  }
};

// Resolve the stored `time` field (whatever MySQL returns) to a Unix timestamp in seconds.
// Handles: plain integer, numeric string, ISO string, JS Date object.
const resolveExpiryUnix = (t) => {
  if (!t) return null;
  if (t instanceof Date) return Math.floor(t.getTime() / 1000);
  const num = Number(t);
  if (!isNaN(num) && num > 1e9) return Math.floor(num); // already Unix seconds
  const d = new Date(t);
  return isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000);
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

    // Attach expiry_unix so the frontend gets a clean integer regardless of how MySQL stores/returns `time`
    const data = rows.map((row) => ({ ...row, expiry_unix: resolveExpiryUnix(row.time) }));
    return res.status(200).json({ success: true, data });
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
  cancelActivation,
  getSmsServiceByUserId,
};

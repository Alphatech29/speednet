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
    return { success: false, error: error.message };
  }
};

//  Data Recharge Function
exports.rechargeData = async (amount, serviceID, phone, variation_code) => {
  try {


    // Check VTU balance first
    const balanceCheck = await exports.checkVtuBalance();

    if (!balanceCheck.success || balanceCheck.balance < amount) {
      console.error("Insufficient VTU balance:", balanceCheck);
      throw new Error("Insufficient VTU balance.");
    }

    // Fetch VTpass credentials and URL
    const settings = await getWebSettings();
    if (
      !settings || 
      typeof settings !== "object" || 
      !settings.vtpass_api_key || 
      !settings.vtpass_pk || 
      !settings.vtpass_sk || 
      !settings.vtpass_url
    ) {
      console.error("VTpass credentials or URL missing or invalid:", settings);
      throw new Error("VTpass settings or credentials are missing.");
    }

    const { vtpass_api_key, vtpass_pk, vtpass_sk, vtpass_url } = settings;
    const url = `${vtpass_url}/api/pay`;

    // Prepare payload for VTpass API
    const payload = {
      request_id: generateUniqueRandomNumber(),
      serviceID,
      billersCode: phone,
      variation_code,
      amount,
      phone,
    };


    // Generate headers including authentication
    const headers = getAuthHeaders(payload, vtpass_api_key, vtpass_pk, vtpass_sk)

    // Make POST request
    const result = await axios.post(url, payload, { headers });

    if (result.data.code === "000") {
      return {
        success: true,
        message: "Data purchase successful",
        data: result.data,
      };
    }

    console.warn("Data purchase failed with response:", result.data);
    return {
      success: false,
      error: result.data.response_description || "Data purchase failed",
    };
  } catch (error) {
    console.error("Error in rechargeData:", error);
    return { success: false, error: error.message };
  }
};


// ✅ Get Data Variations 
exports.dataVariations = async (serviceID) => {
  try {
    const settings = await getWebSettings();
    const { vtpass_api_key, vtpass_pk, vtpass_sk, vtpass_url } = settings;

    const url = `${vtpass_url}/api/service-variations?serviceID=${serviceID}`;

    const headers = getAuthHeaders({}, vtpass_api_key, vtpass_pk, vtpass_sk, false);
    const result = await axios.get(url, { headers });

    const data = result.data;
    const variations = data?.content?.variations || data?.content?.varations || [];

    if (Array.isArray(variations) && variations.length > 0) {
      return {
        success: true,
        variations,
        service_type: data?.content?.serviceID || serviceID,
        service_name: data?.content?.ServiceName || serviceID,
      };
    }

    return {
      success: false,
      error: "No variations returned from VTpass.",
    };
  } catch (error) {
    console.error("Error in dataVariations:", error.message);
    return { success: false, error: error.message };
  }
};



//  International Airtime Recharge Function
exports.rechargeInternationalAirtime = async ({
  variationCode,
  operatorId,
  countryCode,
  phone,
  email,
  productTypeId,
}) => {
  try {
    const balanceCheck = await exports.checkVtuBalance();
    const settings = await getWebSettings();

    if (!balanceCheck.success || balanceCheck.balance <= 0) {
      throw new Error("Insufficient VTU balance.");
    }

    if (!settings || typeof settings !== "object") {
      throw new Error("VTU settings are missing.");
    }

    const { vtpass_api_key, vtpass_pk, vtpass_sk, vtpass_url } = settings;
    const url = `${vtpass_url}/api/pay`;

    const payload = {
      serviceID: "foreign-airtime",
      request_id: generateUniqueRandomNumber(),
      billersCode: phone,
      variation_code: variationCode,
      phone,
      operator_id: operatorId,
      country_code: countryCode,
      product_type_id: productTypeId,
      email,
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

//  Get International Airtime Countries
exports.getInternationalAirtimeCountries = async () => {
  try {
    const settings = await getWebSettings();

    if (!settings || !settings.vtpass_url) {
      return { success: false, error: "VTpass settings not configured properly." };
    }

    const url = `${settings.vtpass_url}/api/get-international-airtime-countries`;

    const response = await axios.get(url);

    const { response_description, content } = response.data || {};

    if (response_description === "000" && content?.countries) {
      return {
        success: true,
        countries: content.countries,
      };
    }

    return {
      success: false,
      error: response_description || "Unexpected VTpass response format.",
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message || "Unknown error occurred.",
    };
  }
};

//  Get International Airtime Product Types
exports.getInternationalProductTypes = async (countryCode) => {
  try {
    const settings = await getWebSettings();
    const url = `${settings.vtpass_url}/api/get-international-airtime-product-types?code=${countryCode}`;

    const response = await axios.get(url);
    const { response_description, content } = response.data;

    if (response_description === "000") {
      return { success: true, productTypes: content };
    }

    return { success: false, error: "Failed to fetch product types." };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

//  Get International Airtime Operators
exports.getInternationalOperators = async (countryCode, productTypeId) => {
  try {
    const settings = await getWebSettings();
    const url = `${settings.vtpass_url}/api/get-international-airtime-operators?code=${countryCode}&product_type_id=${productTypeId}`;

    const response = await axios.get(url);

    // Return the exact structure received from the VTpass API
    return response.data;

  } catch (error) {
    return {
      response_description: "999",
      content: [],
      error: error.message
    };
  }
};



//  Get International Airtime Variations
exports.getInternationalVariations = async (operatorId, productTypeId) => {
  try {
    console.log("=== Fetching International Variations ===");
    console.log("Received operatorId:", operatorId);
    console.log("Received productTypeId:", productTypeId);

    const settings = await getWebSettings();
    console.log("VTpass base URL from settings:", settings?.vtpass_url);

    const url = `${settings.vtpass_url}/api/service-variations?serviceID=foreign-airtime&operator_id=${operatorId}&product_type_id=${productTypeId}`;
    console.log("Final API Request URL:", url);

    const response = await axios.get(url);
    console.log("Raw VTpass Response:", response.data);

    const { response_description, content } = response.data;
    console.log("Response Description:", response_description);
    console.log("Content:", content);

    if (response_description === "000") {
      if (Array.isArray(content.variations) && content.variations.length > 0) {
        console.log("✔ Variations fetched:", content.variations);
        return { success: true, variations: content.variations };
      } else {
        console.warn("⚠ No variations found for selected product.");
        return { success: false, error: "No variations found for selected product." };
      }
    }

    console.warn("⚠ Unsuccessful response from VTpass:", response_description);
    return { success: false, error: "Failed to fetch variations from VTpass." };

  } catch (error) {
    console.error("❌ Error fetching international variations:", error.message);
    console.error("Full Error Object:", error);
    return { success: false, error: error.message };
  }
};





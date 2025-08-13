import axios from "axios";

/**
 * Fetch SMS-Man countries and services from the API
 */
export const getSmsManCountries = async () => {
  try {
    const { data } = await axios.get("/general/sms/country", {
      headers: { "Content-Type": "application/json" },
    });

    //console.log("📡 SMS-Man API Raw Response:", data);

    // Optional: Validate structure to avoid returning junk
    if (data?.response !== 1 || !data?.countries) {
      throw new Error("Unexpected response structure");
    }

    // ✅ Return the raw backend response exactly
    return data;

  } catch (error) {
    // Still return the backend's error shape if possible
    if (error?.response?.data) {
      return error.response.data;
    }
    return {
      response: 0,
      error: error.message || "Failed to fetch SMS-Man data",
    };
  }
};





export const getOnlineSimServicesByCountry = async (countryCode) => {
  try {
    if (!countryCode) {
      throw new Error("Country code is required");
    }

    const { data } = await axios.get(`/general/sms/services/${countryCode}`, {
      headers: { "Content-Type": "application/json" },
    });

    
    if (
      data?.response !== 1 ||
      !data?.services ||
      typeof data.services !== "object"
    ) {
      throw new Error("Unexpected response structure");
    }

    return data;

  } catch (error) {
    if (error?.response?.data) {
      return error.response.data;
    }
    return {
      response: 0,
      error: error.message || "Failed to fetch OnlineSim services",
    };
  }
};


export const buyOnlineSimNumber = async (payload) => {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("Request payload is required and must be an object");
    }

    console.log("buyOnlineSimNumber payload:", payload);

    const { data } = await axios.post(
      "/general/sms/buy-number",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    // If API says success, just return it directly
    if (data?.response === 1) {
      return data;
    }

    // If not success, use message from API if available
    return {
      response: 0,
      message: data?.message || "Failed to buy  number",
    };

  } catch (error) {
    console.error(
      "buyOnlineSimNumber error:",
      error.response?.data || error.message
    );

    if (error?.response?.data) {
      return {
        response: 0,
        message: error.response.data?.message || "Request failed",
      };
    }

    return {
      response: 0,
      message: error.message || "Failed to buy  number",
    };
  }
};




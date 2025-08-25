import axios from "axios";

/**
 * Fetch SMS pool countries from your backend API
 */
export const getSmsPoolCountries = async () => {
  try {
    const { data } = await axios.get("/general/pool/countries", {
      headers: { "Content-Type": "application/json" },
    });

    // Optional: Validate the structure
    if (!data || !data.success || !data.data) {
      throw new Error("Unexpected response structure");
    }

    // Return exactly what your backend returns
    return data;


  } catch (error) {
    // Return backend's error if available, otherwise custom error
    if (error?.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || "Failed to fetch pool countries",
    };
  }
};




export const getSmsPoolServicesByCountry = async (countryId) => {
  if (!countryId) {
    console.warn("Country ID is required");
    return [];
  }

  try {
    const response = await axios.get(`/general/pool/services/${countryId}`, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;

    // Validate the response structure
    if (!data || typeof data !== "object" || !data.success || !Array.isArray(data.data)) {
      console.error("Unexpected response structure:", data);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching SMS pool services:", error?.response?.data || error.message || error);
    return [];
  }
};



export const buySmsPoolNumber = async (payload) => {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("Request payload is required and must be an object");
    }

    const { data } = await axios.post(
      "/general/pool/order",
      payload,       
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    console.log("buySmsPoolNumber response:", data);

    if (data?.success) {
      return data;
    }

    return {
      success: false,
      message: data?.message || "Failed to buy number",
    };

  } catch (error) {
    console.error(
      "buySmsPoolNumber error:",
      error.response?.data || error.message
    );

    if (error?.response?.data) {
      return {
        success: false,
        message: error.response.data?.message || "Request failed",
      };
    }

    return {
      success: false,
      message: error.message || "Failed to buy number",
    };
  }
};




export const getSmsServiceByUserId = async () => {
  try {
    const { data } = await axios.get("/general/sms-service", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    if (data?.success) return data;

    return { success: false, message: data?.message || "Failed to fetch SMS service records" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Request failed",
    };
  }
};

// utils/smsManApi.jsx
import axios from "axios";

/**
 * Fetch SMS-Man countries from API
 */
export const getSmsManCountries = async () => {
  try {
    const { data } = await axios.get("/general/sms/country", {
      headers: { "Content-Type": "application/json" },
    });

    // Fix: Use correct structure
    const countries = data?.countries || [];

    return {
      success: true,
      message: "SMS-Man countries fetched successfully",
      data: countries,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch SMS-Man countries",
      error: error?.response?.data || error.message,
    };
  }
};


/**
 * Fetch SMS-Man services from API
 */
export const getSmsManServices = async () => {
  try {
    const { data } = await axios.get("/general/sms/services", {
      headers: { "Content-Type": "application/json" },
    });

    const services = data?.services || [];

    return {
      success: true,
      message: "SMS-Man services fetched successfully",
      data: services,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch SMS-Man services",
      error: error?.response?.data || error.message,
    };
  }
};

/**
 * Fetch SMS-Man services with prices from API
 */
export const getSmsManServicesWithPrices = async (countryId) => {
  try {
    const { data } = await axios.get("/general/sms/services-with-prices", {
      params: countryId ? { countryId } : {},
      headers: { "Content-Type": "application/json" },
    });

    if (!data?.success) {
      return {
        success: false,
        message: "API returned success: false",
        error: data,
      };
    }

    const servicesWithPrices = data.services || [];

    return {
      success: true,
      message: "Fetched SMS-Man services with prices successfully",
      data: servicesWithPrices,
    };
  } catch (error) {
    console.error("Error fetching SMS-Man services with prices:", error);

    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch SMS-Man services with prices",
      error: error?.response?.data || error.message,
    };
  }
};

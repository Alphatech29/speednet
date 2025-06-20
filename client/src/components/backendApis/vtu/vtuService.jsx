import axios from "axios";

export const purchaseAirtime = async (airtimeData) => {
  try {
    const response = await axios.post(`/general/airtime/Purchase`, airtimeData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // 👈 REQUIRED for cookie-based auth
    });

    const { success, message, data } = response.data;

    return {
      success,
      message: message || "Airtime purchase successful!",
      data,
    };
  } catch (error) {
    console.error("🔴 purchaseAirtime() error:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "An error occurred during airtime purchase.",
      error: error.response?.data || error.message,
    };
  }
};

import axios from "axios";

export const getWebSettings = async () => {
  try {
    const response = await axios.get(`/general/websettings`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      message: "Web settings retrieved successfully!",
      data: response.data || {}, 
    };
  } catch (error) {
    console.error("❌ Fetching web settings failed:", error?.response?.data || error.message);

    return {
      success: false,
      message: error?.response?.data?.message || "An error occurred while fetching web settings.",
      error: error?.response?.data || error.message,
    };
  }
};

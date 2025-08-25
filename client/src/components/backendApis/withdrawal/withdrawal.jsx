import axios from "axios";

export const withdrawalRequest = async (payload) => {
  try {

    const response = await axios.post(`/general/withdrawal`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      message: "Withdrawal request submitted successfully!",
      data: response.data || {},
    };
  } catch (error) {
    console.error("Withdrawal request failed:", error?.response?.data || error.message);

    return {
      success: false,
      message: error?.response?.data?.message || "An error occurred while submitting the withdrawal request.",
      error: error?.response?.data || error.message,
    };
  }
};

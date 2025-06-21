import axios from "axios";

export const setTransactionPin = async (payload) => {
  try {
    const response = await axios.post(
      "/general/set-pin",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { status, message } = response.data;

    return {
      success: status === true,
      message: message || "Transaction PIN set successfully!",
    };
  } catch (error) {
    console.error("🔴 setTransactionPin() error:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while setting your PIN.",
    };
  }
};

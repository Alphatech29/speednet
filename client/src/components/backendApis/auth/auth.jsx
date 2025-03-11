import axios from "axios";

export const register = async (userData) => {
  try {
    const response = await axios.post(`auth/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Registration Success:", response.data);

    return {
      success: true,
      message: response.data?.message || "Registration successful!",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Registration Failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "An error occurred during registration.",
      error: error.response?.data || error.message,
    };
  }
};

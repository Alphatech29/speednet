import axios from "axios";


//api for register
export const register = async (userData) => {
  try {
    const response = await axios.post(`register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });


    return {
      success: true,
      message: response.data?.message || "Registration successful!",
      data: response.data,
    };
  } catch (error) {
    console.error(" Registration Failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "An error occurred during registration.",
      error: error.response?.data || error.message,
    };
  }
};


// Login API call

export const login = async (userData) => {
  try {
    const response = await axios.post(`/auth/login`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // ensures auth cookie is sent/stored
    });

    const { success, message, user, tokenMetadata } = response.data;

    return {
      success,
      message: message || "Login successful!",
      user,
      tokenMetadata, // Optional: can be removed if not needed
    };
  } catch (error) {
    console.error("🔴 login() error response:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "An error occurred during login.",
      error: error.response?.data || error.message,
    };
  }
};


// Logout API call
export const logoutUser = async () => {
  try {
    const response = await axios.post(
      "/auth/logout",
      {},
      {
        withCredentials: true, // Ensures httpOnly cookie is sent
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Logout API error:", error);
    throw error;
  }
};


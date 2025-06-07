import axios from "axios";

export const adminLoginApi = async (userData) => {
  try {
    const response = await axios.post("/auth/adminLogin", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log('✅ Login API Success Response:', response.data);

    return {
      success: true,
      ...response.data, // Return all fields from backend response
    };
  } catch (error) {
    const errRes = error?.response?.data || {};

    console.error('❌ Login API Error Response:', errRes);

    return {
      success: false,
      ...errRes, // Return all fields from backend error response
    };
  }
};

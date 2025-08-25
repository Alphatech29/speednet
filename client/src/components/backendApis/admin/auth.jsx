import axios from "axios";

export const adminLoginApi = async (userData) => {
  try {
    const response = await axios.post("/auth/adminLogin", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    const errRes = error?.response?.data || {};

    return {
      success: false,
      ...errRes,
    };
  }
};

// This function updates the admin's password

export const adminUpdatePasswordApi = async (passwordData, token) => {
  try {
    const response = await axios.put("/auth/password-change", passwordData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });

    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    const errRes = error?.response?.data || {};

    return {
      success: false,
      ...errRes,
    };
  }
};
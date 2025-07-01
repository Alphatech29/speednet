import axios from "axios";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`/general/users`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const users = response.data?.data || [];

    const result = {
      success: true,
      message: "Users retrieved successfully!",
      data: users,
    };

    return result;
  } catch (error) {
    const err = {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching users.",
      error: error.response?.data || error.message,
    };

    return err;
  }
};

export const getUserById = async (uid) => {
  try {
    const response = await axios.get(`/general/users/${uid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const user = response.data?.data || null;

    const result = {
      success: true,
      message: "User retrieved successfully!",
      data: user,
    };

    return result;
  } catch (error) {
    const err = {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching the user.",
      error: error.response?.data || error.message,
    };

    return err;
  }
};



export const updateUser = async (uid, payload) => {
  try {
    const response = await axios.put(`/general/users/${uid}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update user",
      error: error.response?.data || error.message,
    };
  }
};


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

    console.log("getAllUsers success response:", result);

    return result;
  } catch (error) {
    const err = {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching users.",
      error: error.response?.data || error.message,
    };

    console.error("getAllUsers error response:", err);

    return err;
  }
};

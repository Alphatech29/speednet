import axios from "axios";

// ✅ Securely fetch current user based on auth cookie
export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/general/user", {
      withCredentials: true, 
    });

    // Return the whole response.data for full context
    return {
      success: true,
      message: "Authenticated user fetched successfully",
      data: response.data,  
    };
  } catch (error) {

    return {
      success: false,
      message: error?.response?.data?.message || "Not authenticated",
      error: error?.response?.data || error.message,
    };
  }
};


export const changePassword = async (payload) => {
  try {
    const response = await axios.post(
      "/auth/user/change-password",
      payload,
      {
        withCredentials: true,
      }
    );

    return {
      success: true,
      message: response?.data?.message || "Password changed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to change password",
      error: error?.response?.data || error.message,
    };
  }
};


export const updateUser = async (formData) => {
  try {
    const response = await axios.put("/general/user/update", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: response.data?.message || "User updated successfully!",
      data: response.data,
    };
  } catch (error) {
    const fallbackMessage = "An error occurred while updating the user.";

    return {
      success: false,
      message: error.response?.data?.message || fallbackMessage,
      error: error.response?.data || error.message,
    };
  }
};



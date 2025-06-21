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

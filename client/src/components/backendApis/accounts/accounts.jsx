import axios from "axios";

export const getAllAccounts = async () => {
  try {
    const response = await axios.get(`/products/account`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Accounts fetched successfully:", response.data);

    return {
      success: true,
      message: "Accounts retrieved successfully!",
      data: response.data,
    };
  } catch (error) {
    console.error("Fetching accounts failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching accounts.",
      error: error.response?.data || error.message,
    };
  }
};

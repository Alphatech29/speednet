import axios from "axios";

export const getAllAccounts = async () => {
  try {
    const response = await axios.get(`/general/accounts`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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



export const getAccountsByUserUid = async (userUid) => {
  try {
    // Make a GET request to the API endpoint with the userUid as part of the URL
    const response = await axios.get(`/general/get-accounts/${userUid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Extract the accounts data and message from the response
    const accounts = response.data.accounts;
    const message = "Accounts retrieved successfully!";

    // Return the accounts data and message
    return {
      success: true,
      message,
      data: accounts,
    };

  } catch (error) {
    // Log and handle the error
    console.error("Fetching accounts failed:", error.response?.data || error.message);

    // Return the error message if failure occurs
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching accounts.",
      error: error.response?.data || error.message,
    };
  }
};

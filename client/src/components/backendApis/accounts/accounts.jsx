import axios from "axios";

export const createAccount = async (data) => {
  try {
    const payload = JSON.stringify(data);

    const response = await axios.post('/general/create-account', payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      message: "Account Added successfully!",
      data: response.data,
    };
  } catch (error) {
    console.error("Creating account failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while creating the account.",
      error: error.response?.data || error.message,
    };
  }
};





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

export const getAllPlatforms = async () => {
  try {
    const response = await axios.get(`/general/platforms`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

  
    let platforms = response.data.success && Array.isArray(response.data.data) 
      ? response.data.data  
      : [];
    return {
      success: true,
      message: "Platforms retrieved successfully!",
      data: platforms,  
    };
  } catch (error) {
    console.error("Fetching platforms failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching platforms.",
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

    // Return the error message if failure occurs
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching accounts.",
      error: error.response?.data || error.message,
    };
  }
};

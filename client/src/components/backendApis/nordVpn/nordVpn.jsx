import axios from "axios";

// ✅ Securely fetch NordVPN plans from the server
export const getNordPlans = async () => {
  try {
    const response = await axios.get("/general/nord-plan", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log the raw response object
    console.log("NordVPN Response:", response);

    return {
      success: true,
      message: "NordVPN plans fetched successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch NordVPN plans",
      error: error?.response?.data || error.message,
    };
  }
};


export const createNordPurchase = async (payload) => {
  try {
    const response = await axios.post(
      "/general/nord-purchase",
      payload,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; 
  } catch (error) {

    if (error?.response?.data) {
      return error.response.data;
    }

 
    return {
      success: false,
      message: "Unknown server error",
      error: error.message,
    };
  }
};



export const getNordHistory = async () => {
  try {
    const response = await axios.get("/general/nord-history", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Optional: Log response for debugging
    console.log("Nord History Response:", response);

    return {
      success: true,
      message: "NordVPN history fetched successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch NordVPN history",
      error: error?.response?.data || error.message,
    };
  }
};

import axios from "axios";

export const collectOrder = async (orderData) => {
  try {
    const response = await axios.post("/general/purchase", orderData, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      success: true,
      data: response.data,
      message: response.data?.message, 
      status: response.status,
    };
  } catch (error) {
    console.error("Order failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message, 
      status: error.response?.status,
    };
  }
};


export const report = async (payload) => {
  try {
    const response = await axios.post("/general/purchase/report", payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
      message: response.data?.message,
      status: response.status,
    };
  } catch (error) {
    console.error("Order failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
      status: error.response?.status || 500,
    };
  }
};


// Fetch all reports by the current user
export const getReports = async () => {
  try {
    const response = await axios.get("/general/purchase/report/", {
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data?.data,
      message: response.data?.message,
      status: response.status,
    };
  } catch (error) {
    console.error("Fetching reports failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch reports",
      status: error.response?.status || 500,
    };
  }
};
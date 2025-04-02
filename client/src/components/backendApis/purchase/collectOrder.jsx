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

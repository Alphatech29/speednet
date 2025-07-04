import axios from "axios";

// ✅ Fetch user transactions including order and merchant history
export const getUserOrderHistory = async (userUid) => {
  try {
    // Validate the user UID
    if (!userUid || typeof userUid !== "string" || userUid.trim() === "") {
      throw new Error("Invalid user UID provided.");
    }

    //  Send request to backend
    const response = await axios.get(`/general/orderhistory/${userUid.trim()}`, {
      headers: { "Content-Type": "application/json" },
    });

    // Ensure correct response structure
    if (response.data && response.data.success) {
      const { orderHistory = [], merchantHistory = [] } = response.data.data || {};
      
      return {
        success: true,
        message: "Successfully fetched user history",
        data: {
          orderHistory,
          merchantHistory
        }
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch transactions.");
    }
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return {
      success: false,
      message: "Error fetching user history",
      data: {
        orderHistory: [],
        merchantHistory: []
      }
    };
  }
};


export const getUserOrders = async (userUid) => {
  try {
    if (!userUid || typeof userUid !== "string") {
      throw new Error("Invalid user ID provided. Expected a string.");
    }

    const response = await axios.get(`/general/orders/${userUid}`, {
      headers: { "Content-Type": "application/json" },
    });

    // Ensure response structure is valid
    if (
      response.data?.success &&
      response.data?.data?.success &&
      Array.isArray(response.data.data.data)
    ) {
      return response.data.data.data; // ✅ Return only the array
    }

    throw new Error(response.data.data.message || "Failed to fetch orders.");
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    return []; // Return an empty array on error
  }
};




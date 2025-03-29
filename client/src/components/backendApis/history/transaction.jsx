import axios from "axios";

// ✅ Fetch user transactions from backend
export const getUserTransactions = async (userUid) => {
  if (!userUid || typeof userUid !== "string" || userUid.trim() === "") {
    console.error("❌ Invalid userUid provided:", userUid);
    return {
      success: false,
      message: "Invalid user UID",
      error: "Invalid user UID provided.",
    };
  }

  try {
    const response = await axios.get(`/general/transaction/${userUid.trim()}`, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      success: true,
      message: "Transactions retrieved successfully!",
      data: response.data || [],
    };
  } catch (error) {
    console.error(
      `❌ Fetching transactions failed [${error?.response?.status || "Unknown Status"}]:`,
      error?.response?.data || error.message
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        `Failed to fetch transactions. Status: ${error?.response?.status || "Unknown"}`,
      error: error?.response?.data || error.message,
    };
  }
};

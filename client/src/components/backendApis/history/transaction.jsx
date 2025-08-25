import axios from "axios";

// ✅ Fetch user transactions from backend
export const getUserTransactions = async (userUid) => {
  try {
    if (!userUid || typeof userUid !== "string" || userUid.trim() === "") {
      throw new Error("Invalid user UID provided.");
    }

    // 🔍 Send request to backend
    const response = await axios.get(`/general/transaction/${userUid.trim()}`, {
      headers: { "Content-Type": "application/json" },
    });

    // ✅ Ensure correct response structure
    if (response.data && response.data.success) {
      return response.data.data; // ✅ Return transactions array
    } else {
      throw new Error(response.data.message || "Failed to fetch transactions.");
    }
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.message);
    throw error; // Re-throw to handle in UI
  }
};

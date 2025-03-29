import axios from "axios";

// ✅ Fetch user from backend
export const getUser = async (userUid) => {
  if (!userUid || typeof userUid !== "string" || userUid.trim() === "") {
    console.error("❌ Invalid userUid provided:", userUid);
    return {
      success: false,
      message: "Invalid user UID",
      error: "Invalid user UID provided.",
    };
  }

  try {
    const response = await axios.get(`/general/user/${userUid.trim()}`, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      success: true,
      message: "User retrieved successfully!",
      data: response.data || {},
    };
  } catch (error) {
    console.error(
      `❌ Fetching user failed [${error?.response?.status || "Unknown Status"}]:`,
      error?.response?.data || error.message
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        `Failed to fetch user. Status: ${error?.response?.status || "Unknown"}`,
      error: error?.response?.data || error.message,
    };
  }
};

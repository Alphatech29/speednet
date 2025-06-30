import axios from "axios";

export const getAllWithdrawals = async () => {
  try {
    const response = await axios.get(`/general/withdrawal`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const withdrawals = response.data?.data || [];
    console.log("withdrawals", withdrawals)

    const result = {
      success: true,
      message: "Withdrawals retrieved successfully!",
      data: withdrawals,
    };

    return result;
  } catch (error) {
    const err = {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching withdrawals.",
      error: error.response?.data || error.message,
    };

    return err;
  }
};

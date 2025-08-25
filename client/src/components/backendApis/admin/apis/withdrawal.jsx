import axios from "axios";

export const getAllWithdrawals = async () => {
  try {
    const response = await axios.get(`/general/withdrawal`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const withdrawals = response.data?.data || [];

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


export const updateWithdrawalStatus = async (id, status) => {
  try {
    const response = await axios.put(`/general/withdrawal/${id}`, { status }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      message: "Withdrawal status updated successfully!",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while updating withdrawal status.",
      error: error.response?.data || error.message,
    };
  }
};


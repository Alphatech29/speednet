import axios from "axios";

export const getAllTransactions = async () => {
  try {
    const response = await axios.get("/general/transaction", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const transactions = response.data?.data || [];

    return {
      success: true,
      message: "Transactions retrieved successfully!",
      count: transactions.length,
      data: transactions,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while fetching transactions.",
      error: error.response?.data || error.message,
    };
  }
};

export const getAllMerchantTransactions = async () => {
  try {
    const response = await axios.get("/general/merchant", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const transactions = response.data?.data || [];

    return {
      success: true,
      message: "Transactions retrieved successfully!",
      count: transactions.length,
      data: transactions,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while fetching transactions.",
      error: error.response?.data || error.message,
    };
  }
};

export const getAllOrderList = async () => {
  try {
    const response = await axios.get("/general/account_order", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const transactions = response.data?.data || [];

    return {
      success: true,
      message: "Transactions retrieved successfully!",
      count: transactions.length,
      data: transactions,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while fetching transactions.",
      error: error.response?.data || error.message,
    };
  }
};


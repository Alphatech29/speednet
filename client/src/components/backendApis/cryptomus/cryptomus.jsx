import axios from "axios";

export const payWithCryptomus = async ({ amount, currency, order_id, paymentMethod }) => {
  try {
    const response = await axios.post(
      "/general/pay", // Adjust if your backend route is different
      { amount, currency, order_id, paymentMethod },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Payment initialized successfully!",
      data: response.data, // contains payment_url, payment_uuid, order_id
    };
  } catch (error) {
    console.error("Payment initialization failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.error || "An error occurred while initializing the payment.",
      error: error.response?.data || error.message,
    };
  }
};

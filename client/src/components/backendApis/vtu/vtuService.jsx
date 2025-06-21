import axios from "axios";

export const purchaseAirtime = async (airtimeData) => {
  try {
    const response = await axios.post(`/general/airtime/Purchase`, airtimeData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    const backend = response.data;

    if (!backend?.status) {
      throw new Error(backend?.message || "Airtime purchase failed");
    }

    return {
      success: true,
      message: backend.message || "Airtime purchase successful!",
      data: backend.data,
    };
  } catch (error) {
   

    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Something went wrong",
      error: error?.response?.data || error.message,
    };
  }
};

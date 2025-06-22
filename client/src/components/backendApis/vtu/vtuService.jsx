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

export const purchaseData = async (dataPurchase) => {
  try {
    const response = await axios.post(`/general/data/Purchase`, dataPurchase, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    const backend = response.data;

    if (!backend?.status) {
      throw new Error(backend?.message || "Data purchase failed");
    }

    return {
      success: true,
      message: backend.message || "Data purchase successful!",
      data: backend.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Something went wrong",
      error: error?.response?.data || error.message,
    };
  }
}




export const fetchDataVariations = async (serviceID) => {
  try {
    const response = await axios.get(`/general/data-variations/${serviceID}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });


    const backend = response.data;

    if (!backend?.success) {
      throw new Error(backend?.error || "Failed to fetch data variations");
    }

    return {
      success: true,
      message: "Data variations fetched successfully!",
      data: backend,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || error.message || "Something went wrong",
      error: error?.response?.data || error.message,
    };
  }
};

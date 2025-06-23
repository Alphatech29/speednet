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


// Fetches the list of countries for international airtime purchase
export const fetchInternationalAirtimeCountries = async () => {
  try {
    const response = await axios.get("/general/InternationalAirtime/countries", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    const backend = response.data;

    if (!backend?.success) {
      throw new Error(backend?.message || "Failed to fetch countries");
    }

    return {
      success: true,
      message: "Countries fetched successfully!",
      countries: backend?.data || backend?.countries || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Something went wrong",
      error: error?.response?.data || error.message,
    };
  }
};

// Fetches the product types for international airtime purchase based on country code
export const fetchInternationalProductTypes = async (countryCode) => {
  try {
    if (!countryCode || typeof countryCode !== "string") {
      throw new Error("Country code is required.");
    }

    const response = await axios.get(`/general/InternationalAirtime/product-types/${countryCode}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    const backend = response.data;

    if (!backend?.success) {
      throw new Error(backend?.message || "Failed to fetch product types");
    }

    return {
      success: true,
      message: backend.message || "Product types fetched successfully!",
      productTypes: backend.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Something went wrong",
      error: error?.response?.data || error.message,
    };
  }
};

// Fetches the operators for a specific country and product type
export const fetchInternationalOperators = async (countryCode, productTypeId) => {
  try {
    if (!countryCode || typeof countryCode !== "string" || !countryCode.trim()) {
      throw new Error("Valid country code is required.");
    }

    if (!productTypeId || isNaN(Number(productTypeId))) {
      throw new Error("Valid Product Type ID is required.");
    }

    const response = await axios.get(
      `/general/InternationalAirtime/operators/${countryCode}/${productTypeId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const backend = response.data;

    if (!backend?.success) {
      throw new Error(backend?.message || "Failed to fetch operators.");
    }

    return {
      success: true,
      message: backend.message || "Operators fetched successfully!",
      operators: backend.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Something went wrong",
      error: error?.response?.data || error.message,
    };
  }
};




// Fetches the variations for a specific international operator and product type
export const fetchInternationalVariations = async (operatorId, productTypeId) => {
  try {
    if (!operatorId || typeof operatorId !== "string") {
      throw new Error("Operator ID is required and must be a string.");
    }

    if (!productTypeId || isNaN(Number(productTypeId))) {
      throw new Error("Valid Product Type ID is required.");
    }

    const url = `/general/InternationalAirtime/variations/${operatorId}/${productTypeId}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const response = await axios.get(url, config);

    const backend = response.data;

    if (!backend?.success) {
      console.warn("⚠ Backend responded with error state:", backend);
      throw new Error(backend?.message || "Failed to fetch variations");
    }

    return {
      success: true,
      message: backend.message || "Variations fetched successfully!",
      variations: backend.data || [],
    };

  } catch (error) {
    console.error("Error in fetchInternationalVariations:");
    console.error("Error Message:", error.message);
    console.error("Error Response (if any):", error?.response?.data);

    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Something went wrong",
      error: error?.response?.data || error.message,
    };
  }
};

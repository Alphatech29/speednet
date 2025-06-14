import axios from "axios";

export const getWebSettings = async () => {
  try {
    const response = await axios.get(`/general/settings`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

  
    // Extract settings from response.data.data
    const settingsArray = response.data?.data;

    const settings =
      Array.isArray(settingsArray) && settingsArray.length > 0
        ? settingsArray[0]
        : null;

    const result = {
      success: true,
      message: "Web settings retrieved successfully!",
      data: settings,
    };

    return result;

  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An error occurred while fetching web settings.";

    const err = {
      success: false,
      message: errorMessage,
      error: error?.response?.data || error,
    };

    console.error("❌ Error in getWebSettings:", err);
    return err;
  }
};



// Function to update web settings

export const updateWebSettings = async (updatedFields) => {
  try {
    const response = await axios.put(`/general/settings`, updatedFields, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = {
      success: true,
      message: "Web settings updated successfully!",
      data: response.data,
    };

    return result;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "An error occurred while updating web settings.";

    const err = {
      success: false,
      message: errorMessage,
      error: error.response?.data || error,
    };

    console.error("updateWebSettings error response:", err);
    return err;
  }
};

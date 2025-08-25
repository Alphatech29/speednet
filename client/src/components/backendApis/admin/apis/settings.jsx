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


    return err;
  }
};



// Function to update web settings

export const updateWebSettings = async (updatedFields) => {
  try {
    let dataToSend;
    let headers = {};

    const containsFile = Object.values(updatedFields).some(
      (value) => value instanceof File || value instanceof Blob
    );
    if (containsFile) {
      dataToSend = new FormData();
      for (const key in updatedFields) {
        dataToSend.append(key, updatedFields[key]);
      }

      // Log FormData content
      for (let pair of dataToSend.entries()) {
      }

      headers["Content-Type"] = "multipart/form-data";
    } else {
      dataToSend = updatedFields;
      headers["Content-Type"] = "application/json";
    }

    const response = await axios.put(`/general/settings`, dataToSend, {
      headers,
    });

    return {
      success: true,
      message: "Web settings updated successfully!",
      data: response.data,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message ||
                         error.message ||
                         "An error occurred while updating web settings.";

    console.error("❌ ~ Error updating web settings:", errorMessage);
    console.error("⚠️ ~ Error Details:", error.response?.data || error);

    return {
      success: false,
      message: errorMessage,
      error: error.response?.data || error,
    };
  }
};
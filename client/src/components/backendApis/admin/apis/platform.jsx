import axios from "axios";

export const getAllPlatforms = async () => {
  try {
    const response = await axios.get("/general/platform", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const platforms = response.data?.platforms || [];

    return {
      success: true,
      message: "Platforms retrieved successfully!",
      count: platforms.length,
      data: platforms,
    };
  } catch (error) {
    const err = {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while fetching platforms.",
      error: error.response?.data || error.message,
    };

  
    return err;
  }
};


export const addPlatform = async (formData) => {
  try {
 

    const response = await axios.post("/general/platform", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: response.data?.message || "Platform added successfully!",
      platformId: response.data?.platformId,
    };

  } catch (error) {
    const fallbackMessage = "An error occurred while adding the platform.";


    return {
      success: false,
      message: error.response?.data?.message || fallbackMessage,
      error: error.response?.data || error.message,
    };
  }
};


export const deletePlatformById = async (id) => {
  console.log('ID sent to backend:', id);
  
  try {
    const response = await axios.delete(`/general/platform/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      message: response.data.message || 'Platform deleted successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while deleting the platform.',
      error: error.response?.data || error.message,
    };
  }
};



export const updatePlatformById = async (platformId, formData) => {
  try {
    const response = await axios.put(`/general/platform/${platformId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      message: response.data?.message || 'Platform updated successfully!',
      platformId: response.data?.platformId,
    };
  } catch (error) {
    const fallbackMessage = 'An error occurred while updating the platform.';

    return {
      success: false,
      message: error.response?.data?.message || fallbackMessage,
      error: error.response?.data || error.message,
    };
  }
};




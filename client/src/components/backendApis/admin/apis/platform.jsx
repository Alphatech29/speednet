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

    console.error("getAllPlatforms error response:", err);
    return err;
  }
};


export const addPlatform = async (formData) => {
  try {
    // Debugging
    console.log("addPlatform data:", formData);

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

    console.error("addPlatform error:", error);

    return {
      success: false,
      message: error.response?.data?.message || fallbackMessage,
      error: error.response?.data || error.message,
    };
  }
};

export const deletePlatformById = async (platformId) => {
  try {
    const response = await axios.delete(`/platform/${platformId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = {
      success: true,
      message: response.data.message || "Platform deleted successfully!",
    };

    return result;
  } catch (error) {
    const err = {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while deleting the platform.",
      error: error.response?.data || error.message,
    };

    console.error("deletePlatform error response:", err);

    return err;
  }
};

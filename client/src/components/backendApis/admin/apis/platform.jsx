import axios from "axios";

export const getAllPlatforms = async () => {
  try {
    const response = await axios.get("/general/platform", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("getAllPlatforms response:", response.data);
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


export const addPlatform = async (platformData) => {
  try {
    const response = await axios.post("/platform", platformData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = {
      success: true,
      message: response.data.message || "Platform added successfully!",
      platformId: response.data.platformId,
    };

    return result;
  } catch (error) {
    const err = {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while adding the platform.",
      error: error.response?.data || error.message,
    };

    console.error("addPlatform error response:", err);

    return err;
  }
};
export const updatePlatform = async (platformId, platformData) => {
  try {
    const response = await axios.put(`/platform/${platformId}`, platformData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = {
      success: true,
      message: response.data.message || "Platform updated successfully!",
    };

    return result;
  } catch (error) {
    const err = {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while updating the platform.",
      error: error.response?.data || error.message,
    };

    console.error("updatePlatform error response:", err);

    return err;
  }
};
export const deletePlatform = async (platformId) => {
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

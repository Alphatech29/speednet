import axios from "axios";

export const createShortNoticeAPI = async (data) => {
  try {
    const response = await axios.post("/general/create-notice", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response?.data || {};

    return {
      success: responseData.success || false,
      message: responseData.message || "Notice created successfully!",
      data: responseData.data || {},
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while creating the notice.",
      error: error.response?.data || error.message,
    };
  }
};

export const getAllShortNoticesAPI = async () => {
  try {
    const response = await axios.get("/general/get-notice");
    const responseData = response?.data || {};

    return {
      success: responseData.success || false,
      message: responseData.message || "Notices retrieved successfully!",
      data: responseData.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while fetching notices.",
      error: error.response?.data || error.message,
    };
  }
};

// --- New API to update a notice by ID ---
export const updateShortNoticeAPI = async (id, data) => {
  try {
    const response = await axios.put(`/general/update-notice/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response?.data || {};

    return {
      success: responseData.success || false,
      message: responseData.message || "Notice updated successfully!",
      data: responseData.data || {},
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while updating the notice.",
      error: error.response?.data || error.message,
    };
  }
};

// Delete notice by ID
export const deleteShortNoticeAPI = async (id) => {
  try {
    const response = await axios.delete(`/general/delete-notice/${id}`);
    const responseData = response?.data || {};

    return {
      success: responseData.success || false,
      message: responseData.message || "Notice deleted successfully!",
      data: responseData.data || {},
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while deleting the notice.",
      error: error.response?.data || error.message,
    };
  }
};

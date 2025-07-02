import axios from "axios";

export const getAllNotices = async () => {
  try {
    const response = await axios.get("/general/notice", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const notices = response.data?.data || [];

    return {
      success: true,
      message: "Notices retrieved successfully!",
      count: notices.length,
      data: notices,
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


export const updateNoticeById = async (id, data) => {
  try {
    const response = await axios.put(`/general/notice/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const updatedNotice = response.data?.data || {};

    return {
      success: true,
      message: response.data?.message || "Notice updated successfully!",
      data: updatedNotice,
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




export const createNotice = async (data) => {
  try {
    const response = await axios.post("/general/notice/create", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response?.data || {};

    return {
      success: responseData.success || true,
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


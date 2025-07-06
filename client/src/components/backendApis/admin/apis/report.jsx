import axios from "axios";

export const getAllReports = async () => {
  try {
    const response = await axios.get("/general/all-report", {
      headers: {
        "Content-Type": "application/json",
      }
    });

    const reports = response.data?.data || [];

    return {
      success: true,
      message: response.data?.message || "Reports fetched successfully.",
      count: reports.length,
      data: reports,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching reports.",
      error: error.response?.data || error.message,
    };
  }
};




export const updateReportById = async (reportId, status) => {
  if (!reportId || !status) {
    return {
      success: false,
      message: "Report ID and status are required.",
    };
  }

  try {
    const response = await axios.put(
      `/general/update-report/${reportId}`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return {
      success: true,
      message: response.data?.message || "Report updated successfully.",
      data: response.data?.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error updating report:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while updating the report.",
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
};

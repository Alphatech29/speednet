const { getAllReports, updateReportById } = require('../../../utility/report');

// GET all reports
const getAllReportsController = async (req, res) => {
  try {
    const result = await getAllReports();

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("API error fetching all reports:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving reports.",
    });
  }
};

// UPDATE report status by ID
const updateReportStatusController = async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  if (!reportId || !status) {
    return res.status(400).json({
      success: false,
      message: "Report ID and status are required.",
    });
  }

  try {
    const result = await updateReportById(reportId, status);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("API error updating report:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating the report.",
    });
  }
};

module.exports = {
  getAllReportsController,
  updateReportStatusController,
};

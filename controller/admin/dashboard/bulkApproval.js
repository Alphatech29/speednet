const { bulkUpdateStatus } = require("../../../utility/bulkApproval");

const bulkUpdateStatusController = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array",
      });
    }

    const results = await bulkUpdateStatus(updates);

    return res.status(200).json({
      success: true,
      message: "Bulk status update processed",
      results,
    });
  } catch (error) {
    console.error("Bulk Status Update Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {bulkUpdateStatusController};

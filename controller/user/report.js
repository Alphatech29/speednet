const { insertReport, getReportsByReporterId } = require("../../utility/report");

// Submit a report
const report = async (req, res) => {
  const { defendant_id, message, target_id } = req.body;
  const reporter_id = req.user?.userId;

  if (!reporter_id || !defendant_id || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  try {
    const result = await insertReport({ reporter_id, defendant_id, message, target_id });

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Report API error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your report.",
    });
  }
};

// Get all reports submitted by the logged-in user
const getMyReports = async (req, res) => {
  const reporter_id = req.user?.userId;

  if (!reporter_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Reporter ID missing.",
    });
  }

  try {
    const result = await getReportsByReporterId(reporter_id);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get reports API error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports.",
    });
  }
};


module.exports = { report, getMyReports };

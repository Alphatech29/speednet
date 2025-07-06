const pool = require('../model/db');

const insertReport = async ({ reporter_id, defendant_id, message, target_id = null }) => {
  if (!reporter_id || !defendant_id || !message) {
    return { success: false, message: "Missing required fields." };
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO report (reporter_id, defendant_id, target_id, message)
       VALUES (?, ?, ?, ?)`,
      [reporter_id, defendant_id, target_id, message]
    );

    return {
      success: true,
      message: "Report submitted successfully.",
      report_id: result.insertId,
    };
  } catch (error) {
    console.error("Insert report failed:", error);
    return {
      success: false,
      message: "Database error occurred while submitting the report.",
    };
  }
};

const getReportsByReporterId = async (reporter_id) => {
  if (!reporter_id) {
    return { success: false, message: "Reporter ID is required." };
  }

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM report WHERE reporter_id = ? ORDER BY created_at DESC`,
      [reporter_id]
    );

    return {
      success: true,
      data: rows,
      message: "Reports fetched successfully.",
    };
  } catch (error) {
    console.error("Fetch reports failed:", error);
    return {
      success: false,
      message: "Database error occurred while fetching reports.",
    };
  }
};


const getAllReports = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         r.*,
         reporter.full_name AS reporter_name,
         reporter.email AS reporter_email,
         reporter.role AS reporter_role,
         defendant.full_name AS defendant_name,
         defendant.email AS defendant_email,
         defendant.role AS defendant_role
       FROM report r
       LEFT JOIN users AS reporter ON r.reporter_id = reporter.uid
       LEFT JOIN users AS defendant ON r.defendant_id = defendant.uid
       ORDER BY r.created_at DESC`
    );

    return {
      success: true,
      data: rows,
      message: "All reports with user details fetched successfully.",
    };
  } catch (error) {
    console.error("Fetch all reports failed:", error);
    return {
      success: false,
      message: "Database error occurred while fetching reports.",
    };
  }
};

const updateReportById = async (reportId, status) => {
  if (!reportId || !status) {
    return {
      success: false,
      message: "Report ID and status are required.",
    };
  }

  try {
    const [result] = await pool.execute(
      `UPDATE report SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, reportId]
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "No report found with the specified ID.",
      };
    }

    return {
      success: true,
      message: "Report updated successfully.",
    };
  } catch (error) {
    console.error("Update report failed:", error);
    return {
      success: false,
      message: "Database error occurred while updating the report.",
    };
  }
};


module.exports = {
  insertReport,
  getReportsByReporterId,getAllReports,updateReportById
};

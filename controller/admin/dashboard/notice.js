const db = require("../../../model/db");

// This function retrieves all notices from the database.
const getAllNotices = async (req, res) => {
  try {
    const [notices] = await db.execute(`
      SELECT id, title, message, role, created_at 
      FROM notice 
      ORDER BY created_at DESC
    `);

    if (!notices || notices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No notices found",
      });
    }

    return res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



const updateNoticeById = async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  // Validate that at least one field is provided
  if (!fields || Object.keys(fields).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field (title, message, or role) must be provided",
    });
  }

  try {
    // Dynamically build the SET part of the SQL query
    const updateFields = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(fields);

    const [result] = await db.execute(
      `UPDATE notice SET ${updateFields} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notice not found or no changes made",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      updated: {
        id,
        ...fields,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





const createNotice = async (req, res) => {
  const { title, message, role } = req.body;

  console.log('Request coming from frontend:', req.body);

  if (!title || !message || !role) {
    return res.status(400).json({
      success: false,
      message: "Title, message, and role are required",
    });
  }

  try {
    const [result] = await db.execute(
      `
        INSERT INTO notice (title, message, role)
        VALUES (?, ?, ?)
      `,
      [title, message, role]
    );

    return res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: {
        id: result.insertId,
        title,
        message,
        role,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getAllNotices,createNotice, updateNoticeById
};

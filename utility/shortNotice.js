const db = require("../model/db");

async function createShortNotice(content, status = "active") {
  try {
    if (!content) {
      return { success: false, code: 400, message: "Content is required" };
    }

    const [activeRows] = await db.execute(
      "SELECT id FROM short_notice WHERE status = 'active' LIMIT 1"
    );

    if (activeRows.length > 0) {
      return {
        success: false,
        code: 409,
        message:
          "An active notice already exists. Please deactivate it before creating a new one.",
      };
    }

    const sql = `INSERT INTO short_notice (content, status) VALUES (?, ?)`;
    const [result] = await db.execute(sql, [content, status]);

    return {
      success: true,
      code: 201,
      message: "Short notice created successfully",
      data: { id: result.insertId, content, status },
    };
  } catch (error) {
    console.error("Create Short Notice Error:", error);
    return { success: false, code: 500, message: "Internal server error" };
  }
}

async function getAllShortNotices() {
  try {
    const sql = `
      SELECT id, content, status, created_at
      FROM short_notice
      ORDER BY created_at DESC
    `;
    const [rows] = await db.execute(sql);

    return { success: true, code: 200, message: "Short notices retrieved successfully", data: rows };
  } catch (error) {
    console.error("Get All Short Notices Error:", error);
    return { success: false, code: 500, message: "Internal server error" };
  }
}


async function updateShortNoticeById(id, content, status) {
  try {
    if (!id) {
      return { success: false, code: 400, message: "Notice ID is required" };
    }

    if (!content) {
      return { success: false, code: 400, message: "Content is required" };
    }
    if (status === "active") {
      const [activeRows] = await db.execute(
        "SELECT id FROM short_notice WHERE status = 'active' AND id != ? LIMIT 1",
        [id]
      );

      if (activeRows.length > 0) {
        return {
          success: false,
          code: 409,
          message: "Another active notice already exists. Deactivate it before activating this one.",
        };
      }
    }

    const sql = `
      UPDATE short_notice
      SET content = ?, status = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [content, status, id]);

    if (result.affectedRows === 0) {
      return { success: false, code: 404, message: "Notice not found" };
    }

    return {
      success: true,
      code: 200,
      message: "Short notice updated successfully",
      data: { id, content, status },
    };
  } catch (error) {
    console.error("Update Short Notice Error:", error);
    return { success: false, code: 500, message: "Internal server error" };
  }
}


async function deleteShortNoticeById(id) {
  try {
    if (!id) {
      return { success: false, code: 400, message: "Notice ID is required" };
    }
    const sql = `
      DELETE FROM short_notice
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return { success: false, code: 404, message: "Notice not found" };
    }

    return { success: true, code: 200, message: "Short notice deleted successfully" };
  } catch (error) {
    console.error("Delete Short Notice Error:", error);
    return { success: false, code: 500, message: "Internal server error" };
  }
}

module.exports = {
  createShortNotice,
  getAllShortNotices,
  updateShortNoticeById,
  deleteShortNoticeById,
};

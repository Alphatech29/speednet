const pool = require("../model/db");

const insertPage = async ({ title, slug, content }) => {
  try {
    const sql = `
      INSERT INTO pages (title, slug, content)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [title, slug, content]);
    return result.insertId;
  } catch (error) {
    console.error('Error inserting page into database:', error.message || error);
    throw new Error('Internal server error while inserting page.');
  }
};

const getAllPages = async () => {
  try {
    const sql = `SELECT * FROM pages ORDER BY created_at DESC`;
    const [rows] = await pool.execute(sql);
    return rows;
  } catch (error) {
    console.error('Error fetching pages from database:', error.message || error);
    throw new Error('Internal server error while retrieving pages.');
  }
};

const deletePageById = async (id) => {
  try {
    const sql = `DELETE FROM pages WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error deleting page from database:', error.message || error);
    throw new Error('Internal server error while deleting page.');
  }
};

const editPageById = async (id, { title, slug, content }) => {
  try {
    const sql = `
      UPDATE pages 
      SET title = ?, slug = ?, content = ? 
      WHERE id = ?
    `;
    const [result] = await pool.execute(sql, [title, slug, content, id]);

    return {
      affectedRows: result.affectedRows,
      message: result.affectedRows > 0 ? 'Page updated successfully.' : 'No page found with that ID.',
    };
  } catch (error) {
    console.error('Error updating page in database:', error.message || error);
    throw new Error('Internal server error while updating page.');
  }
};


// backend/db/queries/page.js
const getPageBySlug = async (slug) => {
  try {
    const sql = `SELECT * FROM pages WHERE slug = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [slug]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error('Error fetching page by slug:', error.message || error);
    throw new Error('Internal server error while fetching page.');
  }
};


module.exports = {
  insertPage,
  getAllPages,
  getPageBySlug,
  deletePageById,
  editPageById,
};

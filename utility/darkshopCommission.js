const pool = require("../model/db");

// Function to get all category commissions with category names
const getCategoryCommissions = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        cc.commission_rate AS commission
      FROM dark_shop_category_commissions AS cc
      JOIN dark_shop_categories AS c ON cc.category_id = c.id
    `);
    return rows;
  } catch (error) {
    console.error("Error fetching category commissions:", error);
    throw error;
  }
};

// Insert a new category commission
const addCategoryCommission = async (categoryId, commissionRate) => {
  try {
    const sql = `
      INSERT INTO dark_shop_category_commissions
      (category_id, commission_rate)
      VALUES (?, ?)
    `;
    const [result] = await pool.query(sql, [categoryId, commissionRate]);
    return result; // result.insertId
  } catch (error) {
    console.error("Error adding category commission:", error);
    throw error;
  }
};

// Update existing category commission by category ID
const updateCategoryCommission = async (categoryId, commissionRate) => {
  try {
    const sql = `
      UPDATE dark_shop_category_commissions
      SET commission_rate = ?
      WHERE category_id = ?
    `;
    const [result] = await pool.query(sql, [commissionRate, categoryId]);

    if (result.affectedRows === 0) {
      throw new Error(`No commission found for category ID ${categoryId}`);
    }

    return result; // result.affectedRows
  } catch (error) {
    console.error("Error updating category commission:", error);
    throw error;
  }
};

module.exports = {
  getCategoryCommissions,
  addCategoryCommission,
  updateCategoryCommission
};

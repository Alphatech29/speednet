const pool = require("../model/db");

async function getCategoriesWithGroups() {
  const connection = await pool.getConnection();

  try {
    // Fetch categories
    const [categories] = await connection.query(
      `SELECT id, name, icon FROM dark_shop_categories ORDER BY id ASC`
    );

    // Fetch groups
    const [groups] = await connection.query(
      `SELECT id, category_id, name 
       FROM dark_shop_category_groups
       ORDER BY category_id ASC, id ASC`
    );

    // Map categories
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.id, {
        ...cat,
        groups: []
      });
    });

    // Attach groups to categories
    groups.forEach(group => {
      if (categoryMap.has(group.category_id)) {
        categoryMap.get(group.category_id).groups.push(group);
      }
    });

    return {
      success: true,
      data: Array.from(categoryMap.values())
    };

  } catch (error) {
    console.error("Error fetching categories with groups:", error);
    return {
      success: false,
      message: "Failed to fetch categories"
    };
  } finally {
    connection.release();
  }
}

module.exports = { getCategoriesWithGroups };

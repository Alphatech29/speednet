const pool = require("../model/db");

// Fetch categories with their groups
async function getCategoriesWithGroups() {
  const connection = await pool.getConnection();

  try {
    const [categories] = await connection.query(
      `SELECT id, name, icon FROM dark_shop_categories ORDER BY id ASC`
    );

    const [groups] = await connection.query(
      `SELECT id, category_id, name FROM dark_shop_category_groups ORDER BY category_id ASC, id ASC`
    );

    // Map categories
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, groups: [] });
    });

    // Attach groups to categories
    groups.forEach(group => {
      if (categoryMap.has(group.category_id)) {
        categoryMap.get(group.category_id).groups.push(group);
      }
    });

    return { success: true, data: Array.from(categoryMap.values()) };

  } catch (error) {
    console.error("Error fetching categories with groups:", error);
    return { success: false, message: "Failed to fetch categories" };
  } finally {
    connection.release();
  }
}

// Delete a group by ID (products under this group will be deleted automatically)
async function deleteGroup(groupId) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `DELETE FROM dark_shop_category_groups WHERE id = ?`,
      [groupId]
    );

    if (result.affectedRows === 0) {
      return { success: false, message: "Group not found" };
    }

    return { success: true, message: "Group and its products deleted successfully" };

  } catch (error) {
    console.error("Error deleting group:", error);
    return { success: false, message: "Failed to delete group" };
  } finally {
    connection.release();
  }
}

// Delete a category by ID (groups under this category will be deleted automatically)
async function deleteCategory(categoryId) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `DELETE FROM dark_shop_categories WHERE id = ?`,
      [categoryId]
    );

    if (result.affectedRows === 0) {
      return { success: false, message: "Category not found" };
    }

    return { success: true, message: "Category, its groups, and all products deleted successfully" };

  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, message: "Failed to delete category" };
  } finally {
    connection.release();
  }
}

module.exports = {
  getCategoriesWithGroups,
  deleteGroup,
  deleteCategory
};

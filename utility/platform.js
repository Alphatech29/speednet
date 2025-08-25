const pool = require('../model/db'); // This is correct

async function insertPlatform(platformData) {
  const fields = [];
  const placeholders = [];
  const values = [];

  for (const [key, value] of Object.entries(platformData)) {
    if (value !== undefined && value !== null) {
      fields.push(key);
      placeholders.push('?');
      values.push(value);
    }
  }

  const sql = `
    INSERT INTO platforms (${fields.join(', ')})
    VALUES (${placeholders.join(', ')})
  `;

  try {
    const [result] = await pool.query(sql, values);
    return result.insertId;
  } catch (error) {
    console.error('Error inserting platform:', error.message);
    throw new Error('Failed to insert platform');
  }
}


async function updatePlatformById(id, platformData) {
  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(platformData)) {
    if (value !== undefined && value !== null) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  // Ensure there’s at least one field to update
  if (updates.length === 0) {
    throw new Error('No data provided to update');
  }

  values.push(id); // For WHERE clause

  const sql = `
    UPDATE platforms
    SET ${updates.join(', ')}
    WHERE id = ?
  `;

  try {
    const [result] = await pool.query(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating platform:', error.message);
    throw new Error('Failed to update platform');
  }
}


/**
 * Fetches all platforms from the platforms table
 */
async function getAllPlatforms() {
  const sql = 'SELECT * FROM platforms ORDER BY id DESC';

  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error('Error fetching platforms:', error);
    throw new Error('Failed to fetch platforms');
  }
}

async function deletePlatformById(id) {
  const sql = 'DELETE FROM platforms WHERE id = ?';

  try {
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error deleting platform:', error);
    throw new Error('Failed to delete platform');
  }
}


module.exports = {
  insertPlatform,
  getAllPlatforms,
  deletePlatformById,
  updatePlatformById
};

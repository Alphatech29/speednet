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


module.exports = {
  insertPlatform,
  getAllPlatforms
};

const pool = require('../../model/db');

const getAllAccounts = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM accounts');
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch accounts: ${error.message}`);
  }
};


module.exports = {
  getAllAccounts
};

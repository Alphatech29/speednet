const pool = require('../../model/db');

const getAllAccounts = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*, 
        u.username, 
        u.avatar 
      FROM accounts AS a
      LEFT JOIN users AS u ON a.user_id = u.uid
    `;

    const [rows] = await pool.query(query);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ success: false, error: `Failed to fetch accounts: ${error.message}` });
  }
};

module.exports = {
  getAllAccounts
};

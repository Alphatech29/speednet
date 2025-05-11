const pool = require('../model/db');
const logger = require('../utility/logger');

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

    logger.info(`Fetched ${rows.length} accounts`);
    res.json({ success: true, data: rows });
  } catch (error) {
    logger.error(`Database Error in getAllAccounts: ${error.message}`);
    res.status(500).json({ success: false, error: `Failed to fetch accounts: ${error.message}` });
  }
};

const getAllPlatforms = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        name,
        image_path
      FROM platforms
      ORDER BY name ASC
    `;

    const [rows] = await pool.query(query);

    logger.info(`Fetched ${rows.length} platforms`);
    res.json({ success: true, data: rows });
  } catch (error) {
    logger.error(`Database Error in getAllPlatforms: ${error.message}`);
    res.status(500).json({ success: false, error: `Failed to fetch platforms: ${error.message}` });
  }
};

const getPlatformsData = async (id = null) => {
  try {
    const query = `SELECT id, name, image_path FROM platforms${id ? ' WHERE id = ?' : ''} ORDER BY name ASC`;
    const [rows] = await pool.query(query, id ? [id] : []);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: `Failed to fetch platforms: ${error.message}` };
  }
};


const createAccount = async (accountData) => {
  try {
    const query = `
      INSERT INTO accounts (
        user_id, title, platform, logo_url, email, 
        username, recovery_email, recoveryEmailpassword, additionalEmail, 
        additionalPassword, previewLink, password, description, price, 
        category, subscription_status, expiry_date, two_factor_enabled, two_factor_description,
        status
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;

    
    const values = [
      accountData.user_id || null,
      accountData.title || 'N/A',
      accountData.platform || 'N/A',
      accountData.logo_url || 'N/A',
      accountData.email || 'N/A',
      accountData.username || 'N/A',
      accountData.recovery_email || 'N/A',
      accountData.recoveryEmailpassword || 'N/A',
      accountData.additionalEmail || 'N/A',
      accountData.additionalPassword || 'N/A',
      accountData.previewLink || 'N/A',
      accountData.password || 'N/A',
      accountData.description || 'N/A',
      accountData.price || 0.00,
      accountData.category || 'Other',
      accountData.subscription_status || 'none',
      accountData.expiry_date || null,
      accountData.two_factor_enabled ? 1 : 0,
      accountData.two_factor_description || 'N/A',
      accountData.status
    ];

    // Execute the query
    const [result] = await pool.execute(query, values);

    return result.insertId;
  } catch (error) {
    console.error("Error creating account:", error);
    return null;
  }
};




module.exports = {
  getAllAccounts,
  createAccount,
  getAllPlatforms,
  getPlatformsData
};

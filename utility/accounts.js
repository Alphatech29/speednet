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
        user_id,
        title,
        platform,
        logo_url,
        email,
        username,
        password,
        previewLink,
        recovery_info,
        recovery_password,
        factor_description,
        description,
        price,
        category,
        status
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      accountData.user_id || null,
      accountData.title || 'N/A',
      accountData.platform || 'N/A',
      accountData.logo_url || 'N/A',
      accountData.email || 'N/A',
      accountData.username || 'N/A',
      accountData.password || 'N/A',
      accountData.previewLink || 'N/A',
      accountData.recovery_info || 'N/A',
      accountData.recovery_password || 'N/A',
      accountData.factor_description || 'N/A',
      accountData.description || 'N/A',
      parseFloat(accountData.price) || 0.0,
      accountData.category || 'Other',
      accountData.status || 'under reviewing'
    ];

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

// Import the database connection pool
const pool = require('../model/db');

/**
 * Creates a new referral record in the database.
 */
async function createReferral(
  referral1_id,
  referral2_id,
  referral_amount = 0,
  referral_status = 0
) {
  const sql = `
    INSERT INTO referrals (
      referral1_id,
      referral2_id,
      referral_amount,
      referral_status
    ) VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.execute(sql, [
      referral1_id ?? null,
      referral2_id ?? null,
      referral_amount ?? 0,
      referral_status ?? 0,
    ]);

    return { success: true, insertId: result.insertId };
  } catch (err) {
    console.error('Error inserting referral:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Retrieves a single referral record by its ID.
 */
async function getReferralById(referralId) {
  const sql = `SELECT * FROM referrals WHERE id = ?`;

  try {
    const [rows] = await pool.execute(sql, [referralId]);

    if (rows.length === 0) {
      return { success: false, message: 'Referral not found' };
    }

    return { success: true, data: rows[0] };
  } catch (err) {
    console.error('Error fetching referral:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Retrieves a referral by the referred user's ID (referral2_id).
 */
async function getReferralByReferredUser(referral2_id) {
  const sql = `SELECT * FROM referrals WHERE referral2_id = ?`;

  try {
    const [rows] = await pool.execute(sql, [referral2_id]);

    if (rows.length === 0) {
      return { success: false, message: 'Referral not found for this user' };
    }

    return { success: true, data: rows[0] };
  } catch (err) {
    console.error('Error fetching referral by referred user:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Retrieves all referrals made by a specific referrer.
 */
async function getReferralsByReferrer(referral1_id) {
  const sql = `
    SELECT 
      r.*, 
      u.full_name, 
      u.email 
    FROM referrals r
    LEFT JOIN users u ON r.referral2_id = u.uid
    WHERE r.referral1_id = ?
  `;

  try {
    const [rows] = await pool.execute(sql, [referral1_id]);

    return { success: true, data: rows };
  } catch (err) {
    console.error('Error fetching referrals by referrer:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Updates a specific column for a referral record by referral ID.
 */
async function updateReferralById(referral2_id, column, value) {
  // ✅ Add more allowed columns
  const allowedColumns = [
    'referral_status',
    'first_deposit',   // ✅ Added
    'first_order'      // ✅ Added
  ];

  if (!allowedColumns.includes(column)) {
    return { success: false, error: 'Invalid column name' };
  }

  const sql = `UPDATE referrals SET ${column} = ? WHERE id = ?`;

  try {
    const [result] = await pool.execute(sql, [value, referral2_id]);

    if (result.affectedRows === 0) {
      return { success: false, message: 'Referral not found or no change made' };
    }

    return { success: true, message: `Referral updated: ${column} = ${value}` };
  } catch (err) {
    console.error('Error updating referral:', err);
    return { success: false, error: err.message };
  }
}


// Export all referral-related functions
module.exports = {
  createReferral,
  getReferralById,
  getReferralByReferredUser,
  getReferralsByReferrer,
  updateReferralById // 👈 new export
};

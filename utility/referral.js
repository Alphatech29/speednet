const pool = require('../model/db');


async function createReferral(referral1_id, referral2_id, referral_amount = 0, referral_status = 0) {
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
      referral1_id,
      referral2_id,
      referral_amount,
      referral_status
    ]);

    return { success: true, insertId: result.insertId };
  } catch (err) {
    console.error('Error inserting referral:', err);
    return { success: false, error: err.message };
  }
}


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


module.exports = {
  createReferral,
  getReferralById,
  getReferralsByReferrer
};


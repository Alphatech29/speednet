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

module.exports = {
  createReferral
};

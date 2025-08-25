const pool = require("../model/db");

const getAllNordVPNPackages = async () => {
  const query = `
    SELECT id, package_name, duration, amount, status 
    FROM nord_plan
  `;
  const [results] = await pool.query(query);
  return results;
};

const createNordHistory = async ({ 
  user_id, 
  plan_id, 
  email, 
  full_name, 
  country, 
  zip_code, 
  amount, 
  status 
}) => {
  const query = `
    INSERT INTO nord_history (user_id, plan_id, email, full_name, country, zip_code, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [user_id, plan_id, email, full_name, country, zip_code, amount, status];
  const [result] = await pool.query(query, values);
  return result;
};

// ✅ NEW: Fetch all nord_history records
const getAllNordHistory = async () => {
  const query = `
    SELECT 
      nh.id,
      nh.user_id,
      nh.email AS history_email,
      nh.full_name AS history_full_name,
      u.email AS current_email,
      u.full_name AS current_full_name,
      nh.plan_id,
      np.package_name,
      nh.country,
      nh.zip_code,
      nh.amount,
      nh.status,
      nh.created_at
    FROM nord_history nh
    JOIN users u ON nh.user_id = u.uid
    JOIN nord_plan np ON nh.plan_id = np.id
    ORDER BY nh.created_at DESC
  `;
  const [results] = await pool.query(query);
  return results;
};




module.exports = {
  getAllNordVPNPackages,
  createNordHistory,
  getAllNordHistory // ← Exporting the new function
};

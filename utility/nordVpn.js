const pool = require("../model/db");

const getAllNordVPNPackages = async () => {
  const query = `
    SELECT id, package_name, duration, amount, status 
    FROM nord_plan
  `;
  const [results] = await pool.query(query);
  return results;
};


module.exports = {
  getAllNordVPNPackages,

};

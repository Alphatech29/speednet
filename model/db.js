const mysql = require("mysql2");
require("dotenv").config();

const dbConfig = {
  host: "localhost",
  user: "root2",
  password: "",
  database: "speednet",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  charset: 'utf8mb4'
};

const pool = mysql.createPool(dbConfig).promise();

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Database Connected Successfully");
    conn.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.error(err);
    process.exit(1);
  }
})();

module.exports = pool;

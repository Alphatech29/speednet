const mysql = require("mysql2");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const dbConfig = {
  host: isProduction ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST || "localhost",
  user: isProduction ? process.env.PROD_DB_USER : process.env.DEV_DB_USER || "root",
  password: isProduction ? process.env.PROD_DB_PASSWORD : process.env.DEV_DB_PASSWORD,
  database: isProduction ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
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
  }
})();

module.exports = pool;

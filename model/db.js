const mysql = require("mysql2");
require('dotenv').config();

//Create a connection pool with Promises
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 9030,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
}).promise();

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

module.exports = pool;

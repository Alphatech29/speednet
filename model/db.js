const mysql = require("mysql2");
require("dotenv").config();

const dbConfig = {
  host: process.env.DEV_DB_HOST || "localhost",
  user: process.env.DEV_DB_USER || "root",
  password: process.env.DEV_DB_PASSWORD || "",
  database: process.env.DEV_DB_NAME || "speednet",
  port: parseInt(process.env.DB_PORT) || 9030,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
};

//console.log("Connecting to MySQL with config:", {
  //host: dbConfig.host,
  //user: dbConfig.user,
  //database: dbConfig.database,
  //port: dbConfig.port,
//});

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

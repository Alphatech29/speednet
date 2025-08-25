const mysql = require("mysql2");
require("dotenv").config();

const dbConfig = {
  host:"localhost",
<<<<<<< HEAD
  user:"root2",
  password:"",
  database:"speednet",
  port: 3306,
=======
  user:"root",
  password:"",
  database:"speednet",
  port: 9030,
>>>>>>> 6f31b1fe6dc6fd2d8e97f7b8188c3595c2bcef95
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
};

console.log("Connecting to MySQL with config:", {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port,
});

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

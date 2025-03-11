const mysql = require("mysql2");

// ✅ Create a connection pool with Promises
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "speednet",
  port: 9030,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
}).promise();

// ✅ Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database Connected Successfully");
    connection.release(); // Release connection back to the pool
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = pool;

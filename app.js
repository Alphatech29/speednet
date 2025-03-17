const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const pool = require("./model/db"); 
const authRoute = require('./routes/auth');
const generalRoute = require('./routes/general');

dotenv.config(); 

const app = express();

// ✅ Middleware to parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Secure app with Helmet (improved CSP)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted-cdn.com"],
        imgSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Define API routes
app.use('/auth', authRoute);
app.use('/general', generalRoute);

// ✅ Serve Vite build files
app.use(express.static(path.join(__dirname, "client", "dist")));

// ✅ Handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// ✅ Define Port
const PORT = process.env.PORT || 8000;

// ✅ Start Server
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ✅ Handle uncaught errors & promise rejections
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Rejection:", err);
  process.exit(1);
});

// ✅ Graceful shutdown with error handling
process.on("SIGTERM", async () => {
  console.log("📢 SIGTERM received. Shutting down gracefully...");
  try {
    await pool.end();
    console.log("✅ Database connection closed.");
  } catch (err) {
    console.error("⚠️ Error closing database connection:", err);
  }
  server.close(() => {
    console.log("💡 Server closed.");
  });
});

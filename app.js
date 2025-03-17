const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const pool = require("./model/db"); 
const authRoute = require('./routes/auth');
const generalRoute = require('./routes/general');

dotenv.config(); 

const app = express();

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Secure app with Helmet (with relaxed CSP for images & scripts)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);


// Define API routes
app.use('/auth', authRoute);
app.use('/products', generalRoute)


// ✅ Apply bodyParser middleware for URL-encoded data
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

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
});

// ✅ Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("📢 SIGTERM received. Shutting down gracefully...");
  await pool.end(); 
  server.close(() => {
    console.log("💡 Server closed.");
  });
});

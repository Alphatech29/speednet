const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const pool = require("./model/db");
const bodyParser = require('body-parser');
const xssClean = require('xss-clean'); 
const authRoute = require('./routes/auth');
const generalRoute = require('./routes/general');
const compression = require('compression');


dotenv.config(); 

const app = express();

// ✅ Middleware to parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Prevent XSS (Cross-Site Scripting) attacks by sanitizing user input.
app.use(xssClean());

app.use(express.raw({ type: 'application/json', limit: '1mb' }));

// Custom middleware to capture raw body
app.use((req, res, next) => {
  req.rawBody = req.body.toString(); // Convert body to string and store in req.rawBody
  next();
});

// ✅ Middleware to handle compression for better performance
app.use(compression());


// ✅ Secure app with Helmet (improved CSP)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted-cdn.com"],
        imgSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "https://trusted-cdn.com"],
        frameAncestors: ["'none'"],  // Prevent embedding in an iframe (clickjacking prevention)
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true,  // Disable content sniffing
    xssFilter: true, // Enable the XSS filter in supported browsers
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

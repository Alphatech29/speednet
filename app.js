const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const pool = require("./model/db");
const bodyParser = require("body-parser");
const xssClean = require("xss-clean");
const authRoute = require("./routes/auth");
const generalRoute = require("./routes/general");
const compression = require("compression");

dotenv.config();
const app = express();

// ✅ Parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Sanitize user input
app.use(xssClean());

// ✅ Raw body (e.g. for signature verification)
app.use(express.raw({ type: "application/json", limit: "1mb" }));
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// ✅ Enable gzip compression
app.use(compression());

// ✅ Secure with Helmet (CSP-safe configuration)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["*"],
    },
  })
);

// ✅ API routes
app.use("/auth", authRoute);
app.use("/general", generalRoute);

// ✅ Serve static files from Vite build
app.use(express.static(path.join(__dirname, "client", "dist")));

// ✅ Catch-all for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// ✅ Server port
const PORT = process.env.PORT || 8000;

// ✅ Start the server
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ✅ Handle unexpected errors
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Rejection:", err);
  process.exit(1);
});

// ✅ Graceful shutdown
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

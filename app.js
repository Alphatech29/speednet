const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const xssClean = require("xss-clean");
const bodyParser = require("body-parser");
const logger = require("./utility/logger");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const authRoute = require("./routes/auth");
const generalRoute = require("./routes/general");

// Load environment variables
dotenv.config();

const app = express();

// ────────────────────────────────
// 🛡️ Security Middleware
// ────────────────────────────────
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["*", "data:", "blob:"],
      connectSrc: ["'self'", "https://restcountries.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  })
);

// Allow all origins with credentials support
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
}));

// ────────────────────────────────
// Request Body Parsers
// ────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// XSS Protection
app.use(xssClean());

// For webhooks (if needed)
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);


// Gzip compression
app.use(compression());

// ────────────────────────────────
// API Routes
// ────────────────────────────────
app.use("/auth", authRoute);
app.use("/general", generalRoute);

// ────────────────────────────────
// Static Frontend Files
// ────────────────────────────────
const staticPath = path.join(__dirname, "client", "dist");
app.use(express.static(staticPath));

// ────────────────────────────────
// Fallback to index.html (SPA)
// ────────────────────────────────
app.get("*", (req, res) => {
  const indexPath = path.join(staticPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      logger.error("Failed to serve index.html", {
        message: err.message,
        stack: err.stack,
      });
      res.status(500).send("Internal server error.");
    }
  });
});

// ────────────────────────────────
//  Start Server
// ────────────────────────────────
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logger.info(` Server running on http://localhost:${PORT}`);
});

// ────────────────────────────────
//  Graceful Shutdown & Error Logs
// ────────────────────────────────
process.on("uncaughtException", (err) => {
  logger.error("🔥 Uncaught Exception", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("⚠️ Unhandled Rejection", {
    reason,
    promise,
  });
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("📢 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("💡 Server closed.");
    process.exit(0);
  });
});

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const xssClean = require("xss-clean");
const bodyParser = require("body-parser");
const logger = require("./utility/logger");

// Routes
const authRoute = require("./routes/auth");
const generalRoute = require("./routes/general");

// Load environment variables
dotenv.config();

const app = express();

// Security headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["*", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// XSS protection
app.use(xssClean());

// Raw body for special routes like webhooks
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// Gzip compression
app.use(compression());

// API routes
app.use("/auth", authRoute);
app.use("/general", generalRoute);

// Serve static files from Vite build
const staticPath = path.join(__dirname, "client", "dist");
app.use(express.static(staticPath));

// Log requests (optional debug)
app.use((req, res, next) => {
  next();
});

// Catch-all to serve frontend
app.get("*", (req, res) => {
  const indexPath = path.join(staticPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Failed to send index.html:", err);
      res.status(500).send("Internal server error.");
    }
  });
});

// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown & error handling
process.on("uncaughtException", (err) => {
  logger.error(`🔥 Uncaught Exception: ${err}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`⚠️ Unhandled Rejection: ${err}`);
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("📢 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("💡 Server closed.");
    process.exit(0);
  });
});

// server.js
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const xssClean = require("xss-clean");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("./utility/logger");

dotenv.config();
const app = express();

// ────────────────────────────────
// Middleware Setup
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
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  })
);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(xssClean());
app.use(compression());
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

const authRoute = require("./routes/auth");
const generalRoute = require("./routes/general");
app.use("/auth", authRoute);
app.use("/general", generalRoute);

const staticPath = path.join(__dirname, "client", "dist");
app.use(express.static(staticPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"), (err) => {
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
// Start Bee‑Queue Worker
// ────────────────────────────────
try {
  require("./redis/queues");
  logger.info("Escrow worker loaded and running...");
  console.log("Escrow worker loaded and running...");
} catch (err) {
  logger.error("Failed to initialize Bee-Queue escrow worker", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
}

// ────────────────────────────────
// Start HTTP Server
// ────────────────────────────────
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logger.info(`Server running on http://localhost:${PORT}`);
});

// ────────────────────────────────
// Global Error Handlers
// ────────────────────────────────
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { message: err.message, stack: err.stack });
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  const stack = reason instanceof Error ? reason.stack : undefined;
  logger.error("Unhandled Rejection", { message, stack, promise });
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
});

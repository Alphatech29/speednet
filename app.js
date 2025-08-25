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

// Middleware Setup
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      imgSrc: ["*", "data:", "blob:"],
      connectSrc: ["'self'", "https://restcountries.com"],
      fontSrc: ["'self'", "data:", "fonts.gstatic.com"],
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

// Routes
const authRoute = require("./routes/auth");
const generalRoute = require("./routes/general");

app.use("/auth", authRoute);
app.use("/general", generalRoute);

// Serve Client App (e.g., React/Vue build)
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

// Start Queue Worker (JobQueue or escrow logic)
try {
  require("./jobs/jobQueues");
  logger.info("Escrow job queue loaded successfully.");
  console.log("Escrow job queue loaded successfully.");
} catch (err) {
  console.error("Escrow queue load failed:", err);
  logger.error("Failed to initialize escrow job queue", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
}

// 🔹 Start SMS Engine (cron job)
{/*
let smsCron;
try {
  const { checkSmsStates } = require("./utility/smsEngine");

  // Run once immediately
  checkSmsStates();

  logger.info("SMS Engine (cron) loaded successfully.");
  console.log("SMS Engine (cron) loaded successfully.");
} catch (err) {
  console.error("SMS Engine load failed:", err);
  logger.error("Failed to initialize SMS Engine", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
}
  */}

// Start HTTP Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server Successfully Connected`);
  logger.info(`Server started on http://localhost:${PORT}`);
});

// Global Error Handlers
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { message: err.message, stack: err.stack });
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  const stack = reason instanceof Error ? reason.stack : undefined;
  logger.error("Unhandled Rejection", { message, stack });
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

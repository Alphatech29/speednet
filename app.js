const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const xssClean = require("xss-clean");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("./utility/logger");

// Load environment variables
dotenv.config();

const app = express();

// ────────────────────────────────
// Security Middleware
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

// ────────────────────────────────
// CORS
// ────────────────────────────────
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
}));

// ────────────────────────────────
//Parsers
// ────────────────────────────────
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ────────────────────────────────
//Cookie & XSS
// ────────────────────────────────
app.use(cookieParser());
app.use(xssClean());

// ────────────────────────────────
// Compression
// ────────────────────────────────
app.use(compression());

// ────────────────────────────────
// Serve Uploaded Files (e.g., Multer)
// ────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ────────────────────────────────
//Routes
// ────────────────────────────────
const authRoute = require("./routes/auth");
const generalRoute = require("./routes/general");

app.use("/auth", authRoute);
app.use("/general", generalRoute);

// ────────────────────────────────
// Serve Static Files (Frontend)
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
//Start Server
// ────────────────────────────────
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logger.info(`Server running on http://localhost:${PORT}`);
});

// ────────────────────────────────
// Graceful Shutdown & Errors
// ────────────────────────────────
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", {
    reason,
    promise,
  });
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'app.log');

// Timestamped log message formatter
const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

const logger = {
  info: (msg) => {
    const formatted = formatMessage('info', msg);
    fs.appendFileSync(logFile, formatted + '\n');
  },
  error: (msg) => {
    const formatted = formatMessage('error', msg);
    console.error(formatted);
    fs.appendFileSync(logFile, formatted + '\n');
  },
  warn: (msg) => {
    const formatted = formatMessage('warn', msg);
    console.warn(formatted);
    fs.appendFileSync(logFile, formatted + '\n');
  }
};

module.exports = logger;

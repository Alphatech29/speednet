const axios = require('axios');

const sendToMonitor = (level, message, metadata = {}) => {
  const base = process.env.ALPHATECH_MONITOR_URL;
  const apiKey = process.env.ALPHATECH_MONITOR_API_KEY;
  if (!base || !apiKey) return;

  const url = base.endsWith('/log') ? base : `${base}/log`;

  const body = { level, message };
  const { stack: explicitStack, ...rest } = metadata;
  const stack = explicitStack || (level === 'error' ? new Error(message).stack : undefined);
  if (stack) body.stack = stack;
  if (Object.keys(rest).length > 0) body.metadata = rest;

  console.log(`[Monitor] [${level.toUpperCase()}] ${message}`, body.metadata || '', body.stack ? `\nStack: ${body.stack}` : '');

  axios.post(url, body, {
    headers: { 'X-API-Key': apiKey },
    timeout: 5000,
  })
    .then(() => console.log(`[Monitor] Sent OK — [${level.toUpperCase()}] ${message}`))
    .catch((err) => console.error(`[Monitor] Failed to send — [${level.toUpperCase()}] ${message}:`, err.message));
};

module.exports = {
  info:    (message, metadata) => sendToMonitor('info',    message, metadata),
  warn:    (message, metadata) => sendToMonitor('warn',    message, metadata),
  error:   (message, metadata) => sendToMonitor('error',   message, metadata),
  success: (message, metadata) => sendToMonitor('success', message, metadata),
};

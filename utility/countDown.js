const { getWebSettings } = require("./general");

const formatDateToWATString = (date) => {
  const pad = (num) => String(num).padStart(2, '0');

  // Convert from UTC to WAT (UTC+1)
  const watDate = new Date(date.getTime() + 60 * 60 * 1000); // +1 hour

  const year = watDate.getUTCFullYear();
  const month = pad(watDate.getUTCMonth() + 1);
  const day = pad(watDate.getUTCDate());
  const hours = pad(watDate.getUTCHours());
  const minutes = pad(watDate.getUTCMinutes());
  const seconds = pad(watDate.getUTCSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getEscrowExpiry = async () => {
  try {
    const settings = await getWebSettings();

    if (!settings) {
      throw new Error("Web settings not found");
    }

    const escrowMinutes = parseInt(settings.escrow_time, 10);

    if (isNaN(escrowMinutes) || escrowMinutes <= 0) {
      throw new Error("'escrow_time' is missing or invalid in web_settings");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + escrowMinutes * 60 * 1000);

    const formattedExpiry = formatDateToWATString(expiresAt);

    return formattedExpiry; // e.g., "2025-07-06 18:45:00"
  } catch (error) {
    console.error("[getEscrowExpiry] Failed:", error.message || error);
    throw new Error("Failed to calculate escrow expiry time");
  }
};

module.exports = { getEscrowExpiry };

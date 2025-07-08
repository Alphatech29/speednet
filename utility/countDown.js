const moment = require('moment-timezone');
const { getWebSettings } = require('./general');

const TIMEZONE = 'Africa/Lagos';

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

    // ✅ Always use timezone-aware moment at creation
    const now = moment.tz(TIMEZONE);
    const expiresAt = now.clone().add(escrowMinutes, 'minutes');

    // ✅ Log actual values for debugging
    console.log(`[GENERATOR] Now (${TIMEZONE}): ${now.format('YYYY-MM-DD HH:mm:ss')} / Expiry: ${expiresAt.format('YYYY-MM-DD HH:mm:ss')}`);

    // ✅ Save in WAT format (not UTC)
    return expiresAt.format('YYYY-MM-DD HH:mm:ss');
  } catch (error) {
    console.error("[getEscrowExpiry] Failed:", error.message || error);
    throw new Error("Failed to calculate escrow expiry time");
  }
};

module.exports = { getEscrowExpiry };

const { updateSmsServiceRecord } = require("./history");
const monitor = require("./monitor");

const HEROSMS_IPS = ["84.32.223.53", "185.138.88.87"];

async function smspoolWebhook(req, res) {
  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
    if (!HEROSMS_IPS.includes(ip)) {
      monitor.warn("SMS webhook blocked — unauthorized IP", { ip });
      console.warn(`[HeroSMS Webhook] Blocked unauthorized IP: ${ip}`);
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const data = req.body;
    console.log("[HeroSMS Webhook] Incoming payload:", data);

    // HeroSMS webhook format: { activationId, service, text, code, country, receivedAt }
    const orderId = data.activationId;
    const smsText = data.text || data.code || "";

    if (!orderId) {
      console.warn("[HeroSMS Webhook] Missing activationId");
      return res.status(400).json({ success: false, message: "Missing activationId" });
    }

    const updateResult = await updateSmsServiceRecord(orderId, smsText, 1);

    if (!updateResult.success) {
      console.warn(`[HeroSMS Webhook] Could not update sms_service for order "${orderId}":`, updateResult.message);
      // Still respond 200 so HeroSMS doesn't retry endlessly
      return res.status(200).json({ success: false, message: updateResult.message });
    }

    monitor.success("SMS code received via webhook", { orderId, smsText });
    console.log(`[HeroSMS Webhook] sms_service updated for order "${orderId}"`);
    return res.status(200).json({ success: true });
  } catch (error) {
    monitor.error("SMS webhook crash", { stack: error.stack, message: error.message });
    console.error("[HeroSMS Webhook] Error:", error);
    return res.status(200).json({ success: false, message: "Server error" });
  }
}

module.exports = { smspoolWebhook };

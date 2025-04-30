const crypto = require('crypto');
const { getWebSettings } = require('../utility/general');

function getSortedPayloadJSON(payload) {
  const sorted = {};
  Object.keys(payload).sort().forEach(key => {
    sorted[key] = payload[key];
  });
  return JSON.stringify(sorted);
}

function generateSignature(payload, apiKey) {
  const sortedPayload = getSortedPayloadJSON(payload);
  return crypto.createHmac('sha256', apiKey).update(sortedPayload).digest('hex');
}

function isValidSignature(receivedSignature, payload, apiKey) {
  const expectedSignature = generateSignature(payload, apiKey);
  return receivedSignature === expectedSignature;
}

const Webhook = async (req, res) => {
  try {
    const payload = req.body;
    const signature = req.headers['sign'];
    const { cryptomus_api_key } = await getWebSettings();

    if (!isValidSignature(signature, payload, cryptomus_api_key)) {
      return res.status(403).json({ error: 'Invalid signature' });
    }

    const { order_id, status } = payload;

    if (status === 'paid') {
      console.log(`✅ Payment successful for order ${order_id}`);
    } else {
      console.log(`⚠️ Payment status for ${order_id}: ${status}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { Webhook };

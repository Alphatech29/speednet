const { getWebSettings } = require('./general');
const crypto = require('crypto');
const axios = require('axios');

const BASE_URL = 'https://api.cryptomus.com/v1/payment';

async function createPayment({ amount, currency, userUid, paymentMethod = 'usdt' }) {
  const { cryptomus_api_key, cryptomus_merchant_uuid } = await getWebSettings();

  if (!cryptomus_api_key || !cryptomus_merchant_uuid) {
    throw new Error('Missing Cryptomus API credentials');
  }

  const order_id = `${userUid}-${Date.now()}`;

  const payload = {
    amount,
    currency,
    order_id,
    url_callback: 'http://localhost:8000/general/webhook',
    network: paymentMethod,
  };

  const jsonPayload = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonPayload).toString('base64');

  const signature = crypto
    .createHash('md5')
    .update(base64Payload + cryptomus_api_key)
    .digest('hex');

  try {
    const response = await axios.post(BASE_URL, payload, {
      headers: {
        'merchant': cryptomus_merchant_uuid,
        'sign': signature,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    const { data } = response;

    if (data.status !== 'success') {
      throw new Error(data.message || 'Payment creation failed');
    }

    return {
      payment_url: data.result.url,
      payment_uuid: data.result.uuid,
      order_id,
    };

  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error('Error during Cryptomus API request:', errData);
    throw new Error(`Cryptomus API error: ${JSON.stringify(errData)}`);
  }
}

module.exports = { createPayment };

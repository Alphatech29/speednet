const axios = require('axios');
const crypto = require('crypto');
const { getWebSettings } = require('./general');

const BASE_URL = 'https://api.cryptomus.com/v1/payment';

async function createPayment({ amount, currency, userUid }) {
  console.log('[createPayment] Starting payment creation...');
  
  const { cryptomus_api_key, cryptomus_merchant_uuid } = await getWebSettings();
  console.log('[createPayment] Retrieved credentials:', {
    cryptomus_api_key: cryptomus_api_key?.slice(0, 6) + '***',
    cryptomus_merchant_uuid
  });

  if (!cryptomus_api_key || !cryptomus_merchant_uuid) {
    throw new Error('Missing Cryptomus API credentials');
  }

  const order_id = `${userUid}`;
  const amountString = parseFloat(amount).toFixed(2);

  const payload = {
    amount: amountString,
    currency,
    order_id,
    url_callback: 'https://speednet.com/general/webhook',
    network: 'tron',
  };

  console.log('[createPayment] Payload:', payload);

  const jsonPayload = JSON.stringify(payload);
  console.log('[createPayment] JSON Payload:', jsonPayload);

  const base64Payload = Buffer.from(jsonPayload).toString('base64');
  console.log('[createPayment] Base64 Payload:', base64Payload);

  const signature = crypto
    .createHash('md5')
    .update(base64Payload + cryptomus_api_key)
    .digest('hex');

  console.log('[createPayment] Signature:', signature);

  try {
    console.log('[createPayment] Sending request to:', BASE_URL);
    
    const response = await axios.post(BASE_URL, jsonPayload, {
      headers: {
        'merchant': cryptomus_merchant_uuid,
        'sign': signature,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    const { data } = response;
    console.log('[createPayment] Response:', data);

    if (data.status !== 'success') {
      throw new Error(data.message || 'Payment creation failed');
    }

    const result = {
      payment_url: data.result.url,
      payment_uuid: data.result.uuid,
      order_id,
    };

    console.log('[createPayment] Payment created successfully:', result);

    return result;

  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error('[createPayment] Cryptomus API error:', errData);
    throw new Error(`Cryptomus API error: ${JSON.stringify(errData)}`);
  }
}

module.exports = { createPayment };

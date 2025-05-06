const axios = require('axios');
const crypto = require('crypto');
const { getWebSettings } = require('./general');
const logger = require('../utility/logger');

async function createPayment({ amount, currency, userUid }) {

  const { cryptomus_api_key, cryptomus_merchant_uuid, cryptomus_url, web_url } = await getWebSettings();

  if (!cryptomus_api_key || !cryptomus_merchant_uuid || !cryptomus_url || !web_url) {
    logger.error('[createPayment] Missing Cryptomus API credentials or URL.');
    throw new Error('Missing Cryptomus API credentials or URL.');
  }

  if (!amount || isNaN(amount) || !currency || !userUid) {
    logger.error('[createPayment] Invalid payment parameters:', { amount, currency, userUid });
    throw new Error('Invalid payment parameters.');
  }

  const amountString = parseFloat(amount).toFixed(2);
  const order_id = `${userUid}-${Date.now()}`;

  const payload = {
    amount: amountString,
    currency,
    order_id,
    url_callback: `${web_url}/general/cryptomus/webhook`, 
    network: 'tron',
    url_success: `${web_url}/user/wallet`,
    return_url: `${web_url}/user/wallet`
  };

  const jsonPayload = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonPayload).toString('base64');

  const signature = crypto
    .createHash('md5')
    .update(base64Payload + cryptomus_api_key)
    .digest('hex');

  try {
    const response = await axios.post(`${cryptomus_url}/v1/payment`, payload, {
      headers: {
        merchant: cryptomus_merchant_uuid,
        sign: signature,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    const { data } = response;

    if (data.state !== 0 || data.result?.status !== 'check') {
      logger.error('[createPayment] Failed response:', data);
      throw new Error(data.message || 'Payment creation failed.');
    }

    logger.info('[createPayment] Payment URL generated successfully for order:', order_id);
    return {
      payment_url: data.result.url,
      payment_uuid: data.result.uuid,
      order_id,
    };
  } catch (error) {
    const errData = error.response?.data || error.message;
    logger.error('[createPayment] Cryptomus API error:', errData);
    throw new Error(`Cryptomus API error: ${JSON.stringify(errData)}`);
  }
}

module.exports = { createPayment };

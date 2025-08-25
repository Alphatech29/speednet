const axios = require('axios');
const { getWebSettings } = require('./general');
const logger = require('../utility/logger');

// Function to convert USD to XAF
async function convertUsdToXaf(usdAmount, xafRate) {
  const xafAmount = usdAmount * xafRate;
  return xafAmount;
}

// Main function to initiate payment
async function fapshiPayment({ amount, user_id, email }) {

  if (!user_id) {
    logger.error('Missing user ID.');
    console.error('Missing user ID.');
    throw new Error('Missing user ID.');
  }

  const {
    fapshi_key,
    fapshi_url,
    fapshi_user,
    xaf_rate,
    web_url
  } = await getWebSettings();

 
  if (!fapshi_key || !fapshi_url || !fapshi_user || !xaf_rate || !web_url) {
    logger.error('Missing Fapshi configuration or XAF rate.');
    console.error('Missing Fapshi configuration or XAF rate.');
    throw new Error('Missing Fapshi configuration or XAF rate.');
  }

  const usdAmount = parseFloat(amount);

  if (isNaN(usdAmount)) {
    logger.error('Amount must be a valid number.');
    console.error('Amount must be a valid number.');
    throw new Error('Amount must be a valid number.');
  }

  const xafAmount = await convertUsdToXaf(usdAmount, xaf_rate);

  if (isNaN(xafAmount) || xafAmount < 100) {
    logger.error('Converted XAF amount must be at least 100.');
    console.error('Converted XAF amount must be at least 100.');
    throw new Error('Converted XAF amount must be at least 100.');
  }

  const redirectUrl = `${web_url}/user/wallet`;

  const payload = {
    amount: xafAmount,
    currency: 'XAF',
    email,
    userId: user_id,
    redirectUrl,
    webhook: `${web_url}/general/fapshi/webhook`
  };

  try {
    const response = await axios.post(`${fapshi_url}/initiate-pay`, payload, {
      headers: {
        apikey: fapshi_key,
        apiuser: fapshi_user,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;

    if (!data?.link || !data?.transId) {
      const errorMessage = data?.message || 'Fapshi payment initiation failed.';
      logger.error(errorMessage);
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = {
      checkout_url: data.link,
      transaction_reference: data.transId,
      user_id,
      redirect_url: redirectUrl
    };

  
    return result;
  } catch (error) {
    const errData = error.response?.data || error.message || 'Unknown error';
    logger.error(`Fapshi API Error: ${errData}`);
    console.error('Fapshi API Error:', errData);
    throw new Error(`Fapshi API error: ${JSON.stringify(errData)}`);
  }
}

module.exports = { fapshiPayment };

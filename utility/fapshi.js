const axios = require('axios');
const { getWebSettings } = require('./general');

// Function to convert USD to XAF
async function convertUsdToXaf(usdAmount, xafRate) {
  const xafAmount = usdAmount * xafRate;
  return xafAmount;
}

// Main function to initiate payment
async function fapshiPayment({ amount, user_id, email }) {
  if (!user_id) {
    throw new Error('Missing user ID.');
  }

  const { fapshi_key, fapshi_url, fapshi_user, xaf_rate, web_url } = await getWebSettings();

  if (!fapshi_key || !fapshi_url || !fapshi_user || !xaf_rate || !web_url) {
    throw new Error('Missing Fapshi configuration or XAF rate.');
  }

  const usdAmount = parseFloat(amount);
  if (isNaN(usdAmount)) {
    throw new Error('Amount must be a valid number.');
  }

  const xafAmount = await convertUsdToXaf(usdAmount, xaf_rate);

  if (isNaN(xafAmount) || xafAmount < 100) {
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
      throw new Error(data?.message || 'Fapshi payment initiation failed.');
    }

    return {
      checkout_url: data.link,
      transaction_reference: data.transId,
      user_id,
      redirect_url: redirectUrl
    };
  } catch (error) {
    const errData = error.response?.data || error.message || 'Unknown error';
    console.error('Fapshi API Error:', errData);
    throw new Error(`Fapshi API error: ${JSON.stringify(errData)}`);
  }
}

module.exports = { fapshiPayment };

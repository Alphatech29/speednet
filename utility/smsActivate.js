const axios = require('axios');

const BASE_URL = 'https://onlinesim.io/api/';
const API_KEY = 'P938yxRv2L179rG-1M51BxNQ-PgXRWs73-G1tX6c9m-j2frrJ589xE4L3w';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'User-Agent': 'OnlineSimClient/1.0'
  },
  params: {
    apikey: API_KEY
  }
});

async function getTariffs(params = {}) {
  try {
    const resp = await client.get('getTariffs.php', {
      params: { lang: 'en', ...params }
    });
    return resp.data;
  } catch (err) {
    console.error("[getTariffs] Failed:", err.response?.data || err.message);
    return err.response?.data || { error: err.message };
  }
}

async function getServicesByCountry(countryCode, params = {}) {
  try {
    const resp = await client.get('getNumbersStats.php', {
      params: { country: countryCode, lang: 'en', ...params }
    });
    return resp.data;
  } catch (err) {
    console.error("[getServicesByCountry] Failed:", err.response?.data || err.message);
    return err.response?.data || { error: err.message };
  }
}

async function getState(tzid, lang = 'en') {
  if (!tzid) throw new Error('tzid is required');
  try {
    const resp = await client.get('getState.php', {
      params: { lang, tzid }
    });
    return resp.data;
  } catch (err) {
    console.error("[getState] Failed:", err.response?.data || err.message);
    return {
      response: 0,
      error: err.response?.data?.error || err.message || 'Unknown error',
    };
  }
}

async function buyNumber({ service, country, userId, lang = 'en', ...extraParams }) {
  try {
    if (!service) throw new Error('Service name is required.');
    if (!userId) throw new Error('User ID is required.');

    console.log("[buyNumber] User ID:", userId);

    // Check balance
    const balanceResp = await client.get('getBalance.php', { params: { lang } });
    if (!balanceResp.data || balanceResp.data.balance === undefined) {
      throw new Error('Unable to fetch balance.');
    }
    if (balanceResp.data.balance <= 0) {
      throw new Error(`Insufficient balance: ${balanceResp.data.balance}`);
    }

    // Prepare parameters for buying number
    const params = { service, lang, userId, ...extraParams };
    if (country) params.country = country;

    console.log("[buyNumber] Final Request Params:", params);

    const resp = await client.get('getNum.php', { params });
    console.log("[buyNumber] Buy Response:", resp.data);

    // Handle error responses (strings like 'ERROR_NO_SERVICE', 'ERROR_NUM_WAIT', etc.)
    if (typeof resp.data.response === 'string' && resp.data.response.startsWith('ERROR')) {
      // Return the error response for caller to handle
      return resp.data;
    }

    // Check success: response === 1 and tzid exists
    if (resp.data.response !== 1 || !resp.data.tzid) {
      throw new Error("Failed to get transaction ID (tzid)");
    }

    const tzid = resp.data.tzid;

    // Poll getState until number available or timeout
    const timeoutMs = 30000; // 30 seconds max wait
    const intervalMs = 2000; // 2 seconds interval
    let elapsed = 0;
    let numberInfo = null;

    while (elapsed < timeoutMs) {
      const stateResp = await getState(tzid, lang);
      console.log(`[buyNumber] State Response after ${elapsed}ms:`, stateResp);

      numberInfo = Array.isArray(stateResp) ? stateResp[0] : stateResp;
      if (numberInfo?.number) break;

      await new Promise(r => setTimeout(r, intervalMs));
      elapsed += intervalMs;
    }

    if (!numberInfo?.number) {
      throw new Error("Timeout waiting for number assignment from OnlineSim");
    }

    return {
      ...resp.data,
      number: numberInfo.number,
      userId,
    };

  } catch (err) {
    console.error("[buyNumber] Failed:", err.response?.data || err.message);
    return err.response?.data || { error: err.message, userId };
  }
}


module.exports = {
  getTariffs,
  getServicesByCountry,
  getState,
  buyNumber
};

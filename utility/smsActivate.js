// services/onlinesim.js
const axios = require('axios');

const BASE_URL = 'https://onlinesim.io/api/';
const API_KEY = '12RL4TwGwWz1L5f-tBT9cL8P-7kMQN2hc-K3BzWtX4-Gm95tS2Mb18nvE8';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'User-Agent': 'OnlineSimClient/1.0'
  },
  params: {
    apikey: API_KEY
  }
});

// Internal only
async function getBalance() {
  try {
    const resp = await client.get('getBalance.php');
  } catch (err) {
    console.error('Balance check failed:', err.response?.data || err.message);
  }
}

// Exposed
async function getTariffs(params = {}) {
  try {
    const resp = await client.get('getTariffs.php', {
      params: { lang: 'en', ...params }
    });
    //console.log('🌐 Raw getTariffs response:', JSON.stringify(resp.data, null, 2));
    return {
      success: true,
      data: resp.data
    };
  } catch (err) {
    console.error('❌ getTariffs failed:', err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}


// Commented Out

// async function getNumber(serviceSlug, countryCode) {
//   try {
//     const resp = await client.get('getNum.php', {
//       params: { service: serviceSlug, country: countryCode }
//     });

//     console.log('Raw getNumber response:', resp.data); // log raw result

//     return { success: true, data: resp.data };
//   } catch (err) {
//     console.error('getNumber failed:', err.response?.data || err.message);
//     return { success: false, error: err.response?.data || err.message };
//   }
// }

// async function getState(tzid, message_to_code = 0) {
//   try {
//     const resp = await client.get('getState.php', {
//       params: { tzid, message_to_code, lang: 'en' }
//     });

//     console.log('Raw getState response:', resp.data); // log raw result

//     return { success: true, data: resp.data };
//   } catch (err) {
//     console.error('getState failed:', err.response?.data || err.message);
//     return { success: false, error: err.response?.data || err.message };
//   }
// }

// async function setOperationOk(tzid) {
//   try {
//     const resp = await client.get('setOperationOk.php', {
//       params: { tzid }
//     });

//     console.log('Raw setOperationOk response:', resp.data);

//     return { success: true, data: resp.data };
//   } catch (err) {
//     console.error('setOperationOk failed:', err.response?.data || err.message);
//     return { success: false, error: err.response?.data || err.message };
//   }
// }

// getBalance();

 module.exports = {
  getTariffs,
//   getNumber,
//   getState,
//   setOperationOk
};

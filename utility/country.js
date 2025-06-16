const axios = require('axios');

const getCountrys = async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name', {
      timeout: 10000,
    });

    if (response.status !== 200 || !Array.isArray(response.data)) {
      return res.status(500).json({ error: 'Unexpected response structure' });
    }

    const countryNames = response.data.map(
      country => country?.name?.common || 'Unknown'
    );

    return res.status(200).json({ countries: countryNames });
  } catch (error) {
    console.error('Error fetching countries:', error);

    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error(' Headers:', error.response.headers);

      return res.status(error.response.status).json({
        error: `API Error: ${error.response.data.message || error.response.statusText}`,
      });
    } else if (error.request) {
      return res.status(504).json({
        error: 'No response from server. Please check your network or the API URL.',
      });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = { getCountrys };

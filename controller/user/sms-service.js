const {
  getTariffs,
  // getNumber,
  // getState,
  // setOperationOk
} = require('../../utility/smsActivate');


// ✅ Controller: Fetch all available countries
const fetchOnlineSimCountries = async (req, res) => {
  try {
    const result = await getTariffs();
    console.log('📦 getTariffs raw result:', JSON.stringify(result, null, 2));

    if (!result || !result.success) {
      console.log('❌ Top-level success false or missing');
      return res.status(502).json({
        success: false,
        message: 'OnlineSim API request failed at top level',
      });
    }

    const data = result.data;
    if (!data) {
      console.log('❌ Missing data field in response');
      return res.status(502).json({
        success: false,
        message: 'OnlineSim response missing data',
      });
    }

    if (data.response !== '1') {
      console.log('❌ Invalid response code inside data:', data.response);
      return res.status(502).json({
        success: false,
        message: `Failed to fetch data from OnlineSim: invalid response code (${data.response})`,
      });
    }

    if (typeof data.countries !== 'object' || data.countries === null) {
      console.log('❌ `countries` missing or invalid type');
      return res.status(502).json({
        success: false,
        message: 'Failed to fetch countries from OnlineSim',
      });
    }

    if (typeof data.services !== 'object' || data.services === null) {
      console.log('❌ `services` missing or invalid type');
      return res.status(502).json({
        success: false,
        message: 'Failed to fetch services from OnlineSim',
      });
    }

    // Transform countries with associated services
    const countries = Object.entries(data.countries)
      .filter(([_, entry]) => entry?.name)
      .map(([rawCode, entry]) => {
        const code = rawCode.replace(/^_/, ''); // Clean up the country code
        const services = [];

        // Match services that support this country
        for (const [slug, service] of Object.entries(data.services)) {
          const serviceCountryData = service.country?.[`_${code}`];
          if (serviceCountryData) {
            services.push({
              id: service.id,
              slug,
              name: service.service,
              price: serviceCountryData.price,
              count: serviceCountryData.count,
            });
          }
        }

        return {
          name: entry.name,
          code,
          original: entry.original,
          pos: entry.pos,
          new: entry.new,
          enable: entry.enable,
          services,
        };
      });

    return res.status(200).json({
      success: true,
      countries,
    });

  } catch (error) {
    console.error('❌ Error fetching OnlineSim data:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};







// ✅ Controller: Fetch all unique services
// const fetchOnlineSimServices = async (req, res) => {
//   try {
//     const result = await getTariffs();

//     if (!result.success) {
//       return res.status(502).json({
//         success: false,
//         message: result.error || 'Failed to fetch services from OnlineSim.',
//       });
//     }

//     const servicesSet = new Set();
//     Object.values(result.data).forEach(country => {
//       Object.keys(country.services || {}).forEach(service => servicesSet.add(service));
//     });

//     const services = Array.from(servicesSet);

//     return res.status(200).json({
//       success: true,
//       services,
//     });

//   } catch (error) {
//     console.error('Error fetching OnlineSim services:', error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Internal server error while fetching services.',
//     });
//   }
// };

// ✅ Controller: Fetch services + pricing info by country
// const fetchOnlineSimServicesWithPricesByCountry = async (req, res) => {
//   try {
//     const { countryId } = req.query;

//     if (!countryId) {
//       return res.status(400).json({
//         success: false,
//         message: 'countryId is required in query parameters.',
//       });
//     }

//     const result = await getTariffs();

//     if (!result.success || !result.data[countryId]) {
//       return res.status(502).json({
//         success: false,
//         message: result.error || 'Failed to fetch services for country from OnlineSim.',
//       });
//     }

//     const country = result.data[countryId];

//     const services = Object.entries(country.services || {}).map(([key, val]) => ({
//       service: key,
//       price: val.cost,
//       count: val.count,
//     }));

//     return res.status(200).json({
//       success: true,
//       services,
//     });

//   } catch (error) {
//     console.error('Error fetching OnlineSim services with prices:', error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Internal server error while fetching services.',
//     });
//   }
// };

// ✅ Export OnlineSim controllers (except getBalance, which is internal)
module.exports = {
  fetchOnlineSimCountries,
  // fetchOnlineSimServices,
  // fetchOnlineSimServicesWithPricesByCountry,
};

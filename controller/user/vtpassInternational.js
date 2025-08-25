const {
  getInternationalAirtimeCountries, getInternationalProductTypes, getInternationalOperators, getInternationalVariations} = require("../../utility/vtpass");

// Controller: Fetch list of international countries for airtime purchase
const getInternationalCountries = async (req, res) => {
  try {
    const result = await getInternationalAirtimeCountries();

    if (!result || !result.success) {
      return res.status(400).json({
        success: false,
        message: result?.error || "Failed to fetch countries.",
      });
    }

    // List of African country codes
    const africanCountryCodes = [
      'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 
      'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 
      'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'YT', 'MA', 'MZ', 'NA', 'NE', 
      'NG', 'RE', 'RW', 'SH', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 
      'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW'
    ];

    // List of specific non-African countries we want to include
    const specificCountryCodes = ['CA', 'US', 'GB', 'DE', 'FR'];
    
    // Filter the countries
    const filteredCountries = result.countries.filter(country => {
      return africanCountryCodes.includes(country.code) || 
             specificCountryCodes.includes(country.code);
    });

    return res.status(200).json({
      success: true,
      message: "Countries fetched successfully.",
      data: filteredCountries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

// Controller: Fetch product types for international airtime purchase
const fetchInternationalProductTypes = async (req, res) => {
  try {
    const { countryCode } = req.params;

    // Validate country code
    if (!countryCode || typeof countryCode !== 'string' || !countryCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing country code.",
      });
    }

    const result = await getInternationalProductTypes(countryCode.trim());

    // Check if the fetch was successful
    if (!result?.success) {
      return res.status(400).json({
        success: false,
        message: result.error || "Failed to fetch international product types.",
      });
    }

    // Return success with product types
    return res.status(200).json({
      success: true,
      message: "International product types fetched successfully.",
      data: result.productTypes,
    });
  } catch (error) {
    console.error("Error in fetchInternationalProductTypes:", error);

    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error.message || "Unknown error.",
    });
  }
};

// Controller: Fetch international operators for a given country code
const fetchInternationalOperators = async (req, res) => {
  try {
    const { countryCode, productTypeId } = req.params;

    // Validate both parameters
    if (
      !countryCode || typeof countryCode !== "string" || !countryCode.trim() ||
      !productTypeId || typeof productTypeId !== "string" || !productTypeId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing countryCode or productTypeId.",
      });
    }

    const result = await getInternationalOperators(countryCode.trim(), productTypeId.trim());

    // Check if the VTpass API call was successful
    if (result.response_description !== "000") {
      return res.status(400).json({
        success: false,
        message: result.error || "Failed to fetch international operators.",
      });
    }

    // Return the operators directly
    return res.status(200).json({
      success: true,
      message: "International operators fetched successfully.",
      data: result.content,
    });
  } catch (error) {
    console.error("Error in fetchInternationalOperators:", error);

    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error.message || "Unknown error.",
    });
  }
};


// Controller: Fetch international variations for a given operator and product type
const fetchInternationalVariations = async (req, res) => {
  try {
    const { operatorId, productTypeId } = req.params;

    // Validate operatorId
    if (!operatorId || typeof operatorId !== "string" || !operatorId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing operator ID.",
      });
    }

    // Validate productTypeId
    if (!productTypeId || isNaN(Number(productTypeId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing product type ID.",
      });
    }

    const result = await getInternationalVariations(operatorId.trim(), Number(productTypeId));

    if (!result?.success) {
      return res.status(400).json({
        success: false,
        message: result.error || "Failed to fetch variations.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "International variations fetched successfully.",
      data: result.variations,
    });
  } catch (error) {
    console.error("Error in fetchInternationalVariations:", error);

    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error.message || "Unknown error.",
    });
  }
};




module.exports = {
  getInternationalCountries,
  fetchInternationalProductTypes,
  fetchInternationalOperators,
  fetchInternationalVariations
};

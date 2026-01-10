const { getDarkShopProducts } = require("../../../utility/darkshopProduct");
const { getWebSettings } = require("../../../utility/general");
const { getCategoryCommissions } = require("../../../utility/darkshopCommission");


async function fetchAllDarkShopProducts234(req, res) {
  try {
    const products = await getDarkShopProducts();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    const webSettings = await getWebSettings();
    const RUB_TO_USD = parseFloat(webSettings?.usd_rub) || 0;

    // Fetch category commissions
    const commissions = await getCategoryCommissions();

    // Convert commissions array to a lookup object
    const commissionLookup = {};
    commissions.forEach(c => {
      commissionLookup[c.category_id] = parseFloat(c.commission) || 0;
    });

    const productsWithCommission = products.map(product => {
      const price_rub = parseFloat(product.price) || 0;

      // USD price before commission
      const priceUSD = price_rub * RUB_TO_USD;

      // Get commission for this product's category
      const commissionPercent = commissionLookup[product.category_id] || 0;

      // USD price after commission
      const priceWithCommissionUSD = priceUSD + (priceUSD * commissionPercent / 100);

      return {
        ...product,
        price_rub, // original RUB price
        price: priceWithCommissionUSD.toFixed(2),
      };
    });

    return res.status(200).json({
      success: true,
      data: productsWithCommission,
    });
  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  fetchAllDarkShopProducts234,
};

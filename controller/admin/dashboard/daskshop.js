const { getCategoriesWithGroups } = require("../../../utility/darkshopCategories");
const { 
  getDarkShopProducts, 
  getDarkShopProductById,
  updateDarkShopProductById,
  assignProductToVendor
} = require("../../../utility/darkshopProduct");
const { getWebSettings } = require("../../../utility/general");
const { getCategoryCommissions } = require("../../../utility/darkshopCommission");


/**
 * GET /api/categories-with-groups
 */
async function getCategoriesWithGroupsController(req, res) {
  try {
    const result = await getCategoriesWithGroups();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || "Unable to fetch categories"
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

/**
 * Fetch all products from dark_shop_products table
 */
async function fetchAllDarkShopProducts(req, res) {
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

/**
 * Fetch single product by ID
 * GET /api/darkshop-products/:id
 */
async function fetchDarkShopProductById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await getDarkShopProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const webSettings = await getWebSettings();
    const RUB_TO_USD = parseFloat(webSettings?.usd_rub) || 0;

    const price = parseFloat(product.price) || 0;

    const productWithUSD = {
      ...product,
      price: (price * RUB_TO_USD).toFixed(2),
    };

    return res.status(200).json({
      success: true,
      data: productWithUSD,
    });

  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function updateDarkShopProductController(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    const updated = await updateDarkShopProductById(
      id,
      name.trim(),
      description.trim()
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found or no changes made",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });

  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function assignProductToVendorController(req, res) {
  try {
    const { productId, vendorId } = req.body;

    if (!productId || !vendorId) {
      return res.status(400).json({
        success: false,
        message: "Product ID and Vendor ID are required",
      });
    }

    await assignProductToVendor(productId, vendorId);

    return res.status(200).json({
      success: true,
      message: `Product ID ${productId} assigned to Vendor ID ${vendorId} successfully`,
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
  getCategoriesWithGroupsController,
  fetchAllDarkShopProducts,
  fetchDarkShopProductById,
  updateDarkShopProductController,
  assignProductToVendorController
};

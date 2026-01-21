const {
  getCategoriesWithGroups, deleteCategory, deleteGroup
} = require("../../../utility/darkshopCategories");
const {
  getDarkShopProducts,
  getDarkShopProductById,
  updateDarkShopProductById,
  assignProductToVendor,
} = require("../../../utility/darkshopProduct");
const { getWebSettings } = require("../../../utility/general");
const {
  getCategoryCommissions,
} = require("../../../utility/darkshopCommission");

const INSTANT_DELIVERY_ICON = "/uploads/image.png";

const SYSTEM_SELLERS = [
  { name: "FastLane", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=FastLane" },
  { name: "GhostNode", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=GhostNode" },
  { name: "IronAccess", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=IronAccess" },
  { name: "ShadowHub", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=ShadowHub" },
  { name: "EuroLink", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=EuroLink" },
  { name: "BalticSystems", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=BalticSystems" },
  { name: "AtlasNet", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=AtlasNet" },
  { name: "NordicAccess", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=NordicAccess" },
  { name: "AlexNet", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=AlexNet" },
  { name: "JayConnect", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=JayConnect" },
  { name: "LeoSystems", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=LeoSystems" },
  { name: "MaxDigital", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=MaxDigital" },
  { name: "RyanHub", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=RyanHub" },
  { name: "NickServices", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=NickServices" },
];

function getAutoAssignedSeller(productId) {
  const index = productId % SYSTEM_SELLERS.length;
  return SYSTEM_SELLERS[index];
}

/**
 * GET /api/categories-with-groups
 */
async function getCategoriesWithGroupsController(req, res) {
  try {
    const result = await getCategoriesWithGroups();
    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message || "Unable to fetch categories" });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// DELETE /api/darkshop-category/:id
async function deleteCategoryController(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Category ID is required" });

    const result = await deleteCategory(id);
    if (!result.success) return res.status(404).json(result);

    console.log(`Category deleted successfully: ID = ${id}`);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * DELETE /api/darkshop-group/:id
 * Deletes a group and all its products (via cascading)
 */
async function deleteGroupController(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Group ID is required" });

    const result = await deleteGroup(id);
    if (!result.success) return res.status(404).json(result);

    console.log(`Group deleted successfully: ID = ${id}`);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


/**
 * Fetch all products
 * GET /api/darkshop-products
 */
async function fetchAllDarkShopProducts(req, res) {
  try {
    const products = await getDarkShopProducts();
    if (!products.length) return res.status(404).json({ success: false, message: "No products found" });

    const webSettings = await getWebSettings();
    const RUB_TO_USD = parseFloat(webSettings?.usd_rub) || 0;

    const commissions = await getCategoryCommissions();
    const commissionLookup = {};
    commissions.forEach((c) => { commissionLookup[c.category_id] = parseFloat(c.commission) || 0; });

    const productsWithCommission = products.map((product) => {
      const price_rub = parseFloat(product.price) || 0;
      const priceUSD = price_rub * RUB_TO_USD;
      const commissionPercent = commissionLookup[product.category_id] || 0;
      const priceWithCommissionUSD = priceUSD + (priceUSD * commissionPercent) / 100;
      const sellerInfo = getAutoAssignedSeller(product.id);

      return {
        ...product,
        price_rub,
        price: priceWithCommissionUSD.toFixed(2),
        seller: sellerInfo.name,
        avatar: sellerInfo.avatar,
        instant_delivery: true,
        icon: INSTANT_DELIVERY_ICON,
      };
    });

    return res.status(200).json({ success: true, data: productsWithCommission });
  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * Fetch single product by ID
 */
async function fetchDarkShopProductById(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

    const product = await getDarkShopProductById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const webSettings = await getWebSettings();
    const RUB_TO_USD = parseFloat(webSettings?.usd_rub) || 0;
    const price_rub = parseFloat(product.price) || 0;
    const sellerInfo = getAutoAssignedSeller(product.id);

    return res.status(200).json({
      success: true,
      data: {
        ...product,
        price_rub,
        price: (price_rub * RUB_TO_USD).toFixed(2),
        seller: sellerInfo.name,
        avatar: sellerInfo.avatar,
        instant_delivery: true,
        icon: INSTANT_DELIVERY_ICON,
      },
    });
  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * Update product name & description
 */
async function updateDarkShopProductController(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id || !name || !description) {
      return res.status(400).json({ success: false, message: "Product ID, name and description are required" });
    }

    const updated = await updateDarkShopProductById(id, name.trim(), description.trim());
    if (!updated) return res.status(404).json({ success: false, message: "Product not found or no changes made" });

    return res.status(200).json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * Assign product to vendor (manual override)
 */
async function assignProductToVendorController(req, res) {
  try {
    const { productId, vendorId } = req.body;
    if (!productId || !vendorId) {
      return res.status(400).json({ success: false, message: "Product ID and Vendor ID are required" });
    }

    await assignProductToVendor(productId, vendorId);
    return res.status(200).json({ success: true, message: `Product ID ${productId} assigned to Vendor ID ${vendorId} successfully` });
  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  getCategoriesWithGroupsController,
  deleteCategoryController,
  deleteGroupController,
  fetchAllDarkShopProducts,
  fetchDarkShopProductById,
  updateDarkShopProductController,
  assignProductToVendorController,
};

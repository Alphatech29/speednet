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
  { name: "Kwame Mensah", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=KwameMensah" },
  { name: "Smart Network", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=SmartNetwork" },
  { name: "Adewale Johnson", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=AdewaleJohnson" },
  { name: "Digital Market", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=DigitalMarket" },
  { name: "PrimeSocial Hub", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=PrimeSocialHub" },
  { name: "Mamadou Diop", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=MamadouDiop" },
  { name: "Fusion Accounts", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=FusionAccounts" },
  { name: "Junior Nfor", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=JuniorNfor" },
  { name: "TrueAccount Supply", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=TrueAccountSupply" },
  { name: "Brian Mwangi", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=BrianMwangi" },
  { name: "NextWave Social", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=NextWaveSocial" },
  { name: "Chinedu Okafor", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=ChineduOkafor" },
  { name: "Legacy Socials", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=LegacySocials" },
  { name: "UrbanTrust", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=UrbanTrust" },
  { name: "Ibrahim Musa", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=IbrahimMusa" },
  { name: "Verified Path", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=VerifiedPath" },
  { name: "AllStock Socials", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=AllStockSocials" },
  { name: "Kofi Boateng", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=KofiBoateng" },
  { name: "Elite Market", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=EliteMarket" },
  { name: "Joseph Kato", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=JosephKato" },
  { name: "Universal Supply", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=UniversalSupply" },
  { name: "Authentic Vault", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=AuthenticVault" },
  { name: "Hassan Ally", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=HassanAlly" },
  { name: "RealEdge Social", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=RealEdgeSocial" },
  { name: "Wilfried Ndzi", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=WilfriedNdzi" },
  { name: "Human Provid", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=HumanProvid" },
  { name: "Nana Asare", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=NanaAsare" },
  { name: "TrustWave", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=TrustWave" },
  { name: "Armand", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=Armand" },
  { name: "Yao Kouassi", avatar: "https://api.dicebear.com/7.x/bottts/png?seed=YaoKouassi" }
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

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    const webSettings = await getWebSettings();
    const RUB_TO_USD = Number(webSettings?.usd_rub) || 0;

    const commissions = await getCategoryCommissions();
    const commissionLookup = {};
    commissions.forEach((c) => {
      commissionLookup[c.category_id] = Number(c.commission) || 0;
    });

    const productsWithCommission = await Promise.all(
      products.map(async (product) => {
        const price_rub = Number(product.price) || 0;
        const priceUSD = price_rub * RUB_TO_USD;
        const commissionPercent =
          commissionLookup[product.category_id] || 0;

        const priceWithCommissionUSD =
          priceUSD + (priceUSD * commissionPercent) / 100;

        const sellerInfo =
          (await getAutoAssignedSeller(product.id)) || {};

        return {
          ...product,
          price_rub,
          price: priceWithCommissionUSD.toFixed(2),
          seller: sellerInfo.name || "System",
          avatar: sellerInfo.avatar || "",
          instant_delivery: true,
          icon: INSTANT_DELIVERY_ICON || "",
        };
      })
    );

    /* 🔀 INLINE SHUFFLE (Fisher–Yates) */
    for (let i = productsWithCommission.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [
        productsWithCommission[i],
        productsWithCommission[j],
      ] = [
        productsWithCommission[j],
        productsWithCommission[i],
      ];
    }

    return res.status(200).json({
      success: true,
      data: productsWithCommission,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
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

// controllers/categoriesController.js
const { safeGet, safeSet } = require("../../../model/redis");
const {
  getCategoriesWithGroups,
  getProducts,
  autoFetchProducts,
} = require("../../../utility/daskshop");
const axios = require("axios");

const CACHE_KEY_CATEGORIES = "categories_with_groups";
const CACHE_TTL = 60 * 60 * 24; // 24 hours
const LANG_CACHE_PREFIX = "langcache:";

/* =========================
   LANGUAGE CACHE HELPERS
========================= */
async function getLangCache(key) {
  return safeGet(`${LANG_CACHE_PREFIX}${key}`);
}

async function setLangCache(key, value) {
  return safeSet(`${LANG_CACHE_PREFIX}${key}`, value, CACHE_TTL);
}

async function translateText(text) {
  const cached = await getLangCache(text);
  if (cached) return cached;

  try {
    const res = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: { client: "gtx", sl: "auto", tl: "en", dt: "t", q: text },
      }
    );

    const translated = res.data[0][0][0];
    await setLangCache(text, translated);
    return translated;
  } catch {
    return text;
  }
}

/* =========================
   CATEGORIES CONTROLLER
========================= */
async function getCategoriesController(req, res) {
  try {
    let categories = await safeGet(CACHE_KEY_CATEGORIES);

    if (!categories) {
      const response = await getCategoriesWithGroups();
      categories = response.data.items;

      for (const category of categories) {
        category.name = await translateText(category.name);
        for (const group of category.groups) {
          group.name = await translateText(group.name);
        }
      }

      await safeSet(CACHE_KEY_CATEGORIES, categories, CACHE_TTL);
    }

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
}

/* =========================
   PRODUCTS CONTROLLER
========================= */
async function getProductsController(req, res) {
  try {
    const filters = req.query || {};

    // Attempt to get products from Redis first
    const response = await getProducts(filters);

    return res.status(200).json({
      success: true,
      data: response.data.items,
      totalCount: response.data.totalCount,
      loading: response.data.loading,
      cached: true, // Always from cache
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    // Trigger background fetch in case of failure
    autoFetchProducts().catch(err => console.error("Background fetch failed:", err.message));

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}

module.exports = {
  getCategoriesController,
  getProductsController,
};

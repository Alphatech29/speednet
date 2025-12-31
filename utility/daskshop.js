const { getWebSettings } = require("./general.js");
const { safeGet, safeSet } = require("../model/redis");
const axios = require("axios");

/**
 * Manual translation mapping for edge cases
 */
const translations = {
  "Сервисы накрутки": "Boosting Services",
  "Сайты знакомств": "Dating Sites",
  "Одноклассники": "Classmates",
  "ВКонтакте": "VK",
  "РАЗНОЕ": "Miscellaneous",
  "Software (Программы)": "Software",
  "Форумы": "Forums",
  "Кинотеатры (Private)": "Cinemas (Private)",
  "Саморазвитие": "Self Development",
  "Почты": "Email Services",
  "Автореги": "Auto Registration",
  "Игры": "Games",
  "Сайты для взрослых": "Adult Sites",
  "Онлайн Кинотеатры": "Online Cinemas",
};

const patterns = [
  { regex: /^Ручная регистрация (.+)$/i, replace: "Manual Registration $1" },
  { regex: /^Авторег (.+)$/i, replace: "Auto Registration $1" },
  { regex: /^Раскрученные аккаунты (.+)$/i, replace: "Aged $1" },
  { regex: /^Разное (.+)$/i, replace: "$1 Miscellaneous" },
  { regex: /^Аккаунты (.+)$/i, replace: "$1 Accounts" },
  { regex: /^Старые \/ Возрастные аккаунты (.+)$/i, replace: "Aged $1 Accounts" },
  { regex: /^Подписка Nitro$/i, replace: "Nitro Subscription" },
  { regex: /^Самореги \(Ручная регистрация\)$/i, replace: "Self Registration (Manual)" },
  { regex: /^Услуги накрутки (.+)$/i, replace: "$1 Boosting Services" },
  { regex: /^Услуги рассылки (.+)$/i, replace: "$1 Messaging Services" },
  { regex: /^Услуги инвайтинга (.+)$/i, replace: "$1 Inviting Services" },
  { regex: /^Ретрив аккаунты (.+)$/i, replace: "Recovered $1 Accounts" },
  { regex: /^Аккаунты с БМ$/i, replace: "Accounts with Business Manager" },
  { regex: /^Аккаунты с часами$/i, replace: "Accounts with Hours" },
  { regex: /^Аккаунты со значками за выслугу лет$/i, replace: "Accounts with Badges" },
  { regex: /^С боями$/i, replace: "With Battles" },
  { regex: /^С балансами$/i, replace: "With Balances" },
];

function applyLocalTranslation(text) {
  if (!text) return text;
  if (translations[text]) return translations[text];
  for (const p of patterns) {
    if (p.regex.test(text)) return text.replace(p.regex, p.replace);
  }
  return null;
}

// ---------------- Batch Google Translate ----------------
async function googleTranslateBatch(texts) {
  if (!texts || texts.length === 0) return texts;

  // Apply local translations first
  const finalTexts = texts.map(t => applyLocalTranslation(t) || t);

  try {
    const q = finalTexts.join("\n"); // join texts for batch
    const res = await axios.get("https://translate.googleapis.com/translate_a/single", {
      params: { client: "gtx", sl: "auto", tl: "en", dt: "t", q },
    });

    // Map back each line
    return res.data[0].map(item => item[0]);
  } catch (err) {
    console.error("Translation error:", err.message);
    return finalTexts; // fallback to original texts
  }
}

// ---------------- Categories & Groups ----------------
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function fetchAllItems(endpoint, filters = {}) {
  const { dark_api_key, dark_base_url } = await getWebSettings();
  if (!dark_api_key || !dark_base_url) throw new Error("API configuration missing");

  const perPage = 100;
  let page = 1;
  let allItems = [];
  let totalCount = 0;

  do {
    const response = await fetchWithRetry(`${dark_base_url}/${endpoint}`, {
      params: { key: dark_api_key, page, "per-page": perPage, ...filters },
      headers: { Accept: "application/json" },
    });
    const items = response.data?.data?.items || [];
    totalCount = response.data?.data?._meta?.totalCount || 0;
    allItems.push(...items);
    page++;
  } while (allItems.length < totalCount);

  return allItems;
}

async function getCategories() {
  return fetchAllItems("category/list");
}

async function getGroups(filters = {}) {
  return fetchAllItems("group/list", filters);
}

async function translateCategories(categories) {
  const texts = [];
  categories.forEach(c => {
    texts.push(c.name);
    c.groups.forEach(g => texts.push(g.name));
  });

  const translated = await googleTranslateBatch(texts);
  let i = 0;

  return categories.map(c => ({
    ...c,
    name: translated[i++],
    groups: c.groups.map(g => ({ ...g, name: translated[i++] })),
  }));
}

async function getCategoriesWithGroups() {
  const [categories, groups] = await Promise.all([getCategories(), getGroups()]);

  const map = new Map();
  categories.forEach(c => map.set(c.id, { ...c, groups: [] }));
  groups.forEach(g => {
    const cat = map.get(g.category_id);
    if (cat) cat.groups.push(g);
  });

  const translated = await translateCategories([...map.values()]);
  return { success: true, data: { items: translated } };
}

// ---------------- Products with Redis & Translation ----------------
const PRODUCTS_CACHE_KEY = "products:all";
const PRODUCTS_LOCK_KEY = "products:fetch_lock";
const CACHE_TTL = 86400; // 24h
const LOCK_TTL = 10 * 60; // 10min
const PER_PAGE = 200;

async function translateProductFields(products) {
  const names = products.map(p => p.name || "");
  const descs = products.map(p => p.description || "");

  const [translatedNames, translatedDescs] = await Promise.all([
    googleTranslateBatch(names),
    googleTranslateBatch(descs)
  ]);

  return products.map((p, i) => ({
    ...p,
    name: translatedNames[i] || p.name,
    description: translatedDescs[i] || p.description
  }));
}

async function fetchProductsIncrementally(filters = {}) {
  const { dark_api_key, dark_base_url } = await getWebSettings();
  if (!dark_api_key || !dark_base_url) throw new Error("API configuration missing");

  const lock = await safeGet(PRODUCTS_LOCK_KEY);
  if (lock) {
    console.log("Fetch already running, skipping this cycle");
    return;
  }
  await safeSet(PRODUCTS_LOCK_KEY, "locked", LOCK_TTL);

  let allItems = [];

  try {
    // Fetch first page
    const firstRes = await axios.post(
      `${dark_base_url}/product/list`,
      { key: dark_api_key, page: 1, "per-page": PER_PAGE, ...filters },
      { headers: { Accept: "application/json", "Content-Type": "application/json" } }
    );

    allItems = (firstRes.data?.data?.items || []).map(p => {
      const { attributes, category, ...rest } = p;
      return rest;
    });

    // Translate products in bulk
    allItems = await translateProductFields(allItems);

    const meta = firstRes.data?.data?._meta || {};
    const pageCount = meta.pageCount || 1;

    console.log(`[${new Date().toISOString()}] Page 1 fetched: ${allItems.length} items`);
    await safeSet(PRODUCTS_CACHE_KEY, JSON.stringify({ items: allItems, totalCount: meta.totalCount }), CACHE_TTL);

    // Remaining pages
    for (let p = 2; p <= pageCount; p++) {
      let retries = 3;
      while (retries > 0) {
        try {
          const res = await axios.post(
            `${dark_base_url}/product/list`,
            { key: dark_api_key, page: p, "per-page": PER_PAGE, ...filters },
            { headers: { Accept: "application/json", "Content-Type": "application/json" } }
          );

          let newItems = (res.data?.data?.items || []).map(p => {
            const { attributes, ...rest } = p;
            return rest;
          });

          newItems = await translateProductFields(newItems);
          allItems.push(...newItems);

          await safeSet(PRODUCTS_CACHE_KEY, JSON.stringify({ items: allItems, totalCount: meta.totalCount }), CACHE_TTL);
          console.log(`[${new Date().toISOString()}] Page ${p} fetched: ${newItems.length} items, total cached: ${allItems.length}`);
          break;
        } catch (err) {
          retries--;
          console.error(`Page ${p} fetch failed, retries left: ${retries}. Error: ${err.message}`);
          if (retries > 0) await new Promise(r => setTimeout(r, 1000));
        }
      }
      await new Promise(r => setTimeout(r, 150));
    }

    console.log(`[${new Date().toISOString()}] Products auto-updated in Redis: total ${allItems.length} items`);
  } catch (err) {
    console.error("Auto-fetch failed:", err.message);
  } finally {
    await safeSet(PRODUCTS_LOCK_KEY, "", 1); // release lock
  }
}

// Auto-fetch every 24 hours
async function autoFetchProducts() {
  await fetchProductsIncrementally({ only_in_stock: 1 });
}

// Initial fetch
autoFetchProducts();
setInterval(autoFetchProducts, 24 * 60 * 60 * 1000);

// Get products from Redis
async function getProducts(filters = {}) {
  let cached = await safeGet(PRODUCTS_CACHE_KEY);
  if (!cached) {
    await fetchProductsIncrementally(filters);
    cached = await safeGet(PRODUCTS_CACHE_KEY);
  }

  let data = JSON.parse(cached);

  if (Object.keys(filters).length) {
    data.items = data.items.filter(item =>
      Object.entries(filters).every(([key, value]) => item[key] === value)
    );
    data.totalCount = data.items.length;
  }

  return { success: true, data };
}

module.exports = { getCategoriesWithGroups, getProducts, autoFetchProducts };

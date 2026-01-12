require('dotenv').config();
const axios = require("axios");
const { getWebSettings } = require("./general");
const { translateText } = require("./googleTranslate");
const pool = require("../model/db");
const { startjob } = require("../jobs/jobs");

console.log("Product job file loaded");

// ==============================
// CONFIG
// ==============================
const allowedGroupIds = [
  60, 64, 71, 99, 107, 153, 246, 250, 260,
  61, 65, 72, 97, 98, 190, 245, 312, 337,
  68, 101, 168, 243,
  80, 81, 102, 103, 224, 230,
  82, 84, 88, 135, 136, 155, 179, 185, 186, 202,
  117, 118, 119, 120, 122, 123, 162, 163, 164, 200, 201, 268, 280, 281, 287, 289, 316, 323, 341,
  62, 126, 129, 177, 219, 220, 253, 255, 262, 339, 340,
  76, 77, 106, 229, 311,
  73, 74, 104, 105, 154, 228, 231, 232, 233, 318, 325,
  69, 78, 79, 128, 196, 204, 205, 206, 207, 208, 209, 293, 294, 295, 297, 298, 299,
  144, 145, 211, 212, 213, 216, 256,
  150, 55, 59, 169, 180, 166, 167,
  174, 175, 238, 239,
  301, 303, 304, 306, 307, 314, 315, 317, 324,
  116, 121, 124, 244,
  165, 319, 320, 321, 322,
  326, 327, 328, 329, 330, 331, 332,
  333, 334, 335, 336,
];

// ==============================
// DB GROUP VALIDATION
// ==============================
async function getExistingGroupIds() {
  const [rows] = await pool.query("SELECT id FROM dark_shop_category_groups");
  return new Set(rows.map(r => r.id));
}

// ==============================
// FETCH PRODUCTS
// ==============================
async function getProducts(params = {}) {
  console.log("getProducts() called");

  try {
    const settings = await getWebSettings();
    const { dark_api_key, dark_base_url } = settings || {};

    if (!dark_api_key || !dark_base_url) {
      throw new Error("Dark API key or base URL is missing");
    }

    const url = `${dark_base_url.replace(/\/$/, "")}/product/list`;
    const perPage = 1000;
    let page = 1;
    let totalPages = 1;
    const allItems = [];

    do {
      console.log(`Fetching page ${page}`);

      const response = await axios.post(
        url,
        {
          key: dark_api_key,
          quantity_from: 1,
          price_from: 1.0,
          only_in_stock: 1,
          delivery_type: "auto",
          language: "en",
          ...params,
          "per-page": perPage,
          page,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      if (!data?.success) break;

      const items = Array.isArray(data.data?.items) ? data.data.items : [];

      const filtered = items
        .filter(item => allowedGroupIds.includes(item.group?.id))
        .map(({ attributes, purchase_counter, minimum_order, manual,
               replacement_terms_public, invalid_items_percent, ...rest }) => {
          const group = { ...rest.group };
          delete group.additional_category_id;
          return { ...rest, group };
        });

      allItems.push(...filtered);
      totalPages = data.data._meta?.pageCount || 1;
      page++;
    } while (page <= totalPages);

    console.log(`Total products fetched: ${allItems.length}`);
    return allItems;
  } catch (err) {
    console.error("Fetch failed:", err.message);
    return [];
  }
}

// ==============================
// TRANSLATE PRODUCTS (Russian -> English) with logging
// ==============================
async function translateProductsInChunks(products, chunkSize = 100) {
  const translatedProducts = [];

  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    console.log(`Translating chunk ${Math.floor(i / chunkSize) + 1} (products ${i + 1} to ${i + chunk.length})`);

    const texts = [];
    const mapIndex = [];

    chunk.forEach((p, idx) => {
      if (p.name) { texts.push(p.name); mapIndex.push({ idx, field: 'name' }); }
      if (p.description) { texts.push(p.description); mapIndex.push({ idx, field: 'description' }); }
    });

    if (!texts.length) {
      translatedProducts.push(...chunk);
      continue;
    }

    // Use fake request/response to reuse your translateText function
    const fakeReq = { body: { texts } };
    const fakeRes = { status: (code) => ({ json: (data) => data }) };

    const translationResponse = await translateText(fakeReq, fakeRes);
    const translations = Array.isArray(translationResponse.results)
      ? translationResponse.results
      : [translationResponse.results];

    // Only update Russian text (detectedLanguage === 'ru')
    translations.forEach((t, index) => {
      if (t.detectedLanguage === 'ru') {
        const { idx, field } = mapIndex[index];
        chunk[idx][field] = t.translated;
      }
    });

    translatedProducts.push(...chunk);
  }

  return translatedProducts;
}

// ==============================
// INSERT INTO DATABASE
// ==============================
async function insertProductsInChunks(products, chunkSize = 1000) {
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    if (!chunk.length) continue;

    const placeholders = chunk
      .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .join(",");

    const values = chunk.flatMap(p => [
      p.id,
      p.name,
      p.miniature,
      p.description,
      Number(p.price) || 0,
      p.quantity || 0,
      p.view || 0,
      p.group.id,
      p.category?.id || null,
      p.is_manual_order_delivery ? 1 : 0,
      p.url,
      p.guarantee_time_seconds ?? 0,
      p.rating ?? null,
    ]);

    await pool.query(
      `
      INSERT INTO dark_shop_products
      (id, name, miniature, description, price, quantity, view, group_id, category_id,
       is_manual_order_delivery, url, guarantee_time_seconds, rating)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        price = VALUES(price),
        quantity = VALUES(quantity),
        view = VALUES(view),
        rating = VALUES(rating)
      `,
      values
    );
  }

  console.log("Database insert complete");
}

// ==============================
// MAIN JOB
// ==============================
let isRunning = false;

async function productJob() {
  if (isRunning) {
    console.log("Product job already running, skipping");
    return;
  }

  isRunning = true;

  try {
    console.log("Product job started");

    let products = await getProducts();
    if (!products.length) return;

    const existingGroupIds = await getExistingGroupIds();
    products = products.filter(p => existingGroupIds.has(p.group?.id));

    products = await translateProductsInChunks(products, 100);

    if (products.length) {
      await insertProductsInChunks(products);
    }

    console.log(`Inserted ${products.length} / ${products.length} products`);
  } catch (err) {
    console.error("Product job error:", err);
  } finally {
    isRunning = false;
  }
}

// ==============================
// IMMEDIATE EXECUTION
// ==============================
//(async () => {
 // try {
  //  await productJob();
 // } catch (err) {
 //   console.error("Startup job failed:", err);
//  }
//})();

// ==============================
// CRON — DAILY
// ==============================
//startjob(
  //async () => {
    //await productJob();
  //},
  //"3 0 * * *",
 // "Africa/Lagos"
//);

console.log("⏱️ Product job scheduled to run daily at 12:03 AM (WAT)");

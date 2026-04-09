const { getDarkshopOrderStatus } = require("./daskshopCreateOrder");
const {
  getAllPendingDarkShopOrders,
  updateDarkShopOrderContent,
} = require("./darkshopProduct");
const { translateRussianToEnglish } = require("./contentTranslate");

// Track order IDs currently being watched to avoid duplicate workers
const watchingIds = new Set();

const POLL_INTERVAL_MS   = 3000;
const MAX_ATTEMPTS       = 100;
const RESCAN_INTERVAL_MS = 60000;

async function processOneOrder(order) {
  const id = order.darkshop_order_id;
  if (watchingIds.has(id)) return;
  watchingIds.add(id);

  console.log(`[DarkshopWorker] Watching order ${id} (order_no: ${order.order_no})`);

  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;

    try {
      const statusRes = await getDarkshopOrderStatus(id);

      if (!statusRes.success) {
        await sleep(POLL_INTERVAL_MS);
        continue;
      }

      const status = statusRes.status;

      // ── COMPLETED ──────────────────────────────────────────
      if (status === "completed") {
        let translated = null;
        if (statusRes.content) {
          try {
            translated = await translateRussianToEnglish(statusRes.content);
          } catch {
            translated = statusRes.content;
          }
        }

        await updateDarkShopOrderContent({
          darkshop_order_id: id,
          darkshop_link:     statusRes.link || null,
          darkshop_content:  translated || null,
          payment_status:    "Completed",
        });

        console.log(`[DarkshopWorker] Order ${id} → Completed`);
        watchingIds.delete(id);
        return;
      }

      // ── TERMINAL FAILURE STATUSES ──────────────────────────
      // canceled, error, refund — stop polling, mark Failed
      if (status === "canceled" || status === "error" || status === "refund") {
        await updateDarkShopOrderContent({
          darkshop_order_id: id,
          darkshop_link:     null,
          darkshop_content:  null,
          payment_status:    "Failed",
        });

        console.log(`[DarkshopWorker] Order ${id} → ${status} (marked Failed)`);
        watchingIds.delete(id);
        return;
      }

      // ── in_process / unpaid — keep polling ─────────────────
      await sleep(POLL_INTERVAL_MS);

    } catch (err) {
      console.error(`[DarkshopWorker] Error polling order ${id}:`, err.message);
      await sleep(POLL_INTERVAL_MS);
    }
  }

  // Timed out — mark Failed
  console.warn(`[DarkshopWorker] Order ${id} timed out after ${MAX_ATTEMPTS} attempts — marking Failed`);

  await updateDarkShopOrderContent({
    darkshop_order_id: id,
    darkshop_link:     null,
    darkshop_content:  null,
    payment_status:    "Failed",
  });

  watchingIds.delete(id);
}

// Enqueue orders from the in-request response (called immediately after purchase)
function processPendingDarkOrders(darkProductsResponse) {
  const pending = darkProductsResponse.filter(
    (p) => String(p.payment_status).toLowerCase() === "in_process"
  );

  for (const p of pending) {
    processOneOrder({
      darkshop_order_id: p.darkshop_order_id,
      order_no:          p.order_no || p.darkshop_order_id,
      buyer_id:          p.buyer_id || null,
      price:             p.price || 0,
    });
  }
}

// Background rescan — picks up orders that survived a server restart
async function rescanPendingOrders() {
  try {
    const rows = await getAllPendingDarkShopOrders();
    if (rows.length > 0) {
      console.log(`[DarkshopWorker] Rescan found ${rows.length} pending order(s)`);
      for (const row of rows) {
        processOneOrder(row); 
      }
    }
  } catch (err) {
    console.error("[DarkshopWorker] Rescan error:", err.message);
  }
}

function startDarkshopWorker() {
  // Initial rescan immediately on startup
  rescanPendingOrders();
  // Then re-scan periodically
  setInterval(rescanPendingOrders, RESCAN_INTERVAL_MS);
  console.log("[DarkshopWorker] Persistent pending-order worker started");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = { processPendingDarkOrders, startDarkshopWorker };

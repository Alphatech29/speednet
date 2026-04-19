const { getDarkshopOrderStatus } = require("./daskshopCreateOrder");
const {
  getAllPendingDarkShopOrders,
  getMissingContentDarkShopOrders,
  updateDarkShopOrderContent,
} = require("./darkshopProduct");
const { translateRussianToEnglish } = require("./contentTranslate");
const monitor = require("./monitor");

// ── config ────────────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS   = 4000;   // 4s between status checks
const MAX_ATTEMPTS       = 75;     // ~5 min per order before giving up this run
const RESCAN_INTERVAL_MS = 90000;  // re-scan DB for pending orders every 90s
const BACKFILL_DELAY_MS  = 15000;  // wait 15s after startup before first backfill
const BACKFILL_EVERY_MS  = 15 * 60 * 1000; // then every 15 min
const REQUEST_GAP_MS     = 1200;   // gap between backfill requests (rate-limit safety)

// ── dedup guard ───────────────────────────────────────────────────────────────
// Tracks darkshop_order_ids currently being polled so we never run two loops
// for the same order simultaneously.
const watchingIds = new Set();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── translate helper (never throws, never returns null) ───────────────────────
async function safeTranslate(content) {
  if (!content) return content;
  try {
    return (await translateRussianToEnglish(content)) || content;
  } catch {
    return content;
  }
}

// ── save completed order (never throws) ──────────────────────────────────────
async function saveCompleted(id, link, content) {
  const translated = await safeTranslate(content);
  try {
    await updateDarkShopOrderContent({
      darkshop_order_id: id,
      darkshop_link:     link    || null,
      darkshop_content:  translated || null,
      payment_status:    "Completed",
    });
    monitor.success(`Darkshop order completed`, { darkshopOrderId: id });
    console.log(`[DarkshopWorker] ✓ Order ${id} → Completed`);
  } catch (err) {
    console.error(`[DarkshopWorker] DB write failed for order ${id}:`, err.message);
  }
}

// ── save terminal-failure order (never throws) ────────────────────────────────
async function saveFailed(id, status) {
  try {
    await updateDarkShopOrderContent({
      darkshop_order_id: id,
      darkshop_link:     null,
      darkshop_content:  null,
      payment_status:    "Failed",
    });
    monitor.error(`Darkshop order failed`, { darkshopOrderId: id, status });
    console.log(`[DarkshopWorker] ✗ Order ${id} → ${status} (marked Failed)`);
  } catch (err) {
    console.error(`[DarkshopWorker] DB write failed for order ${id}:`, err.message);
  }
}

// ── core polling loop ─────────────────────────────────────────────────────────
async function processOneOrder(order) {
  const id = order.darkshop_order_id;
  if (!id) return;
  if (watchingIds.has(id)) return; // already being watched
  watchingIds.add(id);

  console.log(`[DarkshopWorker] Watching order ${id} (order_no: ${order.order_no})`);

  let attempts    = 0;
  let errorStreak = 0;

  try {
    while (attempts < MAX_ATTEMPTS) {
      attempts++;

      let statusRes;
      try {
        statusRes = await getDarkshopOrderStatus(id);
        errorStreak = 0; // reset on success
      } catch (err) {
        errorStreak++;
        console.error(`[DarkshopWorker] API error for order ${id} (streak ${errorStreak}):`, err.message);
        // exponential backoff: 4s, 8s, 16s … capped at 60s
        await sleep(Math.min(POLL_INTERVAL_MS * Math.pow(2, errorStreak - 1), 60000));
        continue;
      }

      if (!statusRes.success) {
        await sleep(POLL_INTERVAL_MS);
        continue;
      }

      const status = statusRes.status;

      if (status === "completed") {
        await saveCompleted(id, statusRes.link, statusRes.content);
        return;
      }

      if (status === "canceled" || status === "error" || status === "refund") {
        await saveFailed(id, status);
        return;
      }

      // in_process / unpaid — keep polling
      await sleep(POLL_INTERVAL_MS);
    }

    // Exhausted attempts — do NOT mark Failed; leave as Pending so
    // the next rescan picks it back up and tries again.
    console.warn(`[DarkshopWorker] Order ${id} exhausted ${MAX_ATTEMPTS} attempts — releasing watch (still Pending)`);

  } finally {
    // Always release the lock so future rescans can retry
    watchingIds.delete(id);
  }
}

// ── enqueue from purchase response ───────────────────────────────────────────
function processPendingDarkOrders(darkProductsResponse) {
  const inProcess = darkProductsResponse.filter(
    (p) => String(p.payment_status).toLowerCase() === "in_process"
  );

  for (const p of inProcess) {
    processOneOrder({
      darkshop_order_id: p.darkshop_order_id,
      order_no:          p.order_no || p.darkshop_order_id,
      buyer_id:          p.buyer_id || null,
    });
  }
}

// ── rescan DB for any Pending orders (startup + periodic) ─────────────────────
async function rescanPendingOrders() {
  try {
    const rows = await getAllPendingDarkShopOrders();
    if (rows.length === 0) return;
    console.log(`[DarkshopWorker] Rescan: ${rows.length} pending order(s) found`);
    for (const row of rows) {
      processOneOrder(row); // no-op if already watched
    }
  } catch (err) {
    console.error("[DarkshopWorker] Rescan error:", err.message);
  }
}

// ── backfill completed orders missing link/content ────────────────────────────
async function backfillMissingContent() {
  let rows;
  try {
    rows = await getMissingContentDarkShopOrders();
  } catch (err) {
    console.error("[DarkshopWorker] Backfill scan error:", err.message);
    return;
  }

  if (rows.length === 0) return;
  console.log(`[DarkshopWorker] Backfill: ${rows.length} order(s) missing content`);

  for (const order of rows) {
    // Skip if it's currently being watched by the pending poller
    if (watchingIds.has(order.darkshop_order_id)) continue;

    try {
      const statusRes = await getDarkshopOrderStatus(order.darkshop_order_id);

      if (!statusRes.success) continue;

      if (statusRes.status === "completed") {
        // Only update if we actually got something new
        if (statusRes.link || statusRes.content) {
          await saveCompleted(order.darkshop_order_id, statusRes.link, statusRes.content);
        }
        continue;
      }

      // If external API says it failed/canceled but DB still shows Pending, fix it
      if (
        statusRes.status === "canceled" ||
        statusRes.status === "error"    ||
        statusRes.status === "refund"
      ) {
        await saveFailed(order.darkshop_order_id, statusRes.status);
        continue;
      }

      // Still in_process — hand off to the pending watcher
      if (statusRes.status === "in_process") {
        processOneOrder(order);
      }

    } catch (err) {
      console.error(`[DarkshopWorker] Backfill error for order ${order.darkshop_order_id}:`, err.message);
    }

    await sleep(REQUEST_GAP_MS); // avoid hammering the API
  }
}

// ── startup ───────────────────────────────────────────────────────────────────
function startDarkshopWorker() {
  // Pending poller: immediate scan + every 90s
  rescanPendingOrders();
  setInterval(rescanPendingOrders, RESCAN_INTERVAL_MS);

  // Backfill: delayed start (15s) so DB is ready, then every 15 min
  setTimeout(() => {
    backfillMissingContent();
    setInterval(backfillMissingContent, BACKFILL_EVERY_MS);
  }, BACKFILL_DELAY_MS);

  console.log("[DarkshopWorker] Started — pending watcher + backfill active");
}

module.exports = { processPendingDarkOrders, startDarkshopWorker };

const { getDarkshopOrderStatus } = require("./daskshopCreateOrder");
const { updateDarkShopOrderContent } = require("./darkshopProduct");
const { translateRussianToEnglish } = require("./contentTranslate");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function processPendingDarkOrders(darkProductsResponse) {
  try {

    const pending = darkProductsResponse.filter(
      p => String(p.payment_status).toLowerCase() === "pending"
    );

    if (pending.length === 0) return;

    console.log(`Checking ${pending.length} pending darkshop orders...`);

    for (const order of pending) {

      let attempts = 60; // Check for up to 2 minutes (60 attempts with 2s delay)

      while (attempts-- > 0) {

        const statusRes = await getDarkshopOrderStatus(order.darkshop_order_id);

        if (!statusRes.success) {
          await sleep(2000);
          continue;
        }

        // ================= COMPLETED =================
        if (statusRes.status === "completed") {

          let translated = null;

          if (statusRes.content) {
            try {
              translated = await translateRussianToEnglish(statusRes.content);
            } catch {
              translated = statusRes.content;
            }
          }

          await updateDarkShopOrderContent({
            darkshop_order_id: order.darkshop_order_id,
            darkshop_link: statusRes.link || null,
            darkshop_content: translated || null,
            payment_status: "Completed"
          });

          console.log(`Darkshop order ${order.darkshop_order_id} completed`);
          break;
        }

        // ================= FAILED =================
        if (statusRes.status === "failed") {

          await updateDarkShopOrderContent({
            darkshop_order_id: order.darkshop_order_id,
            darkshop_link: null,
            darkshop_content: null,
            payment_status: "Failed"
          });

          console.log(`Darkshop order ${order.darkshop_order_id} failed`);
          break;
        }

        // still pending
        await sleep(2000);
      }
    }

  } catch (err) {
    console.error("Pending darkshop processor error:", err.message);
  }
}

module.exports = { processPendingDarkOrders };
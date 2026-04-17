// escrowWorker.js — background worker that releases expired escrow orders
// Runs on startup and every 5 minutes.
// Guards against double-release with the queue via claimEscrowRelease (atomic SQL UPDATE).

const { getExpiredUnreleasedEscrowOrders, claimEscrowRelease } = require('./accountOrder');
const { getWebSettings } = require('./general');
const { getUserDetailsByUid, updateUser } = require('./userInfo');
const { storeMerchantTransaction } = require('./merchantHistory');
const { generateUniqueRandomNumber } = require('./random');
const logger = require('./logger');

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const releaseOne = async (order, commission) => {
  const { order_no, seller_id, product_id, price: amount } = order;

  const user = await getUserDetailsByUid(seller_id);
  if (!user) {
    logger.warn(`[EscrowWorker] Seller ${seller_id} not found — order ${order_no} marked released to prevent retry`);
    return;
  }

  const commissionAmt = Number(amount) * commission;
  const finalAmount = Number(amount) - commissionAmt;

  const updated = await updateUser(seller_id, {
    escrow_balance: Math.max(Number(user.escrow_balance || 0) - Number(amount), 0),
    merchant_balance: Number(user.merchant_balance || 0) + finalAmount,
  });

  if (!updated?.success) {
    throw new Error(`Balance update failed for seller ${seller_id}`);
  }

  const transactionId = generateUniqueRandomNumber();

  await storeMerchantTransaction({
    seller_id,
    transaction_id: transactionId,
    transaction_type: 'Commission Deduction',
    amount: commissionAmt.toFixed(2),
    status: 'system',
    product_id,
  });

  await storeMerchantTransaction({
    seller_id,
    transaction_id: transactionId,
    transaction_type: 'From Escrow to Merchant Wallet',
    amount: finalAmount.toFixed(2),
    status: 'credited',
    product_id,
  });

  logger.info(`[EscrowWorker] Released order ${order_no} — ₦${finalAmount.toFixed(2)} credited to seller ${seller_id}`);
};

const runEscrowWorker = async () => {
  try {
    const orders = await getExpiredUnreleasedEscrowOrders();
    if (!orders.length) return;

    logger.info(`[EscrowWorker] ${orders.length} expired escrow order(s) found`);

    const settings = await getWebSettings();
    const commission = Number(settings?.commission || 0) / 100;

    for (const order of orders) {
      // Atomic claim — only one process (worker or queue job) wins this UPDATE
      const claimed = await claimEscrowRelease(order.order_no);
      if (!claimed) {
        logger.info(`[EscrowWorker] Order ${order.order_no} already claimed by queue — skipping`);
        continue;
      }

      await releaseOne(order, commission).catch((err) => {
        logger.error(`[EscrowWorker] Failed to release order ${order.order_no}: ${err.message}`);
      });
    }
  } catch (err) {
    logger.error(`[EscrowWorker] Unexpected error: ${err.message}`);
  }
};

const startEscrowWorker = () => {
  runEscrowWorker();
  setInterval(runEscrowWorker, INTERVAL_MS);
  logger.info('[EscrowWorker] Started — checks every 5 minutes');
};

module.exports = { startEscrowWorker };

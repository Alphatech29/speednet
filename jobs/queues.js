// redis/queues.js
const BeeQueue = require('bee-queue');
const logger = require('../utility/logger');

// Create queue instance
const queue = new BeeQueue('escrow_release', {
  redis: {
    url: 'redis://default:6T16NjlnyI3IMvGbsAFhNvcyWC6FXwWd@redis-16570.c89.us-east-1-3.ec2.redns.redis-cloud.com:16570',
  },
  isWorker: process.env.WORKER === 'true',
  removeOnSuccess: true,
  removeOnFailure: false,
});

// Optional: extra logging
queue.on('ready', () => {
  console.log('[QUEUE] Escrow worker is connected and ready.');
});

queue.on('job succeeded', (job, result) => {
  console.log(`[QUEUE] Job ${job.id} for order ${job.data.order_no} succeeded.`);
});

queue.on('job failed', (job, err) => {
  console.error(`[QUEUE] Job ${job.id} for order ${job.data.order_no} failed: ${err.message}`);
});

queue.on('error', (err) => {
  console.error('[QUEUE] Worker connection error:', err.message);
});

// Worker logic (only when WORKER=true)
if (queue.settings.isWorker) {
  const {
    getUserDetailsByUid,
    updateUser,
  } = require('../utility/userInfo');

  const {
    updateTransactionStatus,
    storeMerchantTransaction,
  } = require('../utility/merchantHistory');

  queue.process(async (job) => {
    const {
      seller_id,
      product_id,
      transactionId,
      amount,
      commission,
      order_no,
    } = job.data;

    console.log(`\n[RELEASE] Starting escrow release for order ${order_no}`);

    try {
      console.log(`[ORDER ${order_no}] Fetching seller details...`);
      const user = await getUserDetailsByUid(seller_id);
      if (!user) {
        logger.error(`[ORDER ${order_no}] Seller not found: ${seller_id}`);
        return;
      }

      const escrowBalance = Number(user.escrow_balance || 0);
      const merchantBalance = Number(user.merchant_balance || 0);
      const commissionAmount = Number(amount) * commission;
      const finalAmount = Number(amount) - commissionAmount;

      console.log(`[ORDER ${order_no}] Updating balances...`);
      const update = await updateUser(seller_id, {
        escrow_balance: escrowBalance - Number(amount),
        merchant_balance: merchantBalance + finalAmount,
      });

      if (!update?.success) {
        logger.error(`[ORDER ${order_no}] Balance update failed`);
        return;
      }

      console.log(`[ORDER ${order_no}] Marking transaction as completed...`);
      await updateTransactionStatus(transactionId, 'completed');

      console.log(`[ORDER ${order_no}] Logging commission deduction...`);
      await storeMerchantTransaction({
        seller_id,
        transaction_id: transactionId,
        transaction_type: 'Commission Deduction',
        amount: commissionAmount.toFixed(2),
        status: 'system',
        product_id,
      });

      console.log(`[ORDER ${order_no}] Logging merchant credit...`);
      await storeMerchantTransaction({
        seller_id,
        transaction_id: transactionId,
        transaction_type: 'From Escrow to Merchant Wallet',
        amount: finalAmount.toFixed(2),
        status: 'credited',
        product_id,
      });

      console.log(`[ORDER ${order_no}] Escrow released successfully.`);

    } catch (err) {
      logger.error(`[ORDER ${order_no}] Worker error: ${err.message}`);
    }
  });
}

// Always export queue instance for producer use
module.exports = queue;

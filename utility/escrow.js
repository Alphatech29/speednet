const moment = require('moment-timezone');
const JobQueue = require('../jobs/jobQueues');
const { getWebSettings } = require('./general');
const { getUserDetailsByUid, updateUser } = require('./userInfo');
const {
  storeMerchantTransaction,
  updateTransactionStatus,
} = require('./merchantHistory');
const { generateUniqueRandomNumber } = require('./random');
const { getEscrowExpiryByOrderNo } = require('./accountOrder');
const logger = require('./logger');

const TIMEZONE = 'Africa/Lagos';

// Setup Job Queue
const queue = new JobQueue({
  concurrency: 3,
  persistencePath: './queue-data-escrow.json',
});

// Job Processor
queue.process(async (jobData) => {
  try {
    logger.info(`[QUEUE START] Processing order ${jobData.order_no}`);

    const {
      seller_id,
      product_id,
      transactionId,
      amount,
      order_no,
      commission,
    } = jobData;

    const user = await getUserDetailsByUid(seller_id);
    if (!user) throw new Error(`Seller not found for ID ${seller_id}`);

    let escrowBal = Number(user.escrow_balance || 0);
    let merchantBal = Number(user.merchant_balance || 0);
    const commissionAmt = Number(amount) * commission;
    const finalAmount = Number(amount) - commissionAmt;

    escrowBal -= Number(amount);
    merchantBal += finalAmount;

    const updated = await updateUser(seller_id, {
      escrow_balance: Math.max(escrowBal, 0),
      merchant_balance: merchantBal,
    });

    if (!updated?.success) {
      throw new Error(`Failed to update balances for seller ${seller_id}`);
    }

    await updateTransactionStatus(transactionId, 'completed');

    // First: Log commission deduction
    await storeMerchantTransaction({
      seller_id,
      transaction_id: transactionId,
      transaction_type: 'Commission Deduction',
      amount: commissionAmt.toFixed(2),
      status: 'system',
      product_id,
    });

    // Then: Log credit to merchant wallet
    await storeMerchantTransaction({
      seller_id,
      transaction_id: transactionId,
      transaction_type: 'From Escrow to Merchant Wallet',
      amount: finalAmount.toFixed(2),
      status: 'credited',
      product_id,
    });

    const now = moment.tz(TIMEZONE);
    logger.info(`[QUEUE TIME] Order ${order_no} processed at: ${now.format('YYYY-MM-DD HH:mm:ss')} WAT / UTC: ${now.toISOString()}`);
    logger.info(`[RELEASED] Order ${order_no} processed. Final: ₦${finalAmount.toFixed(2)}, Commission: ₦${commissionAmt.toFixed(2)}`);
    logger.info(`[QUEUE END] Order ${order_no} completed`);
  } catch (error) {
    console.error(`[QUEUE ERROR] Failed to process order ${jobData?.order_no}:`, error);
    logger.error(`[QUEUE ERROR] Failed to process order ${jobData?.order_no}`, {
      message: error.message,
      stack: error.stack,
      data: jobData,
    });
    throw error;
  }
});

// Credit Escrow Function
const creditEscrow = async (escrowData) => {
  const settings = await getWebSettings();
  const commission = Number(settings?.commission || 0) / 100;
  const processedTransactions = [];

  for (const entry of escrowData) {
    const { seller_id, amount, order_no, product_id } = entry;

    const user = await getUserDetailsByUid(seller_id);
    if (!user) {
      console.warn(`[ESCROW SKIPPED] Seller ${seller_id} not found`);
      continue;
    }

    const expiryStr = await getEscrowExpiryByOrderNo(order_no);
    if (!expiryStr) {
      console.warn(`[ESCROW SKIPPED] Expiry not found for order ${order_no}`);
      continue;
    }

    const expiresAt = moment.tz(expiryStr, 'YYYY-MM-DD HH:mm:ss', TIMEZONE);
    const now = moment.tz(TIMEZONE);
    const delay = expiresAt.diff(now);

    if (delay <= 0) {
      console.warn(`[ESCROW WARNING] Order ${order_no} expired too long ago. Skipping.`);
      continue;
    }

    const transactionId = generateUniqueRandomNumber();
    const newBalance = Number(user.escrow_balance || 0) + Number(amount);

    const escrowUpdate = await updateUser(seller_id, {
      escrow_balance: newBalance,
    });

    if (!escrowUpdate?.success) {
      console.warn(`[ESCROW SKIPPED] Balance update failed for ${seller_id}`);
      continue;
    }

    await storeMerchantTransaction({
      seller_id,
      transaction_id: transactionId,
      transaction_type: 'To Escrow Wallet',
      amount: Number(amount).toFixed(2),
      status: 'pending',
      product_id,
    });

    await queue.add(
      {
        seller_id,
        transactionId,
        amount,
        order_no,
        commission,
        product_id,
      },
      {
        delayUntil: expiresAt.toDate(),
        retries: 3,
        priority: 1,
      }
    );

    processedTransactions.push({
      seller_id,
      transactionId,
      amount: Number(amount).toFixed(2),
      escrow_expires_at: expiryStr,
    });
  }

  return processedTransactions;
};

module.exports = { creditEscrow };

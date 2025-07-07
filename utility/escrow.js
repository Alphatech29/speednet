const { getWebSettings } = require("./general");
const { getUserDetailsByUid, updateUser } = require("./userInfo");
const { storeMerchantTransaction, updateTransactionStatus } = require("./merchantHistory");
const { generateUniqueRandomNumber } = require("./random");
const { getEscrowExpiryByOrderNo } = require("./accountOrder");
const logger = require('../utility/logger');

/**
 * Convert "YYYY-MM-DD HH:mm:ss" datetime string into a UTC JS Date.
 * Assumes the datetime is already in UTC.
 */
const parseWATDatetime = (datetimeInput) => {
  if (typeof datetimeInput !== 'string') {
    throw new Error(`Expected datetime string in 'YYYY-MM-DD HH:mm:ss' format, got: ${typeof datetimeInput}`);
  }

  const datetimeStr = datetimeInput.trim();
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!dateTimeRegex.test(datetimeStr)) {
    throw new Error(`Invalid datetime format: ${datetimeStr}`);
  }

  const [datePart, timePart] = datetimeStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  // Assuming the time is already in UTC (no WAT offset subtraction)
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  if (isNaN(utcDate.getTime())) {
    throw new Error(`Parsed invalid date from input: ${datetimeStr}`);
  }

  return utcDate;
};

const creditEscrow = async (escrowData) => {
  try {
    if (!Array.isArray(escrowData) || escrowData.length === 0) {
      logger.error("Escrow data must be a non-empty array.");
      throw new Error("Escrow data must be a non-empty array.");
    }

    const settings = await getWebSettings();
    const commission = Number(settings?.commission || 0) / 100;
    const processedTransactions = [];

    for (const entry of escrowData) {
      const { seller_id, buyer_id, amount, order_no, product_id } = entry;

      if (!seller_id || isNaN(amount) || !order_no) {
        logger.warn(`Skipping invalid escrow entry: ${JSON.stringify(entry)}`);
        continue;
      }

      try {
        const userDetails = await getUserDetailsByUid(seller_id);
        if (!userDetails) {
          logger.error(`Seller ${seller_id} not found.`);
          continue;
        }

        // Get escrow expiry date
        const escrowExpiresAt = await getEscrowExpiryByOrderNo(order_no);
        console.log('Date received from getEscrowExpiryByOrderNo:', escrowExpiresAt);

        if (!escrowExpiresAt) {
          logger.error(`No escrow expiry date found for order ${order_no}`);
          continue;
        }

        const expiresAt = parseWATDatetime(escrowExpiresAt);
        const now = new Date();
        const delay = expiresAt.getTime() - now.getTime();

        console.log(`Order ${order_no} expires at: ${expiresAt.toISOString()}`);
        console.log(`Current UTC time: ${now.toISOString()}`);
        console.log(`Delay until release: ${delay}ms`);

        let currentEscrowBalance = isNaN(userDetails.escrow_balance)
          ? 0
          : Number(userDetails.escrow_balance);

        const transactionId = generateUniqueRandomNumber();
        currentEscrowBalance += Number(amount);

        const escrowUpdate = await updateUser(seller_id, { escrow_balance: currentEscrowBalance });
        if (!escrowUpdate || !escrowUpdate.success) {
          logger.error(`Failed to update escrow balance for seller ${seller_id}.`);
          continue;
        }

        await storeMerchantTransaction({
          seller_id,
          transaction_id: transactionId,
          transaction_type: "To Escrow Wallet",
          amount: Number(amount).toFixed(2),
          status: "pending",
          product_id,
        });

        processedTransactions.push({
          seller_id,
          buyer_id,
          product_id,
          transactionId,
          amount: Number(amount).toFixed(2),
          escrow_expires_at: escrowExpiresAt,
        });

        const processRelease = async () => {
          try {
            const updatedUser = await getUserDetailsByUid(seller_id);
            let updatedEscrow = isNaN(updatedUser.escrow_balance) ? 0 : Number(updatedUser.escrow_balance);
            let updatedMerchant = isNaN(updatedUser.merchant_balance) ? 0 : Number(updatedUser.merchant_balance);

            const commissionAmount = Number(amount) * commission;
            const finalAmount = Number(amount) - commissionAmount;

            updatedEscrow -= Number(amount);
            if (updatedEscrow < 0) updatedEscrow = 0;
            updatedMerchant += finalAmount;

            const updateFinal = await updateUser(seller_id, {
              escrow_balance: updatedEscrow,
              merchant_balance: updatedMerchant,
            });

            if (updateFinal?.success) {
              await updateTransactionStatus(transactionId, "completed");

              await storeMerchantTransaction({
                seller_id,
                transaction_id: transactionId,
                transaction_type: "Commission Deduction",
                amount: commissionAmount.toFixed(2),
                status: "system",
                product_id,
              });

              setTimeout(async () => {
                await storeMerchantTransaction({
                  seller_id,
                  transaction_id: transactionId,
                  transaction_type: "From Escrow to Merchant Wallet",
                  amount: finalAmount.toFixed(2),
                  status: "credited",
                  product_id,
                });

                console.log(`[RELEASED] Order ${order_no}: ₦${finalAmount.toFixed(2)} released to merchant (Commission: ₦${commissionAmount.toFixed(2)})`);
                logger.info(`[RELEASED] Order ${order_no} processed. Final: ₦${finalAmount.toFixed(2)}, Commission: ₦${commissionAmount.toFixed(2)}`);
              }, 1000);
            } else {
              logger.error(`Failed to finalize transaction ${transactionId} for seller ${seller_id}.`);
            }
          } catch (error) {
            logger.error(`Error processing merchant transfer for order ${order_no}: ${error.message}`);
          }
        };

        if (delay > 0) {
          logger.info(`Scheduling transfer for order ${order_no} after ${delay}ms`);
          setTimeout(processRelease, delay);
        } else {
          logger.warn(`Escrow already expired for order ${order_no}. Processing immediately.`);
          processRelease();
        }

      } catch (error) {
        logger.error(`Error processing escrow for order ${order_no}: ${error.message}`);
      }
    }

    if (processedTransactions.length === 0) {
      logger.warn("Escrow batch completed with 0 valid transactions.");
      return [];
    }

    return processedTransactions;

  } catch (error) {
    logger.error("Failed to process escrow batch:", error.message);
    throw error;
  }
};

module.exports = { creditEscrow };

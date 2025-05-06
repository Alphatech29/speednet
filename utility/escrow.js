const { getWebSettings } = require("./general");
const { getUserDetailsByUid, updateUser } = require("./userInfo");
const { storeMerchantTransaction, updateTransactionStatus } = require("./merchantHistory");
const { generateUniqueRandomNumber } = require("./random");
const logger = require('../utility/logger');

const creditEscrow = async (escrowData) => {
  try {
      if (!Array.isArray(escrowData) || escrowData.length === 0) {
          logger.error("Escrow data must be a non-empty array.");
          throw new Error("Escrow data must be a non-empty array.");
      }

      const settings = await getWebSettings();
      const commission = settings?.commission / 100;

      const sellerTransactions = escrowData.reduce((acc, { seller_id, amount }) => {
          if (!seller_id || isNaN(amount)) return acc;
          acc[seller_id] = (acc[seller_id] || 0) + parseFloat(amount);
          return acc;
      }, {});

      let processedTransactions = [];

      for (const [seller_id, totalAmount] of Object.entries(sellerTransactions)) {
          try {
              const userDetails = await getUserDetailsByUid(seller_id);
              if (!userDetails) {
                  logger.error(`Seller ${seller_id} not found.`);
                  continue;
              }

              let currentEscrowBalance = isNaN(userDetails.escrow_balance) ? 0 : Number(userDetails.escrow_balance);
              const transactionId = generateUniqueRandomNumber();

              currentEscrowBalance += totalAmount;
              const escrowUpdate = await updateUser(seller_id, { escrow_balance: currentEscrowBalance });

              if (!escrowUpdate || !escrowUpdate.success) {
                  logger.error(`Failed to update escrow balance for seller ${seller_id}.`);
                  continue;
              }

              await storeMerchantTransaction({
                  seller_id,
                  transaction_id: transactionId,
                  transaction_type: "To Escrow Wallet",
                  amount: totalAmount.toFixed(2),
                  status: "pending",
              });

              processedTransactions.push({
                  seller_id,
                  totalAmount: totalAmount.toFixed(2),
                  newEscrowBalance: currentEscrowBalance.toFixed(2),
                  transactionId,
              });

              setTimeout(async () => {
                  try {
                      const updatedUserDetails = await getUserDetailsByUid(seller_id);
                      let updatedEscrowBalance = isNaN(updatedUserDetails.escrow_balance) ? 0 : Number(updatedUserDetails.escrow_balance);
                      let updatedMerchantBalance = isNaN(updatedUserDetails.merchant_balance) ? 0 : Number(updatedUserDetails.merchant_balance);

                      const commissionAmount = totalAmount * commission;
                      const finalAmount = totalAmount - commissionAmount;

                      updatedEscrowBalance -= totalAmount;
                      updatedMerchantBalance += finalAmount;
                      if (updatedEscrowBalance < 0) updatedEscrowBalance = 0;

                      const finalUpdate = await updateUser(seller_id, {
                          escrow_balance: updatedEscrowBalance,
                          merchant_balance: updatedMerchantBalance,
                      });

                      if (finalUpdate && finalUpdate.success) {
                          await updateTransactionStatus(transactionId, "completed");
                          
                          // Store commission transaction
                          await storeMerchantTransaction({
                              seller_id,
                              transaction_id: transactionId,
                              transaction_type: "Commission Deduction",
                              amount: commissionAmount.toFixed(2),
                              status: "system",
                          });

                          // Wait 1 second before recording the merchant history
                          setTimeout(async () => {
                              await storeMerchantTransaction({
                                  seller_id,
                                  transaction_id: transactionId,
                                  transaction_type: "From Escrow to Merchant Wallet",
                                  amount: finalAmount.toFixed(2),
                                  status: "credited",
                              });
                          }, 1000);
                      } else {
                          logger.error(`Failed to finalize transaction ${transactionId} for seller ${seller_id}.`);
                      }
                  } catch (error) {
                      logger.error(`Error processing merchant transfer for seller ${seller_id}: ${error.message}`);
                  }
              }, 60000);
          } catch (error) {
              logger.error(`Error processing escrow for seller ${seller_id}: ${error.message}`);
          }
      }

      if (processedTransactions.length === 0) {
          logger.error("No valid escrow transactions.");
          throw new Error("No valid escrow transactions.");
      }

      return processedTransactions;
  } catch (error) {
      logger.error("Failed to process escrow data:", error.message);
      throw error;
  }
};

module.exports = { creditEscrow };

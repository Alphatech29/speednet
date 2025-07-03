const { getWebSettings } = require("./general");
const { getUserDetailsByUid, updateUser } = require("./userInfo");
const { storeMerchantTransaction, updateTransactionStatus } = require("./merchantHistory");
const { generateUniqueRandomNumber } = require("./random");
const logger = require('../utility/logger');

const creditEscrow = async (escrowData) => {
  try {
      // Validate input: escrowData must be a non-empty array
      if (!Array.isArray(escrowData) || escrowData.length === 0) {
          logger.error("Escrow data must be a non-empty array.");
          throw new Error("Escrow data must be a non-empty array.");
      }

      // Fetch global web settings, including commission rate
      const settings = await getWebSettings();
      const commission = settings?.commission / 100; // Convert percentage to decimal

      // Aggregate total escrow amounts per seller from escrowData
      const sellerTransactions = escrowData.reduce((acc, { seller_id, amount }) => {
          if (!seller_id || isNaN(amount)) return acc; // Skip invalid entries
          acc[seller_id] = (acc[seller_id] || 0) + parseFloat(amount);
          return acc;
      }, {});

      // Array to keep track of successfully processed transactions
      let processedTransactions = [];

      // Process each seller's aggregated escrow amount
      for (const [seller_id, totalAmount] of Object.entries(sellerTransactions)) {
          try {
              // Fetch user details of the seller
              const userDetails = await getUserDetailsByUid(seller_id);
              if (!userDetails) {
                  logger.error(`Seller ${seller_id} not found.`);
                  continue; // Skip if seller not found
              }

              // Parse current escrow balance, default to 0 if invalid
              let currentEscrowBalance = isNaN(userDetails.escrow_balance) ? 0 : Number(userDetails.escrow_balance);

              // Generate a unique transaction ID for this escrow credit
              const transactionId = generateUniqueRandomNumber();

              // Add the total amount to the seller's escrow balance
              currentEscrowBalance += totalAmount;

              // Update seller's escrow balance in the database
              const escrowUpdate = await updateUser(seller_id, { escrow_balance: currentEscrowBalance });

              if (!escrowUpdate || !escrowUpdate.success) {
                  logger.error(`Failed to update escrow balance for seller ${seller_id}.`);
                  continue; // Skip if update fails
              }

              // Record the escrow wallet credit transaction with "pending" status
              await storeMerchantTransaction({
                  seller_id,
                  transaction_id: transactionId,
                  transaction_type: "To Escrow Wallet",
                  amount: totalAmount.toFixed(2),
                  status: "pending",
              });

              // Add this transaction's summary to the processed transactions list
              processedTransactions.push({
                  seller_id,
                  totalAmount: totalAmount.toFixed(2),
                  newEscrowBalance: currentEscrowBalance.toFixed(2),
                  transactionId,
              });

              // Set a delayed operation to transfer funds from escrow to merchant wallet after 60 seconds
              setTimeout(async () => {
                  try {
                      // Refresh user details to get latest balances
                      const updatedUserDetails = await getUserDetailsByUid(seller_id);

                      // Parse updated balances or default to 0
                      let updatedEscrowBalance = isNaN(updatedUserDetails.escrow_balance) ? 0 : Number(updatedUserDetails.escrow_balance);
                      let updatedMerchantBalance = isNaN(updatedUserDetails.merchant_balance) ? 0 : Number(updatedUserDetails.merchant_balance);

                      // Calculate commission amount and final amount to credit merchant wallet
                      const commissionAmount = totalAmount * commission;
                      const finalAmount = totalAmount - commissionAmount;

                      // Deduct the escrow amount from escrow balance and add the final amount to merchant balance
                      updatedEscrowBalance -= totalAmount;
                      updatedMerchantBalance += finalAmount;

                      // Prevent escrow balance from dropping below zero
                      if (updatedEscrowBalance < 0) updatedEscrowBalance = 0;

                      // Update user balances in database
                      const finalUpdate = await updateUser(seller_id, {
                          escrow_balance: updatedEscrowBalance,
                          merchant_balance: updatedMerchantBalance,
                      });

                      if (finalUpdate && finalUpdate.success) {
                          // Mark the original escrow transaction as completed
                          await updateTransactionStatus(transactionId, "completed");

                          // Record the commission deduction as a system transaction
                          await storeMerchantTransaction({
                              seller_id,
                              transaction_id: transactionId,
                              transaction_type: "Commission Deduction",
                              amount: commissionAmount.toFixed(2),
                              status: "system",
                          });

                          // After 1 second delay, record the final merchant wallet credit transaction
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
                      // Log any errors occurring during the delayed transfer
                      logger.error(`Error processing merchant transfer for seller ${seller_id}: ${error.message}`);
                  }
              }, 60000); // 60 seconds delay
          } catch (error) {
              // Catch and log errors per seller to avoid stopping the entire process
              logger.error(`Error processing escrow for seller ${seller_id}: ${error.message}`);
          }
      }

      // If no transactions were processed successfully, throw an error
      if (processedTransactions.length === 0) {
          logger.error("No valid escrow transactions.");
          throw new Error("No valid escrow transactions.");
      }

      // Return all processed transaction summaries
      return processedTransactions;

  } catch (error) {
      // Catch any top-level errors, log them, and rethrow
      logger.error("Failed to process escrow data:", error.message);
      throw error;
  }
};

module.exports = { creditEscrow };

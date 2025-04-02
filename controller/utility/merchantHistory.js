const pool = require('../../model/db');

// Function to store merchant transaction
const storeMerchantTransaction = async (transactionData) => {
    try {
        const query = `
            INSERT INTO merchant_history 
            (seller_id, transaction_id, transaction_type, amount, status) 
            VALUES (?, ?, ?, ?, ?)`;

        const values = [
            transactionData.seller_id || null,
            transactionData.transaction_id,
            transactionData.transaction_type || 'credit',
            transactionData.amount || 0,
            transactionData.status || 'pending'
        ];

        const [result] = await pool.execute(query, values);

        return result.insertId; 
    } catch (error) {
        console.error("Error storing merchant transaction:", error);
        return null;
    }
};


// Function to update transaction status
const updateTransactionStatus = async (transactionId, newStatus) => {
  try {
      const query = `
          UPDATE merchant_history 
          SET status = ? 
          WHERE transaction_id = ? AND status = 'pending'
          ORDER BY created_at DESC 
          LIMIT 1`; 

      const values = [newStatus, transactionId];

      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
          console.warn(`⚠️ No pending transaction found for ID ${transactionId}.`);
          return { success: false, message: "No pending transaction found or already updated" };
      }
      return { success: true, message: "Transaction status updated successfully" };
  } catch (error) {
      console.error(`❌ Error updating transaction ${transactionId}:`, error);
      return { success: false, message: "Error updating transaction status" };
  }
};



module.exports = { storeMerchantTransaction, updateTransactionStatus};

const pool = require('../model/db');
const { generateUniqueRandomNumber } = require('../utility/random');
const logger = require('../utility/logger');

const createTransactionHistory = async (user_uid, amount, transaction_type, status, transaction_no = null) => {
    try {
        // Use provided transaction_no if valid string, else generate new one
        const txnNo = (transaction_no && typeof transaction_no === 'string') 
                      ? transaction_no 
                      : generateUniqueRandomNumber(13);

        if (!txnNo || typeof txnNo !== 'string') {
            logger.error("ERROR: `generateUniqueRandomNumber` returned an invalid value!", txnNo);
            return { success: false, message: "Failed to generate transaction number" };
        }

        // Ensure values are defined and valid
        if (typeof user_uid === 'undefined' || typeof amount === 'undefined') {
            logger.error("ERROR: `user_uid` or `amount` is undefined!");
            return { success: false, message: "Invalid user ID or amount" };
        }

        // Convert to the correct types
        const uid = Number(user_uid);
        const amt = parseFloat(amount);
        const type = String(transaction_type);
        const stat = String(status);

        if (isNaN(uid) || isNaN(amt)) {
            logger.error("ERROR: Invalid user ID or amount!");
            return { success: false, message: "User ID or amount is not a valid number" };
        }

        // SQL query including the status field
        const sql = `INSERT INTO transactions (user_uid, amount, transaction_type, status, transaction_no) 
                     VALUES (?, ?, ?, ?, ?)`;  

        // Execute query
        const [result] = await pool.execute(sql, [uid, amt, type, stat, txnNo]);

        return {
            success: true,
            message: 'Transaction recorded successfully.',
            transaction_no: txnNo,
            insertId: result.insertId
        };
    } catch (error) {
        logger.error('Database error:', error);
        return {
            success: false,
            message: 'Error: ' + error.message
        };
    }
};

module.exports = { createTransactionHistory };

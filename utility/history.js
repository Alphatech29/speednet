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


const getDepositTransactionsByUserUid = async (user_uid) => {
    try {
        const uid = Number(user_uid);
        
        if (isNaN(uid)) {
            logger.error("ERROR: Invalid user_uid provided!", user_uid);
            return {
                success: false,
                message: "Invalid user ID"
            };
        }

        const sql = `
            SELECT * FROM transactions 
            WHERE user_uid = ? 
            AND transaction_type LIKE '%Deposit'
            ORDER BY id DESC
        `;

        const [rows] = await pool.execute(sql, [uid]);

        return {
            success: true,
            message: "Deposit transactions retrieved successfully.",
            data: rows
        };
    } catch (error) {
        logger.error('Database error while fetching deposit transactions:', error);
        return {
            success: false,
            message: 'Error: ' + error.message
        };
    }
};


const createSmsServiceRecord = async (
  user_id,
  country,
  amount,
  service,
  number,
  code = null,
  tzid,
  status = 0,
  time
) => {
  try {
    // Check required fields
    if (!user_id || !country || !amount || !service || !number || !tzid || !time) {
      return { success: false, message: 'Missing required parameters' };
    }

    const sql = `INSERT INTO sms_service 
      (user_id, country, amount, service, number, code, tzid, status, time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Convert numeric values explicitly
    const params = [
      Number(user_id),
      Number(country),
      Number(amount),
      service,
      number,
      code || '', // Avoid null if column is NOT NULL
      Number(tzid),
      Number(status),
      Number(time),
    ];

    const [result] = await pool.execute(sql, params);

    return { success: true, insertId: result.insertId };
  } catch (error) {
    return { success: false, message: 'Database error: ' + error.message };
  }
};



const getSmsServicesByUserId = async (user_id) => {
  try {
    if (!user_id || isNaN(user_id)) {
      logger.error('Invalid user_id provided to getSmsServicesByUserId:', user_id);
      return { success: false, message: 'Invalid user ID' };
    }

    const sql = `SELECT * FROM sms_service WHERE user_id = ? ORDER BY created_at DESC`;

    const [rows] = await pool.execute(sql, [user_id]);

    return {
      success: true,
      message: 'SMS service records retrieved successfully',
      data: rows
    };
  } catch (error) {
    logger.error('Database error while fetching SMS service records:', error);
    return {
      success: false,
      message: 'Error: ' + error.message
    };
  }
};


module.exports = { createTransactionHistory, getDepositTransactionsByUserUid, createSmsServiceRecord,
  getSmsServicesByUserId };

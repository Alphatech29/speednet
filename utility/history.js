const pool = require('../model/db');
const { generateUniqueRandomNumber } = require('../utility/random');
const logger = require('../utility/logger');

// -------------------- Transaction History --------------------
const createTransactionHistory = async (user_uid, amount, transaction_type, status, transaction_no = null) => {
  try {
    const txnNo = (transaction_no && typeof transaction_no === 'string') 
                  ? transaction_no 
                  : generateUniqueRandomNumber(13);

    if (!txnNo || typeof txnNo !== 'string') {
      logger.error("ERROR: Invalid transaction number!", txnNo);
      return { success: false, message: "Failed to generate transaction number" };
    }

    const uid = Number(user_uid);
    const amt = parseFloat(amount);
    const type = String(transaction_type);
    const stat = String(status);

    if (isNaN(uid) || isNaN(amt)) {
      logger.error("ERROR: Invalid user ID or amount!");
      return { success: false, message: "User ID or amount is not a valid number" };
    }

    const sql = `INSERT INTO transactions (user_uid, amount, transaction_type, status, transaction_no) 
                 VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [uid, amt, type, stat, txnNo]);

    return {
      success: true,
      message: 'Transaction recorded successfully.',
      transaction_no: txnNo,
      insertId: result.insertId
    };
  } catch (error) {
    logger.error('Database error:', error);
    return { success: false, message: 'Error: ' + error.message };
  }
};

const getDepositTransactionsByUserUid = async (user_uid) => {
  try {
    const uid = Number(user_uid);
    if (isNaN(uid)) return { success: false, message: "Invalid user ID" };

    const sql = `
      SELECT * FROM transactions 
      WHERE user_uid = ? 
      AND transaction_type LIKE '%Deposit'
      ORDER BY id DESC
    `;
    const [rows] = await pool.execute(sql, [uid]);

    return { success: true, message: "Deposit transactions retrieved successfully.", data: rows };
  } catch (error) {
    logger.error('Database error while fetching deposit transactions:', error);
    return { success: false, message: 'Error: ' + error.message };
  }
};

// -------------------- SMS Service Records --------------------
const createSmsServiceRecord = async (record) => {
  try {
    const {
      user_id,
      country,
      amount,
      service,
      number,
      code = '',
      orderid,
      status = 0,
      time,
    } = record;

    if (!user_id || !country || !amount || !service || !number || !orderid || !time) {
      return { success: false, message: 'Missing required parameters' };
    }

    const sql = `INSERT INTO sms_service 
      (user_id, country, amount, service, number, code, orderid, status, time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      Number(user_id),
      country,
      Number(amount),
      service,
      number,
      code || '',
      orderid,
      Number(status),
      Number(time),
    ];

    const [result] = await pool.execute(sql, params);
    return { success: true, insertId: result.insertId };
  } catch (error) {
    return { success: false, message: 'Database error: ' + error.message };
  }
};

const getSmsServiceRecord = async (orderid) => {
  try {
    const sql = `SELECT * FROM sms_service WHERE orderid = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [orderid]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("DB error in getSmsServiceRecord:", error.message);
    return null;
  }
};

const updateSmsServiceRecord = async (orderid, code, status) => {
  try {
    if (!orderid) return { success: false, message: "Missing required parameter: orderid" };

    let sql, params;

    if (status === 2 && !code) {
      sql = `UPDATE sms_service SET status = ? WHERE orderid = ? AND (code IS NULL OR code = '')`;
      params = [2, orderid];
    } else {
      sql = `UPDATE sms_service SET code = ?, status = ? WHERE orderid = ?`;
      params = [code || "", Number(status), orderid];
    }

    const [result] = await pool.execute(sql, params);
    if (result.affectedRows === 0) {
      return { success: false, message: "No record updated. Condition may not have matched." };
    }
    return { success: true, message: "Record updated successfully" };
  } catch (error) {
    return { success: false, message: "Database error: " + error.message };
  }
};

const getPendingSmsServiceRecords = async () => {
  try {
    const sql = `SELECT * FROM sms_service WHERE status = 0`;
    const [rows] = await pool.execute(sql);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, message: 'Database error: ' + error.message };
  }
};

const getSmsServicesByUserId = async (user_id) => {
  try {
    if (!user_id || isNaN(user_id)) return { success: false, message: 'Invalid user ID' };

    const sql = `SELECT * FROM sms_service WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await pool.execute(sql, [Number(user_id)]);

    return { success: true, message: 'SMS service records retrieved successfully', data: rows };
  } catch (error) {
    logger.error('Database error while fetching SMS service records:', error);
    return { success: false, message: 'Error: ' + error.message };
  }
};

module.exports = {
  createTransactionHistory,
  getDepositTransactionsByUserUid,
  createSmsServiceRecord,
  getSmsServicesByUserId,
  updateSmsServiceRecord,
  getPendingSmsServiceRecords,
  getSmsServiceRecord
};

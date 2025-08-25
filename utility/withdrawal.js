const pool = require('../model/db');
const logger = require('./logger');

const storeWithdrawal = async (data) => {
  try {
    const {
      user_id,
      method,
      amount,
      reference,
      coinName,
      walletAddress,
      walletNetwork,
      bankAccount,
      bankName,
      accountName,
      coin_name: rawcoinName,
      wallet_address: rawwalletAddress,
      wallet_network: rawwalletNetwork,
      account_number: rawAccountNumber,
      bank_name: rawBankName,
      account_name: rawAccountName,
      momo_number: rawMomoNumber,
      momoNumber,
    } = data;

    // Normalize fields
    const account_number = bankAccount || rawAccountNumber || null;
    const bank_name = bankName || rawBankName || null;
    const account_name = accountName || rawAccountName || null;

    const coin_name = coinName || rawcoinName || null;
    const wallet_address = walletAddress || rawwalletAddress || null;
    const wallet_network = walletNetwork || rawwalletNetwork || null;

    const momo_number = momoNumber || rawMomoNumber || null;

    // Basic validation
    if (!user_id || !method || !amount || !reference) {
      throw new Error('Missing required fields: user_id, method, amount, or reference');
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      throw new Error('Invalid amount. Must be a number.');
    }

    // Method-specific validation
    if (method === 'Bank' && (!bank_name || !account_name || !account_number)) {
      throw new Error('Bank withdrawal requires bank_name, account_name, and account_number.');
    }

    if (method === 'Crypto' && (!wallet_address || !wallet_network || !coin_name)) {
      throw new Error('Crypto withdrawal requires wallet_address, wallet_network, and coin_name.');
    }

    if (method === 'MOMO' && !momo_number) {
      throw new Error('MOMO withdrawal requires momo_number.');
    }

    // Build query
    const fields = ['user_id', 'method', 'reference', 'amount', 'status'];
    const values = [user_id, method, reference, parsedAmount, 'pending'];

    if (method === 'Bank') {
      fields.push('bank_name', 'account_name', 'account_number');
      values.push(bank_name, account_name, account_number);
    } else if (method === 'Crypto') {
      fields.push('wallet_address', 'wallet_network', 'coin_name');
      values.push(wallet_address, wallet_network, coin_name);
    } else if (method === 'MOMO') {
      fields.push('momo_number');
      values.push(momo_number);
    }

    const placeholders = fields.map(() => '?').join(', ');
    const query = `INSERT INTO withdrawal (${fields.join(', ')}) VALUES (${placeholders})`;

    const [result] = await pool.execute(query, values);

    return {
      success: true,
      message: 'Withdrawal request stored.',
      insertId: result.insertId,
      reference,
    };
  } catch (error) {
    logger.error('storeWithdrawal error', {
      message: error.message,
      stack: error.stack,
      data,
    });

    return {
      success: false,
      message: error.message,
    };
  }
};


const getAllWithdrawals = async () => {
  try {
    const query = `
      SELECT 
        w.*, 
        u.full_name, 
        u.email, 
        u.username
      FROM withdrawal w
      LEFT JOIN users u ON w.user_id = u.uid
      ORDER BY w.created_at DESC
    `;
    
    const [rows] = await pool.execute(query);

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    logger.error('getAllWithdrawals error', {
      message: error.message,
      stack: error.stack,
    });

    return {
      success: false,
      message: error.message,
    };
  }
};

const getWithdrawalById = async (withdrawalId) => {
  try {
    const query = `
      SELECT 
        w.*, 
        u.full_name, 
        u.email, 
        u.username
      FROM withdrawal w
      LEFT JOIN users u ON w.user_id = u.uid
      WHERE w.id = ?
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [withdrawalId]);

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Withdrawal not found',
      };
    }

    return {
      success: true,
      data: rows[0],
    };
  } catch (error) {
    logger.error('getWithdrawalById error', {
      message: error.message,
      stack: error.stack,
    });

    return {
      success: false,
      message: error.message,
    };
  }
};



const updateWithdrawalStatusById = async (id, status) => {
  try {
    const validStatuses = ['completed', 'rejected'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return {
        success: false,
        message: 'Invalid status provided.',
      };
    }

    const query = `UPDATE withdrawal SET status = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [status, id]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'No withdrawal found with the specified ID.',
      };
    }

    return {
      success: true,
      message: `Withdrawal status updated to '${status}'.`,
    };
  } catch (error) {
    logger.error('updateWithdrawalStatusById error', {
      message: error.message,
      stack: error.stack,
      id,
      status,
    });

    return {
      success: false,
      message: error.message,
    };
  }
};

const updateMerchantTransactionStatusByReference = async (transactionId, status) => {
  try {
    const validStatuses = ['completed', 'rejected'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return {
        success: false,
        message: 'Invalid status provided.',
      };
    }

    const query = `UPDATE merchant_history SET status = ? WHERE transaction_id = ?`;
    const [result] = await pool.execute(query, [status, transactionId]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'No transaction found with the specified transaction ID.',
      };
    }

    return {
      success: true,
      message: `Merchant transaction status updated to '${status}'.`,
    };
  } catch (error) {
    logger.error('updateMerchantTransactionStatusByReference error', {
      message: error.message,
      stack: error.stack,
      transactionId,
      status,
    });

    return {
      success: false,
      message: error.message,
    };
  }
};



module.exports = { storeWithdrawal, getAllWithdrawals,getWithdrawalById, updateWithdrawalStatusById,updateMerchantTransactionStatusByReference  };

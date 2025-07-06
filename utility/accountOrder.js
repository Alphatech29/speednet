const pool = require('../model/db');
const logger = require('../utility/logger');

// Function to store an order
const storeOrder = async (orderData) => {
    try {
        const query = `
            INSERT INTO account_order 
            (account_id, seller_id, buyer_id, order_no, title, platform, email, recovery_email, 
             username, password, description, two_factor_enabled, two_factor_description, price, 
             payment_status, escrow_expires_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            orderData.account_id || null,
            orderData.seller_id || null,
            orderData.buyer_id || null,
            orderData.order_no, 
            orderData.title || null,
            orderData.platform || null,
            orderData.email || null,
            orderData.recovery_email || null,
            orderData.username || null,
            orderData.password || null,
            orderData.description || null,
            orderData.two_factor_enabled || false,
            orderData.two_factor_description || null,
            orderData.price || 0,
            orderData.payment_status || "Pending",
            orderData.escrow_expires_at || null  
        ];

        const [result] = await pool.execute(query, values);
        logger.info(`Order stored successfully with ID: ${result.insertId}`);
        return result.insertId; 
    } catch (error) {
        logger.error(`Error storing order: ${error.message}`);
        return null;
    }
};

// Function to store order history
const storeOrderHistory = async (orderHistoryData) => {
    try {
        const query = `
            INSERT INTO order_history 
            (seller_id, order_no, order_type, amount, status) 
            VALUES (?, ?, ?, ?, ?)`;

        const values = [
            orderHistoryData.seller_id || null,
            orderHistoryData.order_no, 
            orderHistoryData.order_type || 'Normal',
            orderHistoryData.amount || 0,    
            orderHistoryData.status || 'Pending' 
        ];

        const [result] = await pool.execute(query, values);
        logger.info(`Order history stored successfully with ID: ${result.insertId}`);
        return result.insertId; 
    } catch (error) {
        logger.error(`Error storing order history: ${error.message}`);
        return null;
    }
};

// Function to get orders by user
const getOrdersByUser = async (userUid) => {
    try {
        if (!userUid || typeof userUid !== "string") {
            throw new Error("Invalid user ID provided. Expected a string.");
        }

        const query = `SELECT * FROM account_order WHERE buyer_id = ? OR seller_id = ?`;
        const [rows] = await pool.execute(query, [userUid, userUid]);

        if (rows.length === 0) {
            logger.warn(`No orders found for user: ${userUid}`);
            return {
                success: false,
                message: 'No orders found for the user',
                data: []
            };
        }

        logger.info(`Fetched ${rows.length} orders for user: ${userUid}`);
        return {
            success: true,
            message: 'Orders fetched successfully',
            data: rows
        };

    } catch (error) {
        logger.error(`Error fetching orders for user (${userUid}): ${error.message}`);
        return {
            success: false,
            message: 'An error occurred while fetching orders',
            error: error.message || 'Unknown error'
        };
    }
};

module.exports = { storeOrder, storeOrderHistory, getOrdersByUser };

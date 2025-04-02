const pool = require('../../model/db');

// Function to store an order
const storeOrder = async (orderData) => {
    try {
        const query = `
            INSERT INTO account_order 
            (account_id, seller_id, buyer_id, order_no, title, platform, email, recovery_email, 
             username, password, description, two_factor_enabled, two_factor_description, price, payment_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
            orderData.payment_status || "Pending"
        ];

       

        const [result] = await pool.execute(query, values);

        return result.insertId; 
    } catch (error) {
        console.error("Error storing order:", error);
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

        return result.insertId; 
    } catch (error) {
        console.error("Error storing order history:", error);
        return null;
    }
};

const getOrdersByUser = async (userUid) => {
    try {
        // Ensure userUid is a valid string
        if (userUid === null || userUid === undefined || typeof userUid !== "string") {
            throw new Error("Invalid user ID provided. Expected a string.");
        }

        const query = `SELECT * FROM account_order WHERE buyer_id = ? OR seller_id = ?`;
        
        const [rows] = await pool.execute(query, [userUid, userUid]);

        if (rows.length === 0) {
            return {
                success: false,
                message: 'No orders found for the user',
                data: []
            };
        }

        return {
            success: true,
            message: 'Orders fetched successfully',
            data: rows
        };

    } catch (error) {
        console.error("Error fetching orders for user:", error);
        return {
            success: false,
            message: 'An error occurred while fetching orders',
            error: error.message || 'Unknown error'
        };
    }
};



module.exports = { storeOrder, storeOrderHistory, getOrdersByUser };

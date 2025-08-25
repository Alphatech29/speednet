const pool = require("../../model/db");

// Fetch user transactions
const getUserTransactions = async (req, res) => {
    try {
        const { userUid } = req.params;

        // Validate user ID
        if (!userUid || isNaN(userUid)) {
            return res.status(400).json({ success: false, message: "Invalid or missing User ID" });
        }

        // Query the database for transactions
        const sql = `
            SELECT transaction_no, transaction_type, amount, status, created_at 
            FROM transactions 
            WHERE user_uid = ? 
            ORDER BY created_at DESC
        `;
        const [transactions] = await pool.query(sql, [userUid]);

        // Check if transactions exist
        if (!transactions.length) {
            return res.status(404).json({ success: false, message: "No transactions found" });
        }

        // Format status
        const formattedTransactions = transactions.map(t => ({
            ...t,
            status: t.status.charAt(0).toUpperCase() + t.status.slice(1).toLowerCase()
        }));

        return res.status(200).json({
            success: true,
            message: "Successfully fetched transactions",
            data: formattedTransactions
        });
    } catch (error) {
        console.error("❌ Database error:", error);
        return res.status(500).json({ success: false, message: "Error fetching transactions", error: error.message });
    }
};

// Fetch user order history
const getUserOrderHistory = async (req, res) => {
    try {
        const { userUid } = req.params;

        // Validate user ID
        if (!userUid || isNaN(userUid)) {
            return res.status(400).json({ success: false, message: "Invalid or missing User ID" });
        }

        // Fetch Order History
        const orderSql = `
            SELECT order_no, order_type, amount, status, updated_at 
            FROM order_history 
            WHERE seller_id = ? 
            ORDER BY updated_at DESC
        `;
        const [orderHistory] = await pool.query(orderSql, [userUid]);

        // Format Order History
        const formattedOrderHistory = orderHistory.map(order => ({
            ...order,
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()
        }));

        // Fetch Merchant History
        const merchantSql = `
            SELECT transaction_id, transaction_type, amount, status, created_at 
            FROM merchant_history 
            WHERE seller_id = ? 
            ORDER BY created_at DESC
        `;
        const [merchantHistory] = await pool.query(merchantSql, [userUid]);

        // Format Merchant History
        const formattedMerchantHistory = merchantHistory.map(history => ({
            ...history,
            status: history.status.charAt(0).toUpperCase() + history.status.slice(1).toLowerCase()
        }));

        return res.status(200).json({
            success: true,
            message: "Successfully fetched user history",
            data: {
                orderHistory: formattedOrderHistory,
                merchantHistory: formattedMerchantHistory
            }
        });
    } catch (error) {
        console.error(" Database error:", error);
        return res.status(500).json({ success: false, message: "Error fetching user history", error: error.message });
    }
};



module.exports = { 
    getUserTransactions, 
    getUserOrderHistory, 
};

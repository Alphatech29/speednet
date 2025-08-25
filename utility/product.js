const pool = require('../model/db');

const getProductDetailsById = async (productId) => {
    try {
        // Ensure the ID is a valid number (parse safely)
        const numericId = parseInt(productId, 10);
        if (isNaN(numericId)) {
            console.error(`❌ Invalid product ID: ${productId}`);
            return null;
        }

        const query = "SELECT * FROM accounts WHERE id = ?";
        const [rows] = await pool.execute(query, [numericId]);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
};

const updateAccountStatusById = async (productId, status) => {
    try {
        if (typeof productId !== "string" || productId.trim() === "") {
            console.error(`❌ Invalid product ID: ${productId}`);
            return false;
        }

        const query = "UPDATE accounts SET status = ? WHERE id = ?";
        const [result] = await pool.execute(query, [status, productId]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error("Database error:", error);
        return false;
    }
};


const getAccountsByUserUid = async (userUid) => {
    try {
        // Validate userUid (ensure it's a non-empty string)
        if (typeof userUid !== 'string' || !userUid.trim()) {
            console.error(`❌ Invalid userUid: ${userUid}`);
            return [];
        }

        const query = "SELECT * FROM accounts WHERE user_id = ?";
        const [rows] = await pool.execute(query, [userUid]);

        return rows; // Return all accounts belonging to the user
    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
};

module.exports = { getProductDetailsById , getAccountsByUserUid , updateAccountStatusById };

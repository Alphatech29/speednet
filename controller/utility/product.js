const pool = require('../../model/db');

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

module.exports = { getProductDetailsById };

const pool = require("../../model/db");

const getUserTransactions = async (req, res) => {
    try {
        const { userUid } = req.params; 

        if (!userUid || isNaN(userUid)) {
            return res.status(400).json({ success: false, message: "Invalid or missing User ID" });
        }

        const uid = Number(userUid); 
        const sql = `SELECT * FROM transactions WHERE user_uid = ? ORDER BY created_at DESC`;
        const [transactions] = await pool.execute(sql, [uid]);

        return res.status(200).json({ 
            success: true, 
            transactions: transactions.length > 0 ? transactions : [] 
        });
    } catch (error) {
        console.error("❌ Database error:", error);
        return res.status(500).json({ success: false, message: "Error fetching transactions" });
    }
};

module.exports = { getUserTransactions };

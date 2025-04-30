const pool = require('../model/db');
const { getWebSettings } = require('./general');
const { createTransactionHistory } = require('./history');

const getUserDetailsDirectly = async (userUid) => {
    try {

        const [rows] = await pool.execute("SELECT * FROM users WHERE uid = ?", [Number(userUid)]);

        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
};

const activateAccount = async (req, res) => {
    try {
        const { userUid } = req.body;

        if (!userUid) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const userDetails = await getUserDetailsDirectly(userUid);
        if (!userDetails) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const webSettings = await getWebSettings();
        const activationFee = parseFloat(webSettings.merchant_activation_fee);

        if (isNaN(activationFee)) {
            return res.status(500).json({ success: false, message: 'Merchant activation fee is invalid' });
        }

        const userBalance = parseFloat(userDetails.account_balance) || 0;

        if (userBalance < activationFee) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        const newBalance = userBalance - activationFee;
        await pool.execute("UPDATE users SET account_balance = ? WHERE uid = ?", [newBalance, Number(userUid)]);

        await pool.execute("UPDATE users SET role = 'merchant' WHERE uid = ?", [Number(userUid)]);


        // Create transaction history with 'completed' status
        const transactionResult = await createTransactionHistory(userUid, activationFee, 'Merchant Activation', 'completed');

        return res.status(200).json({ success: true, message: 'Account activated successfully' });
    } catch (error) {
        console.error('Error activating account:', error.message || error);
        return res.status(500).json({ success: false, message: 'An error occurred while activating the merchant account' });
    }
};

module.exports = { activateAccount };

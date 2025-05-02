const pool = require('../model/db');

// Fetch user details by UID
const getUserDetailsByUid = async (userUid) => {
    try {
        if (!userUid) {
            throw new Error("Invalid userUid provided");
        }

        const query = "SELECT * FROM users WHERE uid = ?";
        const [rows] = await pool.execute(query, [userUid]);

        if (rows.length === 0) {
            throw new Error(`User not found with UID: ${userUid}`);
        }

        return rows[0];
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
};

// Update user's account balance
const updateUserBalance = async (userUid, newBalance) => {
    try {
        if (!userUid || newBalance === undefined || isNaN(newBalance)) {
            throw new Error("Invalid parameters: userUid and newBalance are required");
        }

        const query = `
            UPDATE users 
            SET account_balance = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE uid = ?
        `;
        const [result] = await pool.execute(query, [newBalance, userUid]);

        if (result.affectedRows > 0) {
            console.log(`✅ Balance updated successfully: userUid=${userUid}, newBalance=${newBalance}`);
            return { success: true, affectedRows: result.affectedRows };
        } else {
            console.warn(`⚠️ No rows affected, user not found: userUid=${userUid}`);
            return { success: false, message: "User not found or no change in balance" };
        }
    } catch (error) {
        console.error("❌ Error updating balance:", error);
        return { success: false, error: error.message };
    }
};


// Update multiple user fields (generic update function)
const updateUser = async (userUid, updateFields) => {
    try {
        if (!userUid || !updateFields || Object.keys(updateFields).length === 0) {
            throw new Error("Invalid parameters: userUid and updateFields are required");
        }

        // Build dynamic query based on updateFields
        const setClauses = [];
        const values = [];
        for (const [field, value] of Object.entries(updateFields)) {
            if (value === undefined || value === null) continue;
            setClauses.push(`${field} = ?`);
            values.push(value);
        }

        if (setClauses.length === 0) {
            throw new Error("No valid fields to update");
        }

        // Add userUid to the values for the WHERE clause
        values.push(userUid);

        const query = `
            UPDATE users 
            SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP 
            WHERE uid = ?
        `;
        
        const [result] = await pool.execute(query, values);

        if (result.affectedRows > 0) {
            console.log(`✅ User updated successfully: userUid=${userUid}`);
            return { success: true, affectedRows: result.affectedRows };
        } else {
            console.warn(`⚠️ No rows affected, user not found or no change in fields: userUid=${userUid}`);
            return { success: false, message: "User not found or no changes made" };
        }
    } catch (error) {
        console.error("❌ Error updating user:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { getUserDetailsByUid, updateUserBalance, updateUser };

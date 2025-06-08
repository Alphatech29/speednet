const db = require("../../../model/db");

// This function retrieves all accounts from the database, including user details.
const getAllAccount = async (req, res) => {
  try {
    const [accounts] = await db.execute(`
      SELECT 
        accounts.*,
        users.full_name,
        users.username,
        users.email,
        users.phone_number
      FROM accounts
      JOIN users ON accounts.user_id = users.uid
    `);

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No accounts found",
      });
    }

    return res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// This function retrieves all orders from the database, including seller and buyer details.
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT 
        ao.*, 
        seller.full_name AS seller_name,
        seller.username AS seller_username,
        seller.email AS seller_email,
        seller.phone_number AS seller_phone,
        buyer.full_name AS buyer_name,
        buyer.username AS buyer_username,
        buyer.email AS buyer_email,
        buyer.phone_number AS buyer_phone
      FROM account_order ao
      LEFT JOIN users AS seller ON ao.seller_id = seller.uid
      LEFT JOIN users AS buyer ON ao.buyer_id = buyer.uid
      WHERE 1
      ORDER BY ao.create_at DESC
    `);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found',
      });
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};




module.exports = {
  getAllAccount , getAllOrders,
};

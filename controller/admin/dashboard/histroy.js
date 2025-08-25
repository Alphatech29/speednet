const db = require("../../../model/db");

const getAllTransactions = async (req, res) => {
  try {
    const [transactions] = await db.execute(`
      SELECT 
        t.*,
        u.full_name,
        u.email,
        u.phone_number
      FROM transactions t
      LEFT JOIN users u ON t.user_uid = u.uid
      ORDER BY t.created_at DESC
    `);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
      });
    }

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getAllMerchantTransactions = async (req, res) => {
  try {
    const [transactions] = await db.execute(`
      SELECT 
        mh.*,
        u.full_name,
        u.email,
        u.phone_number
      FROM merchant_history mh
      LEFT JOIN users u ON mh.seller_id = u.uid
      ORDER BY mh.created_at DESC
    `);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No merchant transactions found",
      });
    }

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getAllAccountOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT 
        ao.*,
        seller.full_name AS seller_name,
        seller.email AS seller_email,
        seller.phone_number AS seller_phone,
        buyer.full_name AS buyer_name,
        buyer.email AS buyer_email,
        buyer.phone_number AS buyer_phone
      FROM account_order ao
      LEFT JOIN users seller ON ao.seller_id = seller.uid
      LEFT JOIN users buyer ON ao.buyer_id = buyer.uid
      ORDER BY ao.create_at DESC
    `);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account orders found",
      });
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




module.exports = {
 getAllTransactions,getAllMerchantTransactions,getAllAccountOrders
};

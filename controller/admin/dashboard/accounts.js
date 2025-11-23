const db = require("../../../model/db");

const getAllAccount = async (req, res) => {
  try {
    const [accounts] = await db.execute(`
      SELECT
        accounts.*,
        accounts.username AS account_username,
        accounts.email AS account_email,
        users.full_name,
        users.username AS user_username,
        users.email AS user_email,
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


const getAccountById = async (req, res) => {
  const { id } = req.params;

  try {
    const [accounts] = await db.execute(
      `
      SELECT 
        accounts.*,
        users.full_name,
        users.username AS user_username,
        users.email AS user_email,
        users.phone_number
      FROM accounts
      JOIN users ON accounts.user_id = users.uid
      WHERE accounts.id = ?
      `,
      [id]
    );

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Account with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: accounts[0],
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



const updateProductById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Check if product exists
    const [existing] = await db.execute(`SELECT * FROM accounts WHERE id = ?`, [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: `Product with ID ${id} not found` });
    }

    // Build dynamic update fields
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);

    await db.execute(`UPDATE accounts SET ${setClause} WHERE id = ?`, [...values, id]);

    // Return updated product
    const [updated] = await db.execute(`SELECT * FROM accounts WHERE id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated[0],
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
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
  getAllAccount , getAllOrders, getAccountById, updateProductById
};

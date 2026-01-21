// getProducts.js
const pool = require("../model/db");
const { startjob } = require("../jobs/jobs");

async function getDarkShopProducts() {
    try {
        const [rows] = await pool.execute(
            `SELECT p.*,
                    g.name AS group_name, 
                    c.name AS category_name,
                    c.id AS category_id
             FROM dark_shop_products p
             LEFT JOIN dark_shop_category_groups g ON p.group_id = g.id
             LEFT JOIN dark_shop_categories c ON g.category_id = c.id`
        );

        if (!rows || rows.length === 0) {
            console.warn("No products found in dark_shop_products table.");
            return [];
        }

        return rows;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error("Database connection was refused:", error.message);
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error("Database access denied. Check your credentials:", error.message);
        } else {
            console.error("Unexpected error fetching dark shop products:", error.message);
        }

        throw new Error("Unable to fetch dark shop products. Please try again later.");
    }
}



async function getDarkShopProductById(id) {
    try {
        const [rows] = await pool.execute(
            `SELECT p.*,
                    c.id AS category_id,
                    c.name AS category_name
             FROM dark_shop_products p
             LEFT JOIN dark_shop_category_groups g ON p.group_id = g.id
             LEFT JOIN dark_shop_categories c ON g.category_id = c.id
             WHERE p.id = ?`,
            [id]
        );

        if (!rows || rows.length === 0) {
            console.warn(`Product with ID ${id} not found.`);
            return null;
        }

        return rows[0];
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error("Database connection was refused:", error.message);
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error("Database access denied. Check your credentials:", error.message);
        } else {
            console.error(`Unexpected error fetching product with ID ${id}:`, error.message);
        }

        throw new Error("Unable to fetch product. Please try again later.");
    }
}




async function updateDarkShopProductById(id, name, description) {
    try {
        const [result] = await pool.execute(
            `UPDATE dark_shop_products 
             SET name = ?, description = ?
             WHERE id = ?`,
            [name, description, id]
        );

        if (result.affectedRows === 0) {
            console.warn(`No product found to update with ID ${id}.`);
            return false;
        }

        return true;
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            console.error("Database connection was refused:", error.message);
        } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("Database access denied. Check your credentials:", error.message);
        } else {
            console.error(
                `Unexpected error updating product with ID ${id}:`,
                error.message
            );
        }

        throw new Error("Unable to update product. Please try again later.");
    }
}

async function assignProductToVendor(productId, vendorId) {
    try {
        const [result] = await pool.execute(
            `INSERT INTO assign_product_vendor (product_id, vendor_id) 
             VALUES (?, ?) 
             ON DUPLICATE KEY UPDATE assigned_date = CURRENT_TIMESTAMP`,
            [productId, vendorId]
        );

        console.log(
            `Product ID ${productId} assigned to Vendor ID ${vendorId}`
        );

        return result;
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            console.warn(
                `Product ID ${productId} is already assigned to Vendor ID ${vendorId}`
            );
        } else {
            console.error(
                `Error assigning product ID ${productId} to vendor ID ${vendorId}:`,
                error.message
            );
        }
        throw new Error("Unable to assign product to vendor.");
    }
}


async function getDarkShopProductPricesbyid(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Please provide an array of product IDs.");
    }

    try {
        // Use IN (?) to fetch multiple IDs at once
        const [rows] = await pool.execute(
            `SELECT id, price FROM dark_shop_products WHERE id IN (${ids.map(() => '?').join(',')})`,
            ids
        );

        if (!rows || rows.length === 0) {
            console.warn("No products found for the provided IDs.");
            return {};
        }

        // Map results to an object {id: price}
        const prices = {};
        rows.forEach(row => {
            prices[row.id] = row.price;
        });

        return prices;
    } catch (error) {
        console.error("Error fetching product prices in bulk:", error.message);
        throw new Error("Unable to fetch product prices. Please try again later.");
    }
}

// insertDarkShopOrder.js (can live in same file)

async function insertDarkShopOrder({
    account_id,
    buyer_id,
    order_no,
    title,
    price,
    darkshop_order_id,
    darkshop_link = null,
    darkshop_content = null,
    platform = "Darkshop",
    payment_status = "Pending"
}) {
    try {
        const [result] = await pool.execute(
            `INSERT INTO dark_shop_orders (
                account_id,
                buyer_id,
                order_no,
                title,
                platform,
                price,
                payment_status,
                darkshop_order_id,
                darkshop_link,
                darkshop_content
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                account_id,
                buyer_id,
                order_no,
                title,
                platform,
                price,
                payment_status,
                darkshop_order_id,
                darkshop_link,
                darkshop_content
            ]
        );

        return {
            success: true,
            order_id: result.insertId
        };
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            console.error("Duplicate order detected:", error.message);
            throw new Error("Order already exists.");
        } else if (error.code === "ECONNREFUSED") {
            console.error("Database connection refused:", error.message);
        } else {
            console.error("Error inserting dark shop order:", error.message);
        }

        throw new Error("Unable to create order. Please try again.");
    }
}


async function updateDarkShopOrderStatus(orderId, {
    payment_status,
    darkshop_link = null,
    darkshop_content = null
}) {
    try {
        await pool.execute(
            `UPDATE dark_shop_orders
             SET payment_status = ?,
                 darkshop_link = COALESCE(?, darkshop_link),
                 darkshop_content = COALESCE(?, darkshop_content)
             WHERE id = ?`,
            [payment_status, darkshop_link, darkshop_content, orderId]
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating dark shop order status:", error.message);
        return { success: false, error: error.message };
    }
}


async function getPendingDarkShopOrderById(darkshop_order_id) {
  try {
    const [rows] = await pool.execute(
      `SELECT darkshop_order_id, order_no, buyer_id
       FROM dark_shop_orders
       WHERE payment_status = 'Pending'
         AND darkshop_order_id = ?`,
      [darkshop_order_id]
    );

    if (rows.length === 0) {
      return { success: false, message: "No pending order found", order: null };
    }

    return { success: true, order: rows[0] };
  } catch (error) {
    console.error("Error fetching pending dark shop order:", error.message);
    return { success: false, error: error.message, order: null };
  }
}

async function getDarkShopOrdersByBuyer(userId) {
  try {
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user ID provided. Expected a string.");
    }

    const [rows] = await pool.execute(
      `SELECT *
       FROM dark_shop_orders
       WHERE buyer_id = ?`,
      [userId] // ✅ FIX
    );

    if (!rows || rows.length === 0) {
      console.warn(`No dark shop orders found for buyer: ${userId}`);
      return [];
    }

    console.info(`Fetched ${rows.length} dark shop orders for buyer: ${userId}`);
    return rows;
  } catch (error) {
    console.error(
      `Error fetching dark shop orders for buyer ${userId}:`,
      error.message
    );
    throw new Error("Unable to fetch dark shop orders. Please try again later.");
  }
}


async function getDarkShopOrderByBuyerAndOrderNo(buyerId, orderNo) {
  try {
    const [rows] = await pool.execute(
      `SELECT *
       FROM dark_shop_orders
       WHERE buyer_id = ? AND order_no = ?`,
      [buyerId, orderNo]
    );

    if (!rows || rows.length === 0) {
      console.warn(`No dark shop order found for buyer ${buyerId} with order_no ${orderNo}`);
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error(
      `Error fetching dark shop order for buyer ${buyerId} with order_no ${orderNo}:`,
      error.message
    );
    throw new Error("Unable to fetch dark shop order. Please try again later.");
  }
}




// Run job daily at 12:00 AM (midnight)
//startjob(
    //async () => {
       // await pool.execute("DELETE FROM dark_shop_products");
       // console.log(
       //     "All dark shop products deleted by job at",
      //      new Date().toLocaleString()
      //  );
   // },
  //  "0 0 * * *",
  //  "Africa/Lagos"
//);

module.exports = {
    getDarkShopProducts,
    getDarkShopProductById,
    updateDarkShopProductById,
    assignProductToVendor,
    getDarkShopProductPricesbyid,
    insertDarkShopOrder,
    updateDarkShopOrderStatus,
    getPendingDarkShopOrderById,
    getDarkShopOrdersByBuyer
};

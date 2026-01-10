const {
  getUserDetailsByUid,
  updateUserBalance,
} = require("../../utility/userInfo");

const {
  getProductDetailsById,
  updateAccountStatusById,
} = require("../../utility/product");

const { storeOrder, storeOrderHistory } = require("../../utility/accountOrder");
const { generateUniqueRandomNumber } = require("../../utility/random");
const { createTransactionHistory } = require("../../utility/history");
const { creditEscrow } = require("../../utility/escrow");
const { getEscrowExpiry } = require("../../utility/countDown");
const { taskVerification } = require("../../utility/referralVerification");

const {
  getDarkShopProductPricesbyid,
  getDarkShopProductById,
  insertDarkShopOrder,
} = require("../../utility/darkshopProduct");

const {
  getDarkshopBalance,
  createDarkshopOrder,
} = require("../../utility/daskshopCreateOrder");

const SYSTEM_SELLER_ID = 4; // ONLY FOR DARKSHOP LOGIC

const collectOrder = async (req, res) => {
  let originalBalance = null;
  let safeUserId = null;

  const pendingOrders = [];
  const pendingEscrow = [];
  const darkProductsResponse = [];

  try {
    console.log("[REQUEST BODY]:", JSON.stringify(req.body, null, 2));

    const { userId, products, totalAmount } = req.body || {};
    if (!userId || !Array.isArray(products) || products.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: "Invalid request data" });
    }

    safeUserId = String(userId).trim();
    const amountToDeduct = Number(totalAmount);
    if (isNaN(amountToDeduct) || amountToDeduct <= 0) {
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    // USER CHECK
    const user = await getUserDetailsByUid(safeUserId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    originalBalance = Number(user.account_balance);
    if (originalBalance < amountToDeduct) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // SPLIT PRODUCTS
    const darkProductIds = [];
    const normalProducts = [];
    for (const p of products) {
      if (!p?.id) continue;
      const productId = String(p.id).trim();
      if (productId.startsWith("dark-")) darkProductIds.push(productId.replace("dark-", ""));
      else normalProducts.push({ ...p, id: productId });
    }
    if (darkProductIds.length === 0 && normalProducts.length === 0) {
      return res.status(400).json({ success: false, message: "No valid products found" });
    }

    const orderNo = generateUniqueRandomNumber(6);
    const escrowExpiresAt = await getEscrowExpiry();

    // DEDUCT BALANCE
    const newBalance = (originalBalance - amountToDeduct).toFixed(2);
    await updateUserBalance(safeUserId, newBalance);
    await createTransactionHistory(safeUserId, amountToDeduct, "Account Purchased", "Completed");

    // ======================
// PROCESS DARKSHOP PRODUCTS
// ======================
if (darkProductIds.length > 0) {
  // 1️ Get DB prices to check darkBalance
  const dbPrices = await getDarkShopProductPricesbyid(darkProductIds);
  const darkBalanceRes = await getDarkshopBalance(safeUserId);
  const darkBalance = Number(darkBalanceRes?.balance || 0);

  const totalDarkPrice = Object.values(dbPrices).reduce((sum, price) => sum + Number(price), 0);
  if (darkBalance < totalDarkPrice) throw new Error("System error: Insufficient darkshop balance");

  // 2️ Loop through dark products
  for (const productId of darkProductIds) {
    const darkProductInfo = await getDarkShopProductById(productId);

    // Use price from request body for insertion and response
    const productFromBody = products.find(p => p.id.toString() === `dark-${productId}`);
    const priceFromBody = Number(productFromBody?.price || dbPrices[productId]);

    const darkOrder = await createDarkshopOrder({ product: "dark-" + productId, orderNo });

    if (!darkOrder?.success) {
      // REFUND USER
      await updateUserBalance(safeUserId, originalBalance.toFixed(2));
      await createTransactionHistory(safeUserId, amountToDeduct, "Refund for failed order", "Refunded");
      await storeOrderHistory({
        seller_id: SYSTEM_SELLER_ID,
        buyer_id: safeUserId,
        order_no: orderNo,
        order_type: "Refund due to order failure",
        amount: amountToDeduct,
        status: "Completed",
      });

      return res.status(500).json({
        success: false,
        message: `Order failed: ${darkOrder.data?.message || "Unknown error"}. Amount refunded.`,
      });
    }

    // INSERT DARKSHOP ORDER USING PRICE FROM BODY
    await insertDarkShopOrder({
      account_id: productId,
      buyer_id: safeUserId,
      order_no: orderNo,
      title: darkProductInfo?.name || `Darkshop Product #${productId}`,
      platform: darkProductInfo?.category_name || "Darkshop",
      price: priceFromBody, // <-- price from request body
      payment_status: darkOrder.status === "pending" ? "Pending" : "Completed",
      darkshop_order_id: darkOrder.id,
      darkshop_link: darkOrder.link || null,
      darkshop_content: darkOrder.content || null,
    });

    darkProductsResponse.push({
      id: productId,
      title: darkProductInfo?.name,
      platform: darkProductInfo?.category_name,
      price: priceFromBody,
      darkshop_order_id: darkOrder.id,
      darkshop_link: darkOrder.link || null,
      darkshop_content: darkOrder.content || null,
      payment_status: darkOrder.status
    });
  }
}
console.log("Darkshop products processed." , darkProductsResponse);

    // ======================
    // PROCESS NORMAL PRODUCTS
    // ======================
    try {
      for (const p of normalProducts) {
        const product = await getProductDetailsById(p.id);
        if (!product) throw new Error(`Product ${p.id} not found`);

        pendingOrders.push({
          type: "normal",
          data: {
            account_id: product.id,
            seller_id: product.user_id,
            buyer_id: safeUserId,
            order_no: orderNo,
            title: product.title,
            platform: product.platform,
            price: product.price,
            payment_status: "Completed",
            escrow_expires_at: escrowExpiresAt,
            email: product.email || null,
            username: product.username || null,
            password: product.password || null,
            recovery_info: product.recovery_info || null,
            recovery_password: product.recovery_password || null,
            description: product.description || null,
            factor_description: product.factor_description || null,
          },
        });

        pendingEscrow.push({
          seller_id: product.user_id,
          amount: Number(product.price) || 0,
          product_ids: [product.id],
          order_no: orderNo,
        });
      }

      // COMMIT NORMAL ORDERS
      for (const order of pendingOrders) {
        await storeOrder(order.data);
        if (order.type === "normal") await updateAccountStatusById(String(order.data.account_id), "sold");
      }

      // STORE ORDER HISTORY FOR NORMAL PRODUCTS
      for (const p of normalProducts) {
        const product = await getProductDetailsById(p.id);
        if (!product) continue;

        await storeOrderHistory({
          seller_id: product.user_id,
          buyer_id: safeUserId,
          order_no: orderNo,
          order_type: "Account Purchase",
          amount: Number(product.price) || 0,
          status: "Completed",
        });
      }

    } catch (normalError) {
      // REFUND USER if normal product processing fails
      await updateUserBalance(safeUserId, originalBalance.toFixed(2));
      await createTransactionHistory(safeUserId, amountToDeduct, "Refund for failed order", "Refunded");
      await storeOrderHistory({
        seller_id: null,
        buyer_id: safeUserId,
        order_no: generateUniqueRandomNumber(6),
        order_type: "Refund due failure",
        amount: amountToDeduct,
        status: "Completed",
      });

      return res.status(500).json({
        success: false,
        message: normalError.message || " Order failed. Amount refunded.",
      });
    }

    // NON-BLOCKING TASKS
    if (pendingEscrow.length > 0) {
      setTimeout(() => creditEscrow(pendingEscrow).catch(() => {}), 2000);
      taskVerification(safeUserId).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: "Order completed successfully",
      order_no: orderNo,
      totalAmount: amountToDeduct,
      newBalance,
      darkshop_products: darkProductsResponse,
      escrow_expires_at: escrowExpiresAt,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);

    // REFUND USER IF ANY OTHER ERROR OCCURS
    if (safeUserId && originalBalance !== null) {
      await updateUserBalance(safeUserId, originalBalance.toFixed(2));
      await createTransactionHistory(safeUserId, Number(totalAmount), "Refund due to order failure", "Refunded");
      await storeOrderHistory({
        seller_id: null,
        buyer_id: safeUserId,
        order_no: generateUniqueRandomNumber(6),
        order_type: "Refund due to order failure",
        amount: Number(totalAmount),
        status: "Completed",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Order failed",
    });
  }
};

module.exports = { collectOrder };

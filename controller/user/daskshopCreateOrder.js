// controllers/darkshop.controller.js

const { createDarkshopOrder } = require("../../utility/daskshopCreateOrder");

async function createDarkshopOrderController(req, res) {
  try {
    const {
      product,
      quantity,
      promo_code,
      send_email_copy,
      idempotence_id,
    } = req.body;

    const userId = req.user?.uid || req.body.userId;

    // Basic validation
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: user not identified",
      });
    }

    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        error: "Product and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be greater than zero",
      });
    }

    // Call service
    const result = await createDarkshopOrder({
      userId,
      product,
      quantity,
      promo_code,
      send_email_copy,
      idempotence_id,
    });

    if (!result.success) {
      return res.status(result.code || 400).json(result);
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Darkshop order controller error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

module.exports = {
  createDarkshopOrderController,
};

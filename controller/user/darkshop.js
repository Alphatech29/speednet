const {
  getDarkShopOrdersByBuyer,
  getDarkShopOrderByBuyerAndOrderNo,
} = require("../../utility/darkshopProduct");


const fetchDarkshopBuyerOrders = async (req, res) => {
  const { userUid } = req.params;

  try {
    if (!userUid) {
      return res.status(400).json({
        success: false,
        message: "userUid is required",
      });
    }

    const orders = await getDarkShopOrdersByBuyer(userUid);

    return res.status(200).json({
      success: true,
      message: `Fetched ${orders.length} dark shop orders for buyer ${userUid}`,
      data: orders,
    });
  } catch (error) {
    console.error(
      `Error fetching dark shop orders for buyer ${userUid}:`,
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch dark shop orders. Please try again later.",
      error: error.message,
    });
  }
};



const fetchBuyerOrderByOrderNo = async (req, res) => {
  const { buyerId, orderNo } = req.params;

  try {
    const order = await getDarkShopOrderByBuyerAndOrderNo(buyerId, orderNo);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No dark shop order found for buyer ${buyerId} with order_no ${orderNo}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dark shop order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error(
      `Error fetching dark shop order for buyer ${buyerId} with order_no ${orderNo}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Unable to fetch dark shop order. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
  fetchDarkshopBuyerOrders,
  fetchBuyerOrderByOrderNo,
};

const axios = require("axios");
const { getWebSettings } = require("./general");

async function createDarkshopOrder({
  product,
  orderNo,
  quantity,
  send_email_copy = false,
  promo_code,
}) {
  try {
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      return {
        success: false,
        error: "Invalid quantity supplied",
        code: 400,
      };
    }

    const idempotence_id = orderNo;

    console.log("Creating Darkshop order with params:", {
      product,
      quantity,
      send_email_copy,
      idempotence_id,
      promo_code,
    });

    // Extract numeric product ID
    const productId = product.replace("dark-", "");
    console.log("Extracted productId:", productId);

    // Fetch API settings
    const { dark_api_key, dark_base_url } = await getWebSettings();
    console.log("Fetched API settings:", { dark_api_key, dark_base_url });

    const url = `${dark_base_url}/order/create`;

    const params = {
      key: dark_api_key,
      product: productId,
      quantity: Number(quantity), // ✅ strictly from caller
      idempotence_id,
    };

    if (promo_code) params.promo_code = promo_code;
    if (send_email_copy) params.send_email_copy = true;

    console.log("Request URL and params:", url, params);

    const response = await axios.get(url, { params });
    console.log("Response from Darkshop:", response.data);

    if (!response.data.success) {
      return {
        success: false,
        error: response.data.data?.message || "External API failed",
        code: response.data.data?.code,
      };
    }

    const orderData = response.data.data;

    let content = null;

    if (orderData.link) {
      try {
        const contentResponse = await axios.get(orderData.link);
        content = contentResponse.data;
      } catch (fetchErr) {
        console.error("Failed to fetch Darkshop file content:", fetchErr.message);
      }
    }

    return {
      success: true,
      status: orderData.status,
      id: orderData.id,
      link: orderData.link || null,
      content,
      idempotence: orderData.idempotence || false,
      quantity: Number(quantity), // ✅ return exact quantity used
    };

  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    return {
      success: false,
      error: error.message || "Request failed",
      code: error.response?.status || 500,
    };
  }
}


async function getDarkshopBalance() {
  try {
    const { dark_api_key, dark_base_url } = await getWebSettings();
    const balanceUrl = `${dark_base_url}/user/balance`;
    const response = await axios.get(balanceUrl, { params: { key: dark_api_key } });
    console.log("Balance response:", response.data);

    if (!response.data.success) {
      console.error("Failed to fetch balance");
      return { success: false, error: "Could not fetch balance" };
    }

    const { balance, currency } = response.data.data;
    console.log("Darkshop balance fetched:", balance, currency);

    return { success: true, balance, currency };
  } catch (error) {
    console.error("Error fetching balance:", error.response?.data || error.message);
    return {
      success: false,
      error: error.message || "Request failed",
      code: error.response?.status || 500,
    };
  }
}


async function getDarkshopOrderStatus(orderId) {
  try {
    const { dark_api_key, dark_base_url } = await getWebSettings();
    const url = `${dark_base_url}/order/status`;

    const response = await axios.get(url, { params: { key: dark_api_key, id: orderId } });
    console.log(`Order status response for ${orderId}:`, response.data);

    if (!response.data.success) {
      return {
        success: false,
        error: response.data.data?.message || "Failed to fetch order status",
        code: response.data.data?.code,
      };
    }

    const status = response.data.data.status;

    let content = null;
    let link = null;

    if (status === "completed") {
      // Download file content
      try {
        const downloadResponse = await axios.get(`${dark_base_url}/order/download`, {
          params: { key: dark_api_key, id: orderId },
        });

        if (downloadResponse.data.success) {
          link = downloadResponse.data.data.link;
          const fileResponse = await axios.get(link);
          content = fileResponse.data;
        }
      } catch (downloadErr) {
        console.error("Failed to download order content:", downloadErr.message);
      }
    }

    return { success: true, status, link, content };
  } catch (error) {
    console.error(`Error fetching order status for ${orderId}:`, error.message);
    return { success: false, error: error.message };
  }
}




module.exports = { createDarkshopOrder, getDarkshopBalance, getDarkshopOrderStatus };

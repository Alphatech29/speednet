const { getCountries, getServicesByCountry, postOrderSMS, getBalance } = require("../../utility/smspool");
const { getUserDetailsByUid, updateUserBalance } = require("../../utility/userInfo");
const { createTransactionHistory, createSmsServiceRecord } = require("../../utility/history");
const { getWebSettings } = require("../../utility/general");
const { smspoolRefund } = require("../../utility/smspoolRefund");

const resolveOrderError = (type) => {
  if (type === "NO_NUMBERS") return "No numbers available for this service right now. Try a different country or service.";
  if (type === "WRONG_SERVICE") return "Invalid service selected. Please try again.";
  if (type === "WRONG_COUNTRY") return "Invalid country selected. Please try again.";
  if (type === "NO_BALANCE") return "System error. Please contact support.";
  if (type === "BAD_KEY") return "System configuration error. Please contact support.";
  if (type === "ERROR_SQL") return "Service temporarily unavailable. Please try again later.";
  return "Failed to place order. Please try a different service or try again later.";
};

const getCountriesController = async (req, res) => {
  console.log("[getCountries] Request received");
  try {
    const countries = await getCountries();
    console.log(`[getCountries] Fetched ${Array.isArray(countries) ? countries.length : "?"} countries`);
    res.status(200).json({ success: true, data: countries });
  } catch (error) {
    console.error("[getCountries] Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to fetch countries", error: error.response?.data || error.message });
  }
};

const getServicesByCountryController = async (req, res) => {
  const { countryId } = req.params;
  console.log(`[getServicesByCountry] Request received — countryId: ${countryId}`);
  try {
    const services = await getServicesByCountry(countryId);
    console.log(`[getServicesByCountry] Fetched ${Array.isArray(services) ? services.length : "?"} services for country ${countryId}`);
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error(`[getServicesByCountry] Error for country ${countryId}:`, error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch services and prices for country ${countryId}`,
      error: error.response?.data || error.message
    });
  }
};

const orderSMSController = async (req, res) => {
  console.log("[orderSMS] Request received — body:", req.body);

  try {
    const userId = req.user?.userId;
    if (!userId) {
      console.warn("[orderSMS] Unauthorized — no userId on request");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    console.log(`[orderSMS] userId: ${userId}`);

    let { country, service, price } = req.body;
    country = Number(country);
    price = parseFloat(price);
    console.log(`[orderSMS] Parsed params — country: ${country}, service: ${service}, price: ${price}`);

    if (isNaN(country) || !service || isNaN(price)) {
      console.warn("[orderSMS] Validation failed — invalid params:", { country, service, price });
      return res.status(400).json({ success: false, message: "Country, Service, and Price are required" });
    }

    // Get user details
    const user = await getUserDetailsByUid(userId);
    if (!user) {
      console.warn(`[orderSMS] User not found — userId: ${userId}`);
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(`[orderSMS] User found — balance: ${user.account_balance}`);

    const settings = await getWebSettings();
    const onlinesimRate = parseFloat(settings?.onlinesim_rate) || 0;
    const adjustedPrice = onlinesimRate > 0 ? price / (1 + onlinesimRate / 100) : price;
    console.log(`[orderSMS] Rate: ${onlinesimRate}% — user pays: ${price}, API cost (adjustedPrice): ${adjustedPrice}`);

    if (parseFloat(user.account_balance) < price) {
      console.warn(`[orderSMS] Insufficient balance — user has ${user.account_balance}, needs ${price}`);
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    const smsPoolBalance = await getBalance();
    console.log(`[orderSMS] SMSPool balance: ${smsPoolBalance}, adjustedPrice: ${adjustedPrice}`);
    if (smsPoolBalance < adjustedPrice) {
      console.warn(`[orderSMS] SMSPool balance too low — pool: ${smsPoolBalance}, needed: ${adjustedPrice}`);
      return res.status(400).json({ success: false, message: "System error: SMS pool balance insufficient" });
    }

    // Place SMS order
    console.log(`[orderSMS] Placing order — country: ${country}, service: ${service}`);
    const orderResult = await postOrderSMS({ country, service });
    console.log("[orderSMS] Order result from API:", JSON.stringify(orderResult, null, 2));

    if (!orderResult?.order?.success) {
      const errorType = orderResult?.order?.type || orderResult?.order?.message || "UNKNOWN";
      console.error(`[orderSMS] Order failed — type: ${errorType}`);
      const userMessage = resolveOrderError(errorType);
      const statusCode = errorType === "NO_NUMBERS" ? 503 : 500;
      return res.status(statusCode).json({ success: false, message: userMessage, type: errorType });
    }
    console.log(`[orderSMS] Order placed successfully — orderId: ${orderResult.order.order_id || orderResult.order.orderid}, number: ${orderResult.order.number}`);

    // Deduct user balance
    const newBalance = parseFloat(user.account_balance) - price;
    console.log(`[orderSMS] Deducting balance — old: ${user.account_balance}, deducted: ${price}, new: ${newBalance}`);
    await updateUserBalance(userId, newBalance);
    console.log(`[orderSMS] Balance updated for userId: ${userId}`);

    // Create transaction history
    await createTransactionHistory(userId, price, "Purchased SMS service", "completed");
    console.log(`[orderSMS] Transaction history created — userId: ${userId}, amount: ${price}`);

    // Resolve country name and service name for DB storage
    const [allCountries, allServices] = await Promise.all([
      getCountries(),
      getServicesByCountry(country),
    ]);
    const countryName = allCountries.find((c) => String(c.ID) === String(orderResult.order.country))?.name || String(orderResult.order.country);
    const serviceName = allServices.find((s) => s.code === service)?.name || service;

    // Prepare SMS record
    const smsRecord = {
      user_id: userId,
      country: countryName,
      service: serviceName,
      number: orderResult.order.number,
      orderid: orderResult.order.orderid,
      status: 0,
      time: orderResult.order.expiration,
      amount: parseFloat(price),
    };
    console.log("[orderSMS] Prepared SMS record:", smsRecord);

    // Store SMS order in DB
    const dbResult = await createSmsServiceRecord(smsRecord);
    console.log("[orderSMS] DB insert result:", dbResult);

    if (!dbResult.success) {
      console.error("[orderSMS] Failed to store SMS record:", dbResult.message);
      return res.status(500).json({ success: false, message: "Failed to save SMS order record" });
    }
    console.log(`[orderSMS] SMS record saved — insertId: ${dbResult.insertId}`);

    // Fire-and-forget refund watcher
    console.log(`[orderSMS] Starting refund watcher — orderId: ${smsRecord.orderid}, expiry: ${smsRecord.time}`);
    smspoolRefund(smsRecord.time, smsRecord.orderid).catch((err) =>
      console.error("[orderSMS] Refund watcher error for order", smsRecord.orderid, ":", err.message)
    );

    console.log(`[orderSMS] Order complete — userId: ${userId}, orderId: ${smsRecord.orderid}, newBalance: ${newBalance}`);
    return res.status(200).json({
      success: true,
      order: orderResult.order,
      userBalance: newBalance,
      smsRecordId: dbResult.insertId,
    });
  } catch (error) {
    console.error("[orderSMS] Unhandled error:", error.response?.data || error.message, error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCountriesController,
  getServicesByCountryController,
  orderSMSController
};

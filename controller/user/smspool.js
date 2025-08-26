const { getCountries, getServicesByCountry, postOrderSMS, getBalance } = require("../../utility/smspool");
const { getUserDetailsByUid, updateUserBalance } = require("../../utility/userInfo");
const { createTransactionHistory, createSmsServiceRecord } = require("../../utility/history");
const { getWebSettings } = require("../../utility/general");
const { smspoolRefund } = require("../../utility/smspoolRefund");

const getCountriesController = async (req, res) => {
  try {
    const countries = await getCountries();
    res.status(200).json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch countries", error: error.response?.data || error.message });
  }
};

const getServicesByCountryController = async (req, res) => {
  try {
    const { countryId } = req.params;
    const services = await getServicesByCountry(countryId);
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch services and prices for country ${req.params.countryId}`,
      error: error.response?.data || error.message
    });
  }
};

const orderSMSController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    let { country, service, price } = req.body;
    country = Number(country);
    service = Number(service);
    price = parseFloat(price);

    if (isNaN(country) || isNaN(service) || isNaN(price)) {
      return res.status(400).json({ success: false, message: "Country, Service, and Price must be valid numbers" });
    }

    // Get user details
    const user = await getUserDetailsByUid(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const settings = await getWebSettings();
    const onlinesimRate = parseFloat(settings?.onlinesim_rate) || 0;
    const adjustedPrice = onlinesimRate > 0 ? price - (price * onlinesimRate) / 100 : price;

    if (parseFloat(user.account_balance) < price) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    const smsPoolBalance = await getBalance();
    if (smsPoolBalance < adjustedPrice) {
      return res.status(400).json({ success: false, message: "System error: SMS pool balance insufficient" });
    }

    // Place SMS order
    const orderResult = await postOrderSMS({ country, service, max_price: adjustedPrice });
    console.log("SMS order result:", orderResult);

    if (!orderResult?.order?.success) {
      return res.status(500).json({ success: false, message: "SMS order failed" });
    }

    // Deduct user balance
    const newBalance = parseFloat(user.account_balance) - price;
    await updateUserBalance(userId, newBalance);

    // Create transaction history
    await createTransactionHistory(userId, price, "Purchased SMS service", "completed");

    // Prepare SMS record
    const smsRecord = {
      user_id: userId,
      country: orderResult.order.country,
      service: orderResult.order.service,
      number: orderResult.order.number,
      orderid: orderResult.order.order_id || orderResult.order.orderid,
      status: 0,
      time: orderResult.order.expiration,
      amount: parseFloat(price),
    };

    console.log("Storing SMS record:", smsRecord);

    // Store SMS order in DB
    const dbResult = await createSmsServiceRecord(smsRecord);

    if (!dbResult.success) {
      console.error("Failed to store SMS record:", dbResult.message);
      return res.status(500).json({ success: false, message: "Failed to save SMS order record" });
    }

    //  Just pass time and orderid
    smspoolRefund(smsRecord.time, smsRecord.orderid);

    return res.status(200).json({
      success: true,
      order: orderResult.order,
      userBalance: newBalance,
      smsRecordId: dbResult.insertId,
    });
  } catch (error) {
    console.error("Error creating SMS order:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCountriesController,
  getServicesByCountryController,
  orderSMSController
};

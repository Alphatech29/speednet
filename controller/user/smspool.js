const { getCountries, getServicesByCountry, postOrderSMS, getBalance } = require("../../utility/smspool");
const { getUserDetailsByUid, updateUserBalance } = require("../../utility/userInfo");
const { createTransactionHistory } = require("../../utility/history");
const { getWebSettings } = require("../../utility/general");

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
    let { country, service, price } = req.body;

    // Ensure country and service are numbers
    country = Number(country);
    service = Number(service);

    if (isNaN(country) || isNaN(service)) {
      return res.status(400).json({ success: false, message: "Country and Service must be valid numbers" });
    }

    console.log("Request body:", { country, service, price });
    console.log("User ID from token:", userId);
    console.log("Service ID to use:", service);

    // 1. Get user details
    const user = await getUserDetailsByUid(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    console.log("Fetched user details:", user);

    // 2. Apply onlinesim_rate deduction from price
    const settings = await getWebSettings();
    const onlinesimRate = parseFloat(settings?.onlinesim_rate) || 0;
    const adjustedPrice = onlinesimRate > 0 ? price - (price * onlinesimRate) / 100 : price;

    console.log("Original price:", price, "Onlinesim rate:", onlinesimRate, "Adjusted price:", adjustedPrice);
    console.log("User balance:", parseFloat(user.account_balance));
    
    // 3. Check user balance
    if (parseFloat(user.account_balance) < price) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // 4. Check SMSPool balance
    const smsPoolBalance = await getBalance();
    console.log("SMSPool balance:", smsPoolBalance);

    if (smsPoolBalance < adjustedPrice) {
      return res.status(400).json({ success: false, message: "System error" });
    }

    // 5. Place SMS order
    console.log("Placing SMS order...");
    const orderResult = await postOrderSMS({
      country,
      service,
      max_price: adjustedPrice,
    });

    console.log("Order result:", orderResult);

    // 6. Deduct user balance
    const newBalance = parseFloat(user.account_balance) - price;
    await updateUserBalance(userId, newBalance);

    // 7. Create transaction history
    await createTransactionHistory(
      userId,                         
      price,                           
      "Purchased SMS service",
      "completed",
    );

    return res.status(200).json({
      success: true,
      order: orderResult.order,
      userBalance: newBalance,
      smsPoolBalance,
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

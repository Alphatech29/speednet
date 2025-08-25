const { updateSmsServiceRecord } = require("./history");

async function smspoolWebhook(req, res) {
  try {
    const data = req.body;

    console.log(" Incoming SMSPool Webhook Payload:", data);


    const updateResult = await updateSmsServiceRecord(
      data.orderid,
      data.sms,
      1
    );

    if (!updateResult.success) {
      console.warn(` Could not update sms_service for order "${data.orderid}":`, updateResult.message);
      return res.status(400).json(updateResult);
    }

    console.log(`sms_service updated for order "${data.orderid}".`);
    return res.status(200).json({ success: true, message: "Record updated" });
  } catch (error) {
    console.error(" Error handling SMSPool webhook:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { smspoolWebhook };

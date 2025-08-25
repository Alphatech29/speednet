const transporterPromise = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendMerchantActivationEmail = async (user, activationInfo) => {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo
    } = await getWebSettings();

    const templatePath = path.join(process.cwd(), "email", "templates", "merchant_activation.ejs");

    const html = await ejs.renderFile(templatePath, {
      user,
      site_name,
      support_email,
      web_url,
      logo,
      amount: activationInfo.amount,
      reference: activationInfo.reference,
      currencySymbol: activationInfo.currencySymbol || "$",
      date: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    });

    const transporter = await transporterPromise; // ✅ Await the transporter

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: user.email,
      subject: `Merchant Activation Successful on ${site_name}`,
      html
    };

    const info = await transporter.sendMail(mailOptions); // ✅ Await sendMail
    logger.info("Merchant activation email sent:", info.response);

  } catch (err) {
    logger.error("sendMerchantActivationEmail error:", err);
    console.error("Stack trace:", err.stack);
  }
};

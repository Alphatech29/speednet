const transporterPromise = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

module.exports = async function sendApiExpiryAlertToAdmin({ api, type }) {
  try {
    const { site_name, support_email, web_url, logo, admin_alert_email } = await getWebSettings();

    const templateFile = type === "expired" ? "apiAlreadyExpired.ejs" : "aboutToExpire.ejs";

    const templatePath = path.join(process.cwd(), "email", "templates", templateFile);

    const html = await ejs.renderFile(templatePath, {
      api,
      type,
      site_name,
      support_email,
      web_url,
      logo,
    });

    const transporter = await transporterPromise;

    const subject =
      type === "expired"
        ? `URGENT: ${api.name} API Subscription Has Expired`
        : `Alert: ${api.name} API Subscription Will Expire Soon`;

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: admin_alert_email,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("API expiry alert sent to admin:", info.response);
  } catch (err) {
    logger.error("sendApiExpiryAlertToAdmin error:", err);
    console.error("Stack trace:", err.stack);
  }
};

const transporterPromise = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendLowNordBalanceAlertEmailToAdmin = async ({ balance, currencySymbol }) => {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo,
      admin_alert_email
    } = await getWebSettings();

    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "nordAdminBalance.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      balance,
      currencySymbol: currencySymbol || "$",
      threshold: "200",
      site_name,
      support_email,
      web_url,
      logo,
      date: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      year: new Date().getFullYear()
    });

    const transporter = await transporterPromise;

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: admin_alert_email,
      subject: `Low Nord Balance Alert on ${site_name}`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("Low Nord balance alert sent to admin:", info.response);
  } catch (err) {
    logger.error("sendLowNordBalanceAlertEmailToAdmin error:", err);
    console.error("Stack trace:", err.stack);
  }
};

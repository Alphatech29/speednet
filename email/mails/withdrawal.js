const transporterPromise = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendWithdrawalNotificationEmail = async (user, withdrawalInfo) => {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo
    } = await getWebSettings();

    const templatePath = path.join(process.cwd(), "email", "templates", "withdrawal.ejs");

    const html = await ejs.renderFile(templatePath, {
      user,
      site_name,
      support_email,
      web_url,
      logo,
      amount: withdrawalInfo.amount,
      method: withdrawalInfo.method,
      reference: withdrawalInfo.reference,
      currencySymbol: withdrawalInfo.currencySymbol || "$",
      date: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    });

    const transporter = await transporterPromise; // ✅ Await the promise

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: user.email,
      subject: `Withdrawal Requested on ${site_name}`,
      html
    };

    const info = await transporter.sendMail(mailOptions); // ✅ Use async/await
    logger.info("Withdrawal notification email sent:", info.response);

  } catch (err) {
    logger.error("sendWithdrawalNotificationEmail error:", {
      message: err.message,
      stack: err.stack,
    });
    console.error("Stack trace:", err.stack);
  }
};

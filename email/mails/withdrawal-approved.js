const transporter = require("../transporter/transporter");
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

    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "withdrawal-approved.ejs"
    );

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

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: user.email,
      subject: `Your Withdrawal Has Been Approved – ${site_name}`,
      html
    };

    // Use async/await for sendMail
    const info = await transporter.sendMail(mailOptions);
    logger.info("Withdrawal approval email sent:", info.response);

  } catch (err) {
    logger.error("sendWithdrawalNotificationEmail error:", {
      message: err.message,
      stack: err.stack,
    });
  }
};

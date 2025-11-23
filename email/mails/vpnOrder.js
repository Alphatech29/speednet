const transporterPromise = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendVpnOrderPendingEmail = async (user, orderInfo) => {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo
    } = await getWebSettings();

    // Email template path
    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "vpnOrder.ejs"
    );

    // Format date nicely
const formattedDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
}).format(new Date());


    // Render the HTML using EJS
    const html = await ejs.renderFile(templatePath, {
      user,
      site_name,
      support_email,
      web_url,
      logo,
      amount: orderInfo.amount,
      currencySymbol: orderInfo.currencySymbol || "$",
      vpn_plan: orderInfo.vpn_plan,
      reference: orderInfo.reference,
      date: formattedDate
    });

    const transporter = await transporterPromise;

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: user.email,
      subject: `Your VPN Order is Pending Activation – ${site_name}`,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info("VPN order pending activation email sent:", info.response);

  } catch (err) {
    logger.error("sendVpnOrderPendingEmail error:", err);
    console.error("Stack Trace:", err.stack);
  }
};

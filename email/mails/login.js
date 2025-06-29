const transporter = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendLoginNotificationEmail = async (user, ip_address = "Unknown", device_info = "Unknown") => {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo
    } = await getWebSettings();

    const templatePath = path.join(process.cwd(), "email", "templates", "login.ejs");

    const html = await ejs.renderFile(templatePath, {
      user,
      site_name,
      support_email,
      web_url,
      logo,
      ip_address,
      device_info
    });

    const mailOptions = {
      from: `"${site_name}" <${ support_email}>`,
      to: user.email,
      subject: `New Login Detected on ${site_name}`,
      html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error("Error sending login notification email:", error);
        return;
      }
      logger.info("Login notification email sent:", info.response);
    });

  } catch (err) {
    logger.error("sendLoginNotificationEmail error:", err);
    console.error("Stack trace:", err.stack);
  }
};

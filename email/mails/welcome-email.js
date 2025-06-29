const transporter = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendWelcomeEmail = async (user) => {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo
    } = await getWebSettings();

    const templatePath = path.join(process.cwd(), "email", "templates", "welcome-email.ejs");

    const html = await ejs.renderFile(templatePath, {
      user,
      site_name,
      support_email,
      web_url,
      logo
    });

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: user.email,
      subject: `Welcome to ${site_name}!`,
      html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error("Error sending welcome email:", error);
        return;
      }
      logger.info("Welcome email sent:", info.response);
    });

  } catch (err) {
    logger.error("sendWelcomeEmail error:", err);
  }
};

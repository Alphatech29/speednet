const transporterPromise = require("../transporter/transporter");
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

    const transporter = await transporterPromise; // ✅ Await the async transporter

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: user.email,
      subject: `Welcome to ${site_name}!`,
      html
    };

    const info = await transporter.sendMail(mailOptions); // ✅ Await sendMail
    logger.info("Welcome email sent:", info.response);

  } catch (err) {
    logger.error("sendWelcomeEmail error:", err);
  }
};

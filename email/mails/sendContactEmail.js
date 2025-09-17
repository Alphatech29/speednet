const transporterPromise = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

async function sendContactEmail({ email, subject, message }) {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo
    } = await getWebSettings();

    const transporter = await transporterPromise;

    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "contactEmail.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      email,
      subject,
      message,
      site_name,
      support_email,
      web_url,
      logo
    });

    const mailOptions = {
      from: `"${site_name} Support" <${support_email}>`,
      to: support_email,
      replyTo: email,
      subject: subject || `New Contact Message from ${email}`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("sendContactEmail error:", err);
    console.error("Stack trace:", err.stack);
  }
}

module.exports = sendContactEmail;

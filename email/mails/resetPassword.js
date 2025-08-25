const transporterPromise = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendResetPasswordEmail = async (email, full_name, resetLink) => {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo
    } = await getWebSettings();

    const user = {
      full_name: typeof email === "string" ? (full_name || email.split("@")[0]) : full_name || "User",
      email,
    };

    const templatePath = path.join(process.cwd(), "email", "templates", "resetPassword.ejs");

    const html = await ejs.renderFile(templatePath, {
      user,
      resetLink,
      site_name,
      support_email,
      web_url,
      logo
    });

    const transporter = await transporterPromise; // ✅ Await the resolved transporter

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: user.email,
      subject: `Reset Your Password on ${site_name}`,
      html
    };

    console.log("📤 Mail Options:", mailOptions);

    const info = await transporter.sendMail(mailOptions); // ✅ Await the sendMail call
    logger.info("Reset password email sent:", info.response);

  } catch (err) {
    logger.error("sendResetPasswordEmail error:", err.message || err);
    console.error("Stack trace:", err.stack);
  }
};

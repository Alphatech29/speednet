const transporter = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendResetPasswordEmail = async (email, full_name, resetLink) => {
  try {
    console.log("🔧 sendResetPasswordEmail CALLED");
    console.log("🟡 Email:", email);
    console.log("🟡 Full Name:", full_name);
    console.log("🟡 Reset Link:", resetLink);

    const {
      site_name,
       support_email,
      web_url,
      logo
    } = await getWebSettings();

    console.log("✅ Web settings loaded:", {
      site_name,
      support_email,
      web_url,
      logo,
    });

    const user = {
      full_name: typeof email === "string" ? (full_name || email.split("@")[0]) : full_name || "User",
      email,
    };

    const templatePath = path.join(process.cwd(), "email", "templates", "resetPassword.ejs");
    console.log("📁 Template path:", templatePath);

    const html = await ejs.renderFile(templatePath, {
      user,
      resetLink,
      site_name,
       support_email,
      web_url,
      logo
    });

    console.log("📄 Compiled EJS HTML:");
    console.log(html);

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: user.email,
      subject: `Reset Your Password on ${site_name}`,
      html
    };

    console.log("📤 Mail Options:", mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error("❌ Error sending reset password email:", error.message || error);
        console.error("❌ Full transporter error:", error);
        return;
      }

      logger.info("✅ Reset password email sent:", info.response);
      console.log("✅ Email sent successfully:", info.response);
    });

  } catch (err) {
    logger.error("❌ sendResetPasswordEmail error:", err.message || err);
    console.error("❌ Stack trace:", err.stack);
  }
};

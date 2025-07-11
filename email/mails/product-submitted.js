const transporterPromise = require("../transporter/transporter");
const ejs = require("ejs");
const path = require("path");
const { getWebSettings } = require("../../utility/general");
const logger = require("../../utility/logger");

exports.sendProductSubmissionEmailToAdmin = async (merchant, product) => {
  try {
    const {
      site_name,
      support_email,
      web_url,
      logo,
      admin_alert_email
    } = await getWebSettings();

    const templatePath = path.join(process.cwd(), "email", "templates", "product-submitted.ejs");

    const html = await ejs.renderFile(templatePath, {
      merchant,
      product: {
        name: product.name,
        title: product.title,
        price: product.price,
        currencySymbol: product.currencySymbol || '₦'
      },
      site_name,
      support_email,
      web_url,
      logo,
      date: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      year: new Date().getFullYear()
    });

    const transporter = await transporterPromise; // ✅ Await the transporter

    const mailOptions = {
      from: `"${site_name}" <${support_email}>`,
      to: admin_alert_email,
      subject: `New Product Submission on ${site_name}`,
      html
    };

    const info = await transporter.sendMail(mailOptions); // ✅ Await sendMail
    logger.info("Product submission email sent to admin:", info.response);

  } catch (err) {
    logger.error("sendProductSubmissionEmailToAdmin error:", err);
    console.error("Stack trace:", err.stack);
  }
};

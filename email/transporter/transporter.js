const nodemailer = require("nodemailer");
const logger = require("../../utility/logger");
const { getWebSettings } = require("../../utility/general");

let transporterPromise = (async () => {
  try {
    const settings = await getWebSettings();

    const transporter = nodemailer.createTransport({
      service: settings.smtp_service,
      port: settings.smtp_port,
      secure: true,
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter connection
    await transporter.verify();
    logger.info("Transporter is ready to send emails");
    console.log("Transporter is ready to send emails");
    return transporter;
  } catch (error) {
    logger.error(`Failed to setup transporter: ${error.message}`);
    throw error;
  }
})();

module.exports = transporterPromise;

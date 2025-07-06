const nodemailer = require("nodemailer");
const logger = require("../../utility/logger");
const { getWebSettings } = require("../../utility/general");
const deasync = require("deasync");

let transporter;
let done = false;
let error = null;

(async () => {
  try {
    const settings = await getWebSettings();

    transporter = nodemailer.createTransport({
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

    transporter.verify((err) => {
      if (err) {
        logger.error(`Transporter verify error: ${err.message}`);
        error = err;
      } else {
        logger.info("Transporter is ready to send emails");
        console.log("Transporter is ready to send emails");
      }
      done = true;
    });
  } catch (err) {
    error = err;
    logger.error(`Failed to setup transporter: ${err.message}`);
    console.error(`Failed to setup transporter: ${err.message}`);
    done = true;
  }
})();

//  Block here until async function is done
while (!done) {
  deasync.runLoopOnce();
}

if (error) throw error;

module.exports = transporter;

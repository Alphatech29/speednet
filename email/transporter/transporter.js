const nodemailer = require("nodemailer");
const logger = require("../../utility/logger");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: 'alphatechmultimedia@gmail.com',
    pass: 'Newsline2470$'
  }
});

// Verify the transporter
transporter.verify((error, success) => {
  if (error) {
    logger.error(`Error configuring Gmail transporter: ${error.message}`);
  } else {
    logger.info('Gmail transporter is ready to send emails');
  }
});

module.exports = transporter;

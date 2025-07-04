const nodemailer = require("nodemailer");
const logger = require("../../utility/logger");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  auth: {
    user: 'afrovilla01@gmail.com',
    pass: 'lzzx fuqi oznb wigx'
  },
  tls: {
    rejectUnauthorized: false
  },
});

// Verify the transporter
transporter.verify((error, success) => {
  if (error) {
    console.error(`Error configuring Gmail transporter: ${error.message}`);
  } else {
    console.log('Gmail transporter is ready to send emails');
  }
});

module.exports = transporter;

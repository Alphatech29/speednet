const sendContactEmail = require("../../email/mails/sendContactEmail");
const monitor = require("../../utility/monitor");

const contact = async (req, res) => {
  try {
    console.log("Incoming contact form data:", req.body);

    const { email, subject, message } = req.body;

    await sendContactEmail({ email, subject, message });

    monitor.info("Contact form submitted", { email, subject });
    return res.status(200).json({
      success: true,
      message: "Thank you for contacting us. Your message has been received, and our support team will get back to you shortly.",
      data: { email, subject, message },
    });

  } catch (err) {
    monitor.error("Contact form submission crashed", { stack: err.stack, message: err.message });
    console.error("Error submitting contact form:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = { contact };

import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { MdOutlinePhoneAndroid, MdEmail, MdLocationOn } from "react-icons/md";
import { RiTelegramLine } from "react-icons/ri";
import { BsChatDots } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import { GlobalContext } from "../../components/control/globalContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ContactUs = () => {
  const { webSettings } = useContext(GlobalContext);

  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch("/general/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setServerResponse({ success: true, message: data.message });
        setFormData({ email: "", subject: "", message: "" });
        setTimeout(() => setServerResponse(null), 5000);
      } else {
        setServerResponse({ success: false, message: data.message || "Unknown error occurred" });
      }
    } catch (error) {
      setServerResponse({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MdOutlinePhoneAndroid size={22} className="text-primary-600" />,
      label: "Phone",
      value: webSettings?.contact_number,
      href: webSettings?.contact_number ? `tel:${webSettings.contact_number}` : null,
    },
    {
      icon: <MdEmail size={22} className="text-primary-600" />,
      label: "Email",
      value: webSettings?.support_email,
      href: webSettings?.support_email ? `mailto:${webSettings.support_email}` : null,
    },
    {
      icon: <MdLocationOn size={22} className="text-primary-600" />,
      label: "Office",
      value: webSettings?.address,
      href: null,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-pay pt-28 pb-16 px-5 pc:px-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>
        <motion.div
          className="relative max-w-2xl mx-auto text-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block bg-primary-600/10 text-primary-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-primary-600/20">
            Get In Touch
          </span>
          <h1 className="text-3xl tab:text-4xl pc:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            We'd love to hear from you
          </h1>
          <p className="text-gray-500 text-base pc:text-lg">
            Have a question, issue, or feedback? Reach out and our team will get back to you promptly.
          </p>
        </motion.div>
      </section>

      {/* Main Contact Section */}
      <section className="bg-white px-5 pc:px-20 py-16 pc:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 tab:grid-cols-2 gap-10">

          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">Send a message</h2>
            <p className="text-sm text-gray-500 mb-6">We typically respond within a few hours.</p>

            {serverResponse && (
              <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${
                serverResponse.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {serverResponse.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    className={`peer w-full border rounded-xl px-4 pt-6 pb-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:border-primary-600 focus:ring-primary-600/30"
                    }`}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 top-2 text-[11px] text-primary-600 font-medium transition-all
                      peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal
                      peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary-600 peer-focus:font-medium"
                  >
                    Email Address
                  </label>
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div>
                <div className="relative">
                  <input
                    id="subject"
                    type="text"
                    placeholder=" "
                    value={formData.subject}
                    onChange={handleChange}
                    className={`peer w-full border rounded-xl px-4 pt-6 pb-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.subject
                        ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:border-primary-600 focus:ring-primary-600/30"
                    }`}
                  />
                  <label
                    htmlFor="subject"
                    className="absolute left-4 top-2 text-[11px] text-primary-600 font-medium transition-all
                      peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal
                      peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary-600 peer-focus:font-medium"
                  >
                    Subject
                  </label>
                </div>
                {errors.subject && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <div className="relative">
                  <textarea
                    id="message"
                    rows={5}
                    placeholder=" "
                    value={formData.message}
                    onChange={handleChange}
                    className={`peer w-full border rounded-xl px-4 pt-6 pb-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 transition-all duration-200 resize-none ${
                      errors.message
                        ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:border-primary-600 focus:ring-primary-600/30"
                    }`}
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-2 text-[11px] text-primary-600 font-medium transition-all
                      peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal
                      peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary-600 peer-focus:font-medium"
                  >
                    Message
                  </label>
                </div>
                {errors.message && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-orange-200/50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <FaArrowRight size={13} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* Info Cards */}
            <div className="flex flex-col gap-4">
              {contactInfo.map(({ icon, label, value, href }) =>
                value ? (
                  <div
                    key={label}
                    className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:border-primary-600/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-gray-800 hover:text-primary-600 transition-colors break-all">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-gray-800">{value}</p>
                      )}
                    </div>
                  </div>
                ) : null
              )}
            </div>

            {/* Live Chat + Telegram */}
            <div className="grid grid-cols-1 tab:grid-cols-2 gap-4">
              <a
                href="https://t.me/bobcarly888"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center bg-primary-600/8 hover:bg-primary-600/15 border border-primary-600/20 hover:border-primary-600/40 p-6 rounded-2xl transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-600/15 flex items-center justify-center mb-3 group-hover:bg-primary-600/25 transition-colors">
                  <BsChatDots className="text-primary-600 text-xl" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-xs text-gray-500">Instant support from our team</p>
              </a>

              <a
                href="https://t.me/speednettechnology"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center bg-primary-600/8 hover:bg-primary-600/15 border border-primary-600/20 hover:border-primary-600/40 p-6 rounded-2xl transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-600/15 flex items-center justify-center mb-3 group-hover:bg-primary-600/25 transition-colors">
                  <RiTelegramLine className="text-primary-600 text-xl" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Telegram Group</h3>
                <p className="text-xs text-gray-500">Join our community</p>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;

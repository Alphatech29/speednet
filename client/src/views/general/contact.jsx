import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Button, TextInput, Textarea } from "flowbite-react";
import {
  MdOutlinePhoneAndroid,
  MdEmail,
  MdLocationOn,
} from "react-icons/md";
import { TbSocial } from "react-icons/tb";
import { RiTelegramLine } from "react-icons/ri";
import { BsChatDots } from "react-icons/bs";
import { GlobalContext } from "../../components/control/globalContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ContactUs = () => {
  const { webSettings } = useContext(GlobalContext);

  // form state
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Enter a valid email";
    }
    if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    return tempErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await fetch("/general/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setServerResponse({ success: true, message: data.message });
          setFormData({ name: "", email: "", subject: "", message: "" });

          setTimeout(() => setServerResponse(null), 4000);
        } else {
          setServerResponse({
            success: false,
            message: data.message || "Unknown error occurred",
          });
        }
      } catch (error) {
        setServerResponse({ success: false, message: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="mobile:px-5 pc:px-20 bg-yellow-50">
        <div className="flex flex-col justify-center items-center text-center py-20">
          <motion.div
            className="mobile:w-full pc:w-2/3"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="mobile:text-[27px] pc:text-[3rem] font-bold text-gray-800">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mt-3">
              We’d love to hear from you! Reach out for inquiries, support, or feedback.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mobile:px-6 pc:px-20 py-16 bg-primary-600/5">
        <div className="grid grid-cols-1 tab:grid-cols-2 gap-12 ">
          
          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-md p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send us a Message
            </h2>

            {serverResponse && (
              <p
                className={`mb-4 ${
                  serverResponse.success ? "text-green-600 bg-green-200 rounded-md p-3" : "text-red-600"
                }`}
              >
                {serverResponse.message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div>
                <TextInput
                  id="subject"
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
              </div>

              <div>
                <Textarea
                  id="message"
                  placeholder="Write your message..."
                  rows={7}
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-pay mt-2 rounded-md border-0"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center gap-8 bg-white rounded-2xl shadow-md p-8"
          >
            <div className="flex items-center gap-4">
              <MdOutlinePhoneAndroid className="text-[32px] text-primary-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Phone</h4>
                <p className="text-gray-600">{webSettings?.contact_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MdEmail className="text-[32px] text-primary-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Email</h4>
                <p className="text-gray-600">{webSettings?.support_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MdLocationOn className="text-[32px] text-primary-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Office</h4>
                <p className="text-gray-600">{webSettings?.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <TbSocial className="text-[32px] text-primary-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Social</h4>
                <p className="text-gray-600">Twitter, Instagram, Facebook</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live Chat + Telegram Section */}
      <motion.div
        className="px-6 pc:px-20 py-20 bg-white border-t border-yellow-800/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="grid grid-cols-1 tab:grid-cols-2 gap-10">
          {/* Live Chat */}
          <div className="bg-primary-600/10 p-8 rounded-2xl text-center shadow-md">
            <BsChatDots className="text-[42px] text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Live Chat</h3>
            <p className="text-gray-600 mt-2">
              Need instant help? Start a live chat with our support team.
            </p>
            <a
              href="https://t.me/bobcarly888"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-primary-600 text-pay mt-5 rounded-md border-0">
                Start Live Chat
              </Button>
            </a>
          </div>

          {/* Telegram */}
          <div className="bg-primary-600/10 p-8 rounded-2xl text-center shadow-md">
            <RiTelegramLine className="text-[42px] text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Join our Telegram Group
            </h3>
            <p className="text-gray-600 mt-2">
              Be part of our community. Get updates, ask questions, and connect with others.
            </p>
            <a
              href="https://t.me/speednettechnology"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-primary-600 text-pay mt-5 rounded-md border-0">
                Join Telegram
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ContactUs;

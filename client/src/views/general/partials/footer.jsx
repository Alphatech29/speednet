import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaInstagram, FaXTwitter, FaTelegram, FaTiktok,
} from "react-icons/fa6";
import {
  MdEmail, MdLocationOn, MdPhone, MdOutlineVerified,
  MdOutlineSupportAgent, MdKeyboardArrowUp,
} from "react-icons/md";
import {
  RiShieldCheckLine, RiSecurePaymentLine,
} from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi";
import { FaBolt, FaLock } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { GlobalContext } from "../../../components/control/globalContext";

/* ── Data ─────────────────────────────────────────── */
const companyLinks = [
  { to: "/", label: "Home" },
  { to: "/contact", label: "Contact Us" },
  { to: "/page/terms-of-use", label: "Terms of Use" },
  { to: "/page/privacy-policy", label: "Privacy Policy" },
];

const serviceLinks = [
  { to: "/services/marketplace", label: "Accounts Marketplace" },
  { to: "/services/vtu", label: "VTU Airtime & Data" },
  { to: "/services/virtual-numbers", label: "Virtual OTP Numbers" },
  { to: "/services/vpn", label: "VPN & Secure Logs" },
  { to: "/services/p2p-trading", label: "P2P Escrow Trading" },
  { to: "/services/payments", label: "Crypto Payments" },
  { to: "/auth/register", label: "International Airtime" },
  { to: "/auth/register", label: "Merchant Dashboard" },
];

const supportLinks = [
  { to: "/contact", label: "Help Center" },
  { to: "/contact", label: "Live Chat Support" },
  { to: "/page/privacy-policy", label: "Privacy Policy" },
  { to: "/page/terms-of-use", label: "Terms of Service" },
  { to: "/auth/register", label: "Become a Merchant" },
];

const paymentMethods = [
  { emoji: "🏦", label: "Bank Transfer" },
  { emoji: "💎", label: "USDT / TRON" },
  { emoji: "📱", label: "Mobile Money" },
  { emoji: "💳", label: "Monnify" },
];

const trustItems = [
  { icon: <RiShieldCheckLine size={15} />, text: "SSL Encrypted" },
  { icon: <MdOutlineVerified size={15} />, text: "Verified Sellers" },
  { icon: <FaLock size={13} />, text: "Escrow Protected" },
  { icon: <TbWorld size={15} />, text: "Global Access" },
  { icon: <FaBolt size={13} />, text: "Instant Delivery" },
  { icon: <RiSecurePaymentLine size={15} />, text: "Secure Payments" },
];

const stats = [
  { value: "70K+", label: "Happy Users", icon: "👥" },
  { value: "10M+", label: "Transactions", icon: "⚡" },
  { value: "99.9%", label: "Uptime", icon: "🛡️" },
  { value: "24/7", label: "Support", icon: "🎧" },
];

/* ── Component ────────────────────────────────────── */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { webSettings } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState(null); // "ok" | "err"

  /* MyAlice chat widget */
  useEffect(() => {
    if (window.MyAliceWebChat) return;
    const chatDiv = document.createElement("div");
    chatDiv.id = "myAliceWebChat";
    document.body.appendChild(chatDiv);
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://widget.myalice.ai/index.js";
    s.onload = () => {
      window.MyAliceWebChat.init({
        selector: "#myAliceWebChat",
        number: "Blackprogrammer888",
        message: "",
        color: "#E46300",
        channel: "tg",
        boxShadow: "low",
        text: "Need help?",
        theme: "light",
        position: "right",
        mb: "20px",
        mx: "20px",
        radius: "20px",
      });
    };
    document.body.appendChild(s);
    return () => {
      if (chatDiv && document.body.contains(chatDiv)) document.body.removeChild(chatDiv);
      if (s && document.body.contains(s)) document.body.removeChild(s);
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSubStatus("err");
      return;
    }
    setSubStatus("ok");
    setEmail("");
    setTimeout(() => setSubStatus(null), 4000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = [
    { href: webSettings?.instagram_url, icon: <FaInstagram size={17} />, label: "Instagram" },
    { href: webSettings?.twitter_url, icon: <FaXTwitter size={17} />, label: "X (Twitter)" },
    { href: webSettings?.telegram_url, icon: <FaTelegram size={17} />, label: "Telegram" },
    { href: webSettings?.tiktok_url, icon: <FaTiktok size={17} />, label: "TikTok" },
  ];

  return (
    <footer className="relative bg-secondary text-white overflow-hidden">

      {/* ═══════════════════════════════════════
          BACKGROUND DECORATION
      ═══════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #E46300 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-primary-600/8 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* ═══════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════ */}
      <div className="relative border-b border-white/8">
        <div className="px-5 pc:px-20 py-10">
          <div className="grid grid-cols-2 tab:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden max-w-4xl mx-auto">
            {stats.map(({ value, label, icon }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center py-8 px-5 bg-secondary gap-2"
              >
                <span className="text-2xl">{icon}</span>
                <p className="text-2xl pc:text-3xl font-extrabold text-white leading-none">{value}</p>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          NEWSLETTER STRIP
      ═══════════════════════════════════════ */}
      <div className="relative border-b border-white/8">
        <div className="px-5 pc:px-20 py-10">
          <div className="max-w-4xl mx-auto flex flex-col tab:flex-row items-center justify-between gap-6 bg-primary-600/10 border border-primary-600/20 rounded-2xl px-7 py-7">
            <div className="text-center tab:text-left">
              <h3 className="text-base pc:text-lg font-extrabold text-white mb-1">
                Stay in the loop 📬
              </h3>
              <p className="text-sm text-gray-300">
                Get updates on new features, promotions, and marketplace offers.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full tab:w-auto gap-2 flex-col tab:flex-row"
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full tab:w-64 bg-white/10 border border-white/20 focus:border-primary-600 text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-600/50 transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 text-sm whitespace-nowrap shadow-lg shadow-primary-600/20"
              >
                Subscribe
                <HiArrowRight size={14} />
              </button>
            </form>
          </div>
          {subStatus === "ok" && (
            <p className="text-center text-green-400 text-xs mt-3 font-medium">
              ✓ You're subscribed! Thanks for joining.
            </p>
          )}
          {subStatus === "err" && (
            <p className="text-center text-red-400 text-xs mt-3 font-medium">
              Please enter a valid email address.
            </p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MAIN FOOTER BODY
      ═══════════════════════════════════════ */}
      <div className="relative px-5 pc:px-20 py-14">
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-12 gap-10">

          {/* ── Brand Column ── */}
          <div className="pc:col-span-3">
            <img
              src={webSettings?.logo || "/image/user-logo.png"}
              alt="Speednet logo"
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              Africa's #1 digital marketplace — buy verified accounts, access virtual
              numbers, secure VPNs, airtime, and more with safety and transparency.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2.5 mb-6">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href || "#"}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* App badge style */}
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5">
              <span className="text-xl">🌍</span>
              <div>
                <p className="text-[10px] text-gray-400 leading-none">Available across</p>
                <p className="text-xs font-bold text-white mt-0.5">50+ Countries</p>
              </div>
            </div>
          </div>

          {/* ── Company Links ── */}
          <div className="pc:col-span-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary-600 mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-primary-600" />
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="group flex items-center gap-2 text-sm text-gray-300 hover:text-primary-600 transition-colors duration-200"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary-600 transition-all duration-200 flex-shrink-0" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div className="pc:col-span-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary-600 mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-primary-600" />
              Our Services
            </h4>
            <ul className="grid grid-cols-1 gap-3">
              {serviceLinks.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary-600 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600/50 flex-shrink-0" />
                  <NavLink to={s.to} className="hover:text-primary-600 transition-colors">{s.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Support ── */}
          <div className="pc:col-span-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary-600 mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-primary-600" />
              Support
            </h4>
            <ul className="flex flex-col gap-3">
              {supportLinks.map(({ to, label }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    className="group flex items-center gap-2 text-sm text-gray-300 hover:text-primary-600 transition-colors duration-200"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary-600 transition-all duration-200 flex-shrink-0" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="pc:col-span-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary-600 mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-primary-600" />
              Contact
            </h4>
            <ul className="flex flex-col gap-4">
              {webSettings?.support_email && (
                <li>
                  <a
                    href={`mailto:${webSettings.support_email}`}
                    className="flex items-start gap-3 text-sm text-gray-300 hover:text-primary-600 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary-600/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/25 transition-colors">
                      <MdEmail size={14} className="text-primary-600" />
                    </div>
                    <span className="break-all leading-relaxed">{webSettings.support_email}</span>
                  </a>
                </li>
              )}
              {webSettings?.contact_number && (
                <li>
                  <a
                    href={`tel:${webSettings.contact_number}`}
                    className="flex items-start gap-3 text-sm text-gray-300 hover:text-primary-600 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary-600/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/25 transition-colors">
                      <MdPhone size={14} className="text-primary-600" />
                    </div>
                    <span>{webSettings.contact_number}</span>
                  </a>
                </li>
              )}
              {webSettings?.address && (
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-7 h-7 rounded-lg bg-primary-600/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MdLocationOn size={14} className="text-primary-600" />
                  </div>
                  <span className="leading-relaxed">{webSettings.address}</span>
                </li>
              )}
              {/* Support hours */}
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <div className="w-7 h-7 rounded-lg bg-primary-600/15 flex items-center justify-center flex-shrink-0">
                  <MdOutlineSupportAgent size={14} className="text-primary-600" />
                </div>
                <span>24/7 Live Support Available</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════
          PAYMENT METHODS STRIP
      ═══════════════════════════════════════ */}
      <div className="relative border-t border-white/8">
        <div className="px-5 pc:px-20 py-6">
          <div className="flex flex-col tab:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3 flex-wrap justify-center tab:justify-start">
              <span className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">
                Accepted Payments:
              </span>
              {paymentMethods.map(({ emoji, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-lg px-3 py-1.5"
                >
                  <span className="text-base">{emoji}</span>
                  <span className="text-xs text-gray-300 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Trust icons */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {trustItems.map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className="text-primary-600">{icon}</span>
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          BOTTOM BAR
      ═══════════════════════════════════════ */}
      <div className="relative border-t border-white/8">
        <div className="px-5 pc:px-20 py-5 flex flex-col tab:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-xs text-gray-400 text-center tab:text-left">
            &copy; {currentYear}{" "}
            <span className="text-primary-600 font-bold">
              {webSettings?.site_name || "Speednet"}
            </span>
            ™. All rights reserved. Built with ❤️ for digital Africa.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <NavLink to="/page/privacy-policy" className="hover:text-primary-600 transition-colors px-2 py-1">
              Privacy
            </NavLink>
            <span className="text-gray-700">·</span>
            <NavLink to="/page/terms-of-use" className="hover:text-primary-600 transition-colors px-2 py-1">
              Terms
            </NavLink>
            <span className="text-gray-700">·</span>
            <NavLink to="/contact" className="hover:text-primary-600 transition-colors px-2 py-1">
              Support
            </NavLink>
          </div>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-primary-600/15 hover:bg-primary-600 border border-primary-600/30 hover:border-primary-600 text-primary-600 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200"
          >
            <MdKeyboardArrowUp size={16} />
            Back to top
          </motion.button>
        </div>
      </div>

      {webSettings?.footer_code && (
        <div dangerouslySetInnerHTML={{ __html: webSettings.footer_code }} />
      )}
    </footer>
  );
};

export default Footer;

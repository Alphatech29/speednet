import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { GrShieldSecurity } from "react-icons/gr";
import { TbSocial, TbWorld } from "react-icons/tb";
import { MdOutlinePhoneAndroid, MdOutlineVerified, MdOutlineSupportAgent } from "react-icons/md";
import { FaMoneyCheckAlt, FaArrowRight, FaQuoteLeft, FaLock, FaBolt } from "react-icons/fa";
import { RiP2pFill, RiShieldCheckLine } from "react-icons/ri";
import { HiCheckCircle, HiChevronDown, HiArrowRight } from "react-icons/hi";
import { BiTransfer, BiWallet } from "react-icons/bi";
import { GlobalContext } from "../../components/control/globalContext";

/* ─── Animation variants ─────────────────────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ─── Data ───────────────────────────────────────────── */
const stats = [
  { value: "70K+", label: "Active Users", icon: <MdOutlineVerified /> },
  { value: "10M+", label: "Transactions", icon: <BiTransfer /> },
  { value: "99.9%", label: "Uptime SLA", icon: <FaBolt /> },
  { value: "24/7", label: "Live Support", icon: <MdOutlineSupportAgent /> },
];

const services = [
  {
    num: "01",
    icon: <TbSocial size={26} className="text-primary-600" />,
    title: "Social Media Accounts",
    desc: "Buy and sell verified Gmail, Facebook, Instagram, Twitter accounts and digital logs from trusted merchants.",
    badge: "Most Popular",
  },
  {
    num: "02",
    icon: <GrShieldSecurity size={24} className="text-primary-600" />,
    title: "VPNs & Secure Logs",
    desc: "Premium VPN access and clean logs for secure browsing, identity protection, and encrypted communication.",
    badge: null,
  },
  {
    num: "03",
    icon: <MdOutlinePhoneAndroid size={26} className="text-primary-600" />,
    title: "Virtual SMS & OTP Numbers",
    desc: "Receive OTPs and SMS verifications globally with virtual numbers and eSIMs — works on any platform.",
    badge: "New",
  },
  {
    num: "04",
    icon: <RiP2pFill size={26} className="text-primary-600" />,
    title: "P2P Escrow Trading",
    desc: "Trade digital assets peer-to-peer with our built-in escrow and dispute resolution system for maximum safety.",
    badge: null,
  },
  {
    num: "05",
    icon: <MdOutlinePhoneAndroid size={26} className="text-primary-600" />,
    title: "VTU Airtime & Data",
    desc: "Instant top-up for any mobile network in Nigeria and internationally. Cheapest rates, fastest delivery.",
    badge: null,
  },
  {
    num: "06",
    icon: <FaMoneyCheckAlt size={22} className="text-primary-600" />,
    title: "Multi-Gateway Payments",
    desc: "Fund your wallet via bank transfer, crypto (TRON), or mobile money. Seamless deposits every time.",
    badge: null,
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up free in under 2 minutes. No hidden fees, no credit card required.",
    icon: <MdOutlineVerified size={24} className="text-primary-600" />,
  },
  {
    num: "02",
    title: "Fund Your Wallet",
    desc: "Deposit using bank transfer, crypto, or mobile money with instant confirmation.",
    icon: <BiWallet size={24} className="text-primary-600" />,
  },
  {
    num: "03",
    title: "Buy or Sell Instantly",
    desc: "Browse verified listings or upload your products. All trades protected by escrow.",
    icon: <BiTransfer size={24} className="text-primary-600" />,
  },
];

const testimonials = [
  {
    name: "Chukwuemeka A.",
    role: "Digital Entrepreneur",
    country: "🇳🇬 Nigeria",
    text: "Speednet changed the way I buy accounts. Everything is verified and the escrow gives me total peace of mind. My go-to marketplace.",
    rating: 5,
  },
  {
    name: "Amara N.",
    role: "Freelance Marketer",
    country: "🇬🇭 Ghana",
    text: "The VTU recharge is insanely fast and cheap. I've been using it for 8 months and never had a failed transaction.",
    rating: 5,
  },
  {
    name: "Kevin T.",
    role: "Tech Reseller",
    country: "🇨🇲 Cameroon",
    text: "As a merchant, the platform is exceptional. Escrow settles automatically, support responds fast, and the commission is fair.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "How does the escrow system work?",
    a: "When a buyer places an order, funds are held in escrow. The seller delivers the product, and after the buyer confirms receipt (or after a set timer), funds are released to the seller's wallet. This protects both parties.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We support Nigerian bank transfers (via Monnify), cryptocurrency (TRON/USDT via Cryptomus), and mobile money (via Fapshi for Cameroon users). More gateways are being added.",
  },
  {
    q: "How do I become a merchant/seller?",
    a: "After creating an account, navigate to 'Become a Merchant' in your dashboard. Submit your application and our team will review and activate your merchant account.",
  },
  {
    q: "Are the accounts on the marketplace verified?",
    a: "Yes. All sellers go through verification and listings are reviewed. Buyers can also open a dispute if a delivered product doesn't match the description, and our team will mediate.",
  },
  {
    q: "How long does VTU airtime/data delivery take?",
    a: "VTU recharge is typically delivered within seconds. In rare cases of network delays, it can take up to 5 minutes. If not delivered after that, a refund is automatically initiated.",
  },
];

const trustBadges = [
  { icon: <RiShieldCheckLine size={18} />, text: "SSL Encrypted" },
  { icon: <MdOutlineVerified size={18} />, text: "Verified Sellers" },
  { icon: <FaLock size={15} />, text: "Escrow Protected" },
  { icon: <TbWorld size={18} />, text: "Global Access" },
  { icon: <FaBolt size={15} />, text: "Instant Delivery" },
];

/* ─── Reusable components ────────────────────────────── */
const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
    <span className="w-6 h-px bg-primary-600" />
    {children}
    <span className="w-6 h-px bg-primary-600" />
  </span>
);

const Stars = ({ n = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} className="text-primary-600 text-sm">★</span>
    ))}
  </div>
);

/* ─── FAQ Item ───────────────────────────────────────── */
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${open ? "border-primary-600/40 shadow-md shadow-orange-100" : "border-gray-200"}`}>
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
        onClick={() => setOpen((p) => !p)}
      >
        <span className={`text-sm font-semibold transition-colors ${open ? "text-primary-600" : "text-gray-900 group-hover:text-primary-600"}`}>
          {q}
        </span>
        <HiChevronDown
          size={18}
          className={`text-primary-600 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────── */
const Home = () => {
  const { webSettings } = useContext(GlobalContext);

  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-pay via-white to-orange-50 pt-16">
        {/* Decorative mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-primary-600/10 blur-[100px]" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-dash/20 blur-[80px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(#E46300 1px,transparent 1px),linear-gradient(90deg,#E46300 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative w-full px-5 pc:px-20 py-20">
          <div className="flex flex-col pc:flex-row items-center gap-14 pc:gap-20 max-w-6xl mx-auto">

            {/* Left — copy */}
            <motion.div
              className="flex-1 text-center pc:text-left"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-primary-600/20">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                Global #1 Digital Marketplace
              </span>

              <h1 className="text-[2.2rem] tab:text-[3rem] pc:text-[3.8rem] font-extrabold text-gray-900 leading-[1.15] mb-5">
                Buy, Sell &amp;{" "}
                <span className="relative">
                  <span className="text-primary-600">Access Digital</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="#E46300" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
                {" "}Services
              </h1>

              <p className="text-gray-600 text-base pc:text-lg leading-relaxed mb-8 max-w-xl pc:mx-0 mx-auto">
                {webSettings?.web_description ||
                  "Verified accounts, cheap airtime & data, VPNs, virtual numbers, and P2P trading — all in one secure platform."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col tab:flex-row gap-3 justify-center pc:justify-start mb-8">
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/25 hover:shadow-2xl hover:shadow-primary-600/30 transition-all duration-200 w-full tab:w-auto text-sm">
                    Get Started — It's Free
                    <FaArrowRight size={13} />
                  </button>
                </NavLink>
                <NavLink to="/auth/login">
                  <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-primary-600 text-gray-700 hover:text-primary-600 font-bold px-8 py-4 rounded-xl transition-all duration-200 w-full tab:w-auto text-sm shadow-sm">
                    Sign In to Dashboard
                    <HiArrowRight size={16} />
                  </button>
                </NavLink>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 justify-center pc:justify-start">
                {trustBadges.map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-primary-600">{icon}</span>
                    {text}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right — floating cards */}
            <motion.div
              className="hidden pc:flex flex-shrink-0 w-[420px] relative h-[460px]"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {/* Central card */}
              <div className="absolute inset-8 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center justify-center gap-3 p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center">
                  <span className="text-3xl">🛒</span>
                </div>
                <p className="font-extrabold text-gray-900 text-lg text-center leading-tight">Your Digital Hub</p>
                <p className="text-xs text-gray-500 text-center">Accounts · VTU · VPN · OTP · P2P</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-primary-600 text-sm">★</span>)}
                </div>
                <span className="text-xs text-gray-400">Trusted by 70,000+ users</span>
              </div>
              {/* Floating pills */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-0 right-4 bg-white shadow-lg border border-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-2"
              >
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">Instant Delivery</p>
                  <p className="text-[10px] text-gray-400">VTU in seconds</p>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-4 left-0 bg-white shadow-lg border border-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-2"
              >
                <span className="text-lg">🔒</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">Escrow Protected</p>
                  <p className="text-[10px] text-gray-400">Every transaction</p>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute top-8 left-0 bg-primary-600 shadow-lg rounded-2xl px-4 py-2.5 flex items-center gap-2"
              >
                <span className="text-lg">💳</span>
                <div>
                  <p className="text-xs font-bold text-white">Multi-Gateway</p>
                  <p className="text-[10px] text-orange-100">Bank · Crypto · Mobile</p>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-10 right-0 bg-white shadow-lg border border-gray-100 rounded-2xl px-3 py-2 flex items-center gap-2"
              >
                <div className="flex -space-x-2">
                  {["🇳🇬","🇬🇭","🇨🇲"].map((f,i)=><span key={i} className="text-base">{f}</span>)}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Global Users</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SCROLLING TICKER
      ══════════════════════════════════════ */}
      <div className="bg-primary-600 py-3 overflow-hidden">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        >
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex gap-10 flex-shrink-0">
              {[
                "✦ Verified Accounts",
                "✦ Instant VTU Recharge",
                "✦ P2P Escrow Trading",
                "✦ Virtual OTP Numbers",
                "✦ Premium VPN Access",
                "✦ Crypto Payments",
                "✦ 70,000+ Happy Users",
                "✦ 24/7 Support",
              ].map((t) => (
                <span key={t} className="text-white text-sm font-semibold">{t}</span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section className="bg-secondary px-5 pc:px-20 py-16">
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-2 tab:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map(({ value, label, icon }, i) => (
            <motion.div
              key={label}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center py-10 px-6 bg-secondary gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-600/15 border border-primary-600/20 flex items-center justify-center text-primary-600 text-xl">
                {icon}
              </div>
              <p className="text-3xl pc:text-4xl font-extrabold text-white leading-none">{value}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES
      ══════════════════════════════════════ */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-28">
        <motion.div
          className="text-center mb-14"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>Our Services</SectionLabel>
          <h2 className="text-2xl tab:text-3xl pc:text-5xl font-extrabold text-gray-900 mt-1 leading-tight">
            Everything in One Platform
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm pc:text-base">
            From social media accounts to VTU recharge, virtual numbers to P2P trading — Speednet has everything you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-5">
          {services.map(({ num, icon, title, desc, badge }, i) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-primary-600/30 hover:shadow-xl hover:shadow-orange-100/60 transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Gradient hover bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/5 group-hover:to-orange-50/30 transition-all duration-300 rounded-2xl" />

              {/* Number watermark */}
              <span className="absolute top-4 right-5 text-5xl font-extrabold text-gray-100 group-hover:text-orange-100 transition-colors select-none leading-none">
                {num}
              </span>

              <div className="relative">
                {badge && (
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 ${
                    badge === "Most Popular"
                      ? "bg-primary-600 text-white"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {badge}
                  </span>
                )}
                <div className="w-11 h-11 rounded-xl bg-primary-600/10 flex items-center justify-center mb-4 group-hover:bg-primary-600/20 transition-colors">
                  {icon}
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1.5 mt-4 text-primary-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Get Started <HiArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-pay to-white px-5 pc:px-20 py-20 pc:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="text-center mb-14"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>Simple Process</SectionLabel>
          <h2 className="text-2xl tab:text-3xl pc:text-5xl font-extrabold text-gray-900 mt-1">
            Up & Running in Minutes
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">
            Getting started on Speednet is incredibly easy. Follow these three simple steps.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connector line (desktop only) */}
          <div className="hidden pc:block absolute top-12 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-primary-600/30 to-transparent" />

          <div className="grid grid-cols-1 tab:grid-cols-3 gap-8">
            {steps.map(({ num, title, desc, icon }, i) => (
              <motion.div
                key={num}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center">
                      {icon}
                    </div>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <NavLink to="/auth/register">
            <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-xl transition-all duration-200 text-sm">
              Create Free Account
              <FaArrowRight size={13} />
            </button>
          </NavLink>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          MARKETPLACE FEATURE
      ══════════════════════════════════════ */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-28">
        <div className="max-w-6xl mx-auto flex flex-col tab:flex-row pc:flex-row items-center gap-12 pc:gap-20">
          <motion.div
            className="w-full tab:w-1/2 pc:w-1/2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-orange-50 rounded-3xl transform rotate-2" />
              <img
                src="/image/illustration.png"
                alt="Speednet Marketplace"
                className="relative w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            className="w-full tab:w-1/2 pc:w-1/2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <SectionLabel>Our Marketplace</SectionLabel>
            <h2 className="text-2xl tab:text-3xl pc:text-4xl font-extrabold text-gray-900 mt-1 mb-5 leading-tight">
              Nigeria's Most Trusted Digital Accounts Marketplace
            </h2>
            <p className="text-gray-500 text-sm pc:text-base leading-relaxed mb-6">
              Buy and sell verified digital accounts — Gmail, Facebook, Instagram, streaming, VPNs, and more — on a platform that puts safety and transparency first.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {[
                "Community-driven marketplace with verified merchants",
                "Escrow protection on every transaction",
                "Instant dispute resolution & buyer protection",
                "Real-time order tracking and delivery",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <HiCheckCircle className="text-primary-600 text-xl mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>

            <NavLink to="/auth/register">
              <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg shadow-primary-600/20 transition-all duration-200 text-sm">
                Start Trading
                <FaArrowRight size={12} />
              </button>
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VIRTUAL NUMBERS FEATURE
      ══════════════════════════════════════ */}
      <section className="bg-pay px-5 pc:px-20 py-20 pc:py-28">
        <div className="max-w-6xl mx-auto flex flex-col tab:flex-row-reverse pc:flex-row-reverse items-center gap-12 pc:gap-20">
          <motion.div
            className="w-full tab:w-1/2 pc:w-1/2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-bl from-primary-600/10 to-orange-50 rounded-3xl transform -rotate-2" />
              <img
                src="/image/virtualnumber.png"
                alt="Virtual Numbers"
                className="relative w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            className="w-full tab:w-1/2 pc:w-1/2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <SectionLabel>Global Numbers</SectionLabel>
            <h2 className="text-2xl tab:text-3xl pc:text-4xl font-extrabold text-gray-900 mt-1 mb-5 leading-tight">
              Virtual Numbers & eSIMs — Anywhere, Anytime
            </h2>
            <p className="text-gray-500 text-sm pc:text-base leading-relaxed mb-6">
              Receive OTPs, SMS verifications, and messages globally with virtual numbers and eSIM technology — works on any platform, any country.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { emoji: "📱", label: "50+ Countries" },
                { emoji: "⚡", label: "Instant Activation" },
                { emoji: "🔄", label: "Temporary Numbers" },
                { emoji: "📡", label: "eSIM Support" },
              ].map(({ emoji, label }) => (
                <div key={label} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <span className="text-xl">{emoji}</span>
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            <NavLink to="/auth/register">
              <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg shadow-primary-600/20 transition-all duration-200 text-sm">
                Get Your Number
                <FaArrowRight size={12} />
              </button>
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-28">
        <motion.div
          className="text-center mb-14"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-2xl tab:text-3xl pc:text-5xl font-extrabold text-gray-900 mt-1">
            Loved by Thousands
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">
            Don't just take our word for it — here's what our community says.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tab:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map(({ name, role, country, text, rating }, i) => (
            <motion.div
              key={name}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary-600/20 transition-all duration-300"
            >
              <FaQuoteLeft className="text-primary-600/20 text-4xl absolute top-4 right-4" />
              <div className="flex flex-col gap-4">
                <Stars n={rating} />
                <p className="text-sm text-gray-600 leading-relaxed">"{text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center font-extrabold text-primary-600 text-base">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role} · {country}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="relative bg-secondary px-5 pc:px-20 py-20 pc:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-600/8 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-primary-600/5 blur-[60px]" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col pc:flex-row gap-12 pc:gap-20 items-center">
            <motion.div
              className="flex-1 text-center pc:text-left"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionLabel>Why Speednet</SectionLabel>
              <h2 className="text-2xl tab:text-3xl pc:text-4xl font-extrabold text-white mt-1 mb-5 leading-tight">
                Built for Trust,
                <br />Speed &amp; Security
              </h2>
              <p className="text-gray-400 text-sm pc:text-base leading-relaxed mb-8">
                We've engineered every layer of Speednet to give you the safest, fastest digital commerce experience available in Africa and beyond.
              </p>
              <NavLink to="/auth/register">
                <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-primary-600/20 transition-all duration-200 text-sm">
                  Join Speednet Today
                  <FaArrowRight size={12} />
                </button>
              </NavLink>
            </motion.div>

            <div className="flex-1 grid grid-cols-1 tab:grid-cols-2 gap-4 w-full">
              {[
                { icon: "🔒", title: "Escrow on Every Order", desc: "Funds are held safely until delivery is confirmed." },
                { icon: "✅", title: "Verified Merchants", desc: "All sellers pass identity and quality checks." },
                { icon: "⚡", title: "Instant Delivery", desc: "Digital products delivered the moment you pay." },
                { icon: "💳", title: "Multi-Gateway Payments", desc: "Bank, crypto, or mobile money — your choice." },
                { icon: "🌍", title: "Works Globally", desc: "Serving users across Africa, UK, US, and Canada." },
                { icon: "🎧", title: "24/7 Support", desc: "Live chat and Telegram support, always available." },
              ].map(({ icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-primary-600/30 hover:bg-white/8 rounded-2xl px-4 py-4 transition-all duration-200"
                >
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-28">
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-2xl tab:text-3xl pc:text-5xl font-extrabold text-gray-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">
            Everything you need to know about using Speednet.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <FaqItem {...faq} />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center mt-10 text-sm text-gray-500"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Still have questions?{" "}
          <NavLink to="/contact" className="text-primary-600 font-semibold hover:underline">
            Contact our support team →
          </NavLink>
        </motion.p>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-secondary via-primary-100 to-slate-900 px-5 pc:px-20 py-20 pc:py-28 overflow-hidden">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 bg-primary-600/20 text-primary-600 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-primary-600/30">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            Join 50,000+ users today
          </span>
          <h2 className="text-3xl tab:text-4xl pc:text-6xl font-extrabold text-white mb-5 leading-tight">
            Start Your Digital
            <br />
            <span className="text-primary-600">Journey Today</span>
          </h2>
          <p className="text-gray-300 text-sm pc:text-base mb-10 max-w-xl mx-auto">
            Create a free account and access Nigeria's largest digital marketplace. No credit card required.
          </p>
          <div className="flex flex-col tab:flex-row gap-4 justify-center">
            <NavLink to="/auth/register">
              <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-extrabold px-10 py-4 rounded-xl shadow-2xl shadow-primary-600/30 hover:shadow-primary-600/40 transition-all duration-200 text-base w-full tab:w-auto">
                Create Free Account
                <FaArrowRight size={14} />
              </button>
            </NavLink>
            <NavLink to="/contact">
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-bold px-10 py-4 rounded-xl transition-all duration-200 text-base w-full tab:w-auto backdrop-blur-sm">
                Talk to Support
              </button>
            </NavLink>
          </div>

          {/* Mini trust row */}
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            {["No hidden fees", "Free to join", "Cancel anytime", "SSL secured"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <HiCheckCircle className="text-primary-600 text-sm" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Home;

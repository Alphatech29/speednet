import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { HiCheckCircle, HiChevronDown } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlinePhoneAndroid, MdOutlineTimer, MdOutlineSignalCellularAlt } from "react-icons/md";
import { TbWorld, TbDeviceSim } from "react-icons/tb";

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };

const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
    <span className="w-5 h-px bg-primary-600" />{children}<span className="w-5 h-px bg-primary-600" />
  </span>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${open ? "border-primary-600/40 shadow-md shadow-orange-100" : "border-gray-200"}`}>
      <button className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group" onClick={() => setOpen(p => !p)}>
        <span className={`text-sm font-semibold transition-colors ${open ? "text-primary-600" : "text-gray-900 group-hover:text-primary-600"}`}>{q}</span>
        <HiChevronDown size={17} className={`text-primary-600 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const platforms = [
  { emoji: "📲", name: "WhatsApp" },
  { emoji: "✈️", name: "Telegram" },
  { emoji: "📧", name: "Gmail" },
  { emoji: "📘", name: "Facebook" },
  { emoji: "📸", name: "Instagram" },
  { emoji: "🐦", name: "Twitter/X" },
  { emoji: "💼", name: "LinkedIn" },
  { emoji: "🛒", name: "Amazon" },
  { emoji: "🎵", name: "TikTok" },
  { emoji: "🏦", name: "Banking" },
  { emoji: "🎮", name: "Gaming" },
  { emoji: "🌐", name: "Any Platform" },
];

const countries = [
  { flag: "🇳🇬", name: "Nigeria" }, { flag: "🇺🇸", name: "USA" }, { flag: "🇬🇧", name: "UK" },
  { flag: "🇩🇪", name: "Germany" }, { flag: "🇫🇷", name: "France" }, { flag: "🇷🇺", name: "Russia" },
  { flag: "🇨🇳", name: "China" }, { flag: "🇮🇳", name: "India" }, { flag: "🇧🇷", name: "Brazil" },
  { flag: "🇨🇦", name: "Canada" }, { flag: "🌍", name: "+40 More" },
];

const features = [
  { icon: <TbWorld size={22} className="text-primary-600" />, title: "50+ Countries Covered", desc: "Get virtual numbers from over 50 countries for any platform or verification purpose." },
  { icon: <MdOutlineTimer size={22} className="text-primary-600" />, title: "Temporary Numbers", desc: "Use a number once for OTP verification then discard. Perfect for protecting your privacy." },
  { icon: <TbDeviceSim size={22} className="text-primary-600" />, title: "eSIM Support", desc: "Get eSIM-compatible virtual numbers for long-term use — works just like a real SIM." },
  { icon: <MdOutlinePhoneAndroid size={22} className="text-primary-600" />, title: "Instant Activation", desc: "Numbers are activated immediately after purchase. No waiting for physical delivery." },
  { icon: <MdOutlineSignalCellularAlt size={22} className="text-primary-600" />, title: "Reliable SMS Delivery", desc: "99%+ SMS delivery rate — your OTP will arrive every time, without fail." },
  { icon: <TbWorld size={22} className="text-primary-600" />, title: "Multi-Platform Use", desc: "One number can be used across multiple platforms. Maximum value, minimum cost." },
];

const steps = [
  { n: "01", emoji: "🌍", title: "Select Country & Platform", desc: "Choose the country and platform you need the number for. We'll show you available numbers." },
  { n: "02", emoji: "💳", title: "Pay from Wallet", desc: "Deduct from your Speednet wallet balance. Numbers are priced from just a few cents." },
  { n: "03", emoji: "📲", title: "Receive Your OTP", desc: "Use the number on your chosen platform. SMS messages appear on your Speednet dashboard instantly." },
];

const faqs = [
  { q: "How quickly do I receive the OTP?", a: "OTP messages typically arrive within 10–60 seconds after the platform sends them. Our system checks for incoming messages every few seconds." },
  { q: "Can I use one number for multiple platforms?", a: "Yes, as long as the number hasn't been used on that specific platform before. Each number can be reused across different services." },
  { q: "What if I don't receive an OTP?", a: "If no message arrives within 20 minutes, a full refund is automatically issued to your wallet. You can also manually request a refund from your order page." },
  { q: "What's the difference between temporary and eSIM numbers?", a: "Temporary numbers are single-use or short-term (minutes to hours) for OTP verification. eSIM numbers are long-term virtual SIM cards that can receive calls and SMS over an extended period." },
];

export default function VirtualNumbersPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-pay via-white to-orange-50 pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-primary-600/8 blur-[100px]" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-dash/15 blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#E46300 1px,transparent 1px),linear-gradient(90deg,#E46300 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative w-full px-5 pc:px-20 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-600 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-primary-600/20">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />Virtual OTP Numbers
              </span>
              <h1 className="text-[2.2rem] tab:text-[3rem] pc:text-[4rem] font-extrabold text-gray-900 leading-tight mb-5">
                Virtual Numbers &amp; eSIMs —{" "}
                <span className="text-primary-600">Anywhere, Anytime</span>
              </h1>
              <p className="text-gray-600 text-base pc:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                Receive OTPs and SMS verifications for any platform in 50+ countries. Protect your real number, verify accounts, and activate services globally.
              </p>
              <div className="flex flex-col tab:flex-row gap-4 justify-center mb-10">
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/25 transition-all text-sm w-full tab:w-auto">
                    Get a Number Now <FaArrowRight size={13} />
                  </button>
                </NavLink>
              </div>
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8">
                {[{ v: "50+", l: "Countries" }, { v: "100+", l: "Platforms" }, { v: "< 60s", l: "OTP Delivery" }, { v: "99%+", l: "Success Rate" }].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <p className="text-2xl font-extrabold text-primary-600">{v}</p>
                    <p className="text-xs text-gray-500">{l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Supported Platforms ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Platform Support</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Works on Every Platform</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">Our virtual numbers are tested and compatible with all major platforms worldwide.</p>
        </motion.div>
        <div className="grid grid-cols-3 tab:grid-cols-4 pc:grid-cols-6 gap-4 max-w-3xl mx-auto">
          {platforms.map(({ emoji, name }, i) => (
            <motion.div key={name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-primary-600/30 hover:shadow-md transition-all bg-white group cursor-default">
              <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
              <span className="text-xs font-semibold text-gray-600 group-hover:text-primary-600 transition-colors text-center">{name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Countries ── */}
      <section className="bg-pay px-5 pc:px-20 py-16 pc:py-20">
        <motion.div className="text-center mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Coverage</SectionLabel>
          <h2 className="text-2xl pc:text-3xl font-extrabold text-gray-900 mt-1">50+ Countries Available</h2>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {countries.map(({ flag, name }, i) => (
            <motion.div key={name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm hover:border-primary-600/30 hover:shadow-md transition-all">
              <span className="text-lg">{flag}</span>
              <span className="text-xs font-semibold text-gray-700">{name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Key Features</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Why Use Speednet Numbers?</h2>
        </motion.div>
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary-600/30 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-primary-600/10 flex items-center justify-center mb-4 group-hover:bg-primary-600/20 transition-colors">{icon}</div>
              <h3 className="text-base font-extrabold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-secondary px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Simple Process</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-white mt-1">Get Your Number in 3 Steps</h2>
        </motion.div>
        <div className="relative max-w-4xl mx-auto grid grid-cols-1 tab:grid-cols-3 gap-8">
          <div className="hidden tab:block absolute top-10 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-primary-600/40 to-transparent" />
          {steps.map(({ emoji, title, desc }, i) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl">{emoji}</div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white mb-1.5">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Common Questions</h2>
        </motion.div>
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {faqs.map((f, i) => (
            <motion.div key={f.q} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
              <FaqItem {...f} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-gradient-to-br from-secondary via-primary-100 to-slate-900 px-5 pc:px-20 py-20 overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/15 rounded-full blur-[80px] pointer-events-none" />
        <motion.div className="relative z-10 max-w-xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-white mb-4">Get Your Virtual Number Today</h2>
          <p className="text-gray-300 text-sm pc:text-base mb-8">Sign up free and get instant access to virtual numbers from 50+ countries.</p>
          <NavLink to="/auth/register">
            <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-10 py-4 rounded-xl shadow-xl shadow-primary-600/30 transition-all text-sm">
              Get a Number Free <FaArrowRight size={13} />
            </button>
          </NavLink>
        </motion.div>
      </section>
    </>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import PageSeo from "../../../components/utils/PageSeo";
import { HiCheckCircle, HiChevronDown, HiStar } from "react-icons/hi";
import { FaArrowRight, FaBolt, FaQuoteLeft, FaGlobeAfrica } from "react-icons/fa";
import { MdOutlinePhoneAndroid, MdOutlineSpeed, MdOutlinePublic, MdOutlineSupportAgent, MdOutlineAutorenew } from "react-icons/md";
import { BiWifi, BiTransfer } from "react-icons/bi";
import { RiShieldCheckLine, RiRefund2Line } from "react-icons/ri";
import { TbWorld, TbDeviceMobile, TbBuildingStore } from "react-icons/tb";

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };

const SectionLabel = ({ children, light = false }) => (
  <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3 ${light ? "text-primary-400" : "text-primary-600"}`}>
    <span className={`w-5 h-px ${light ? "bg-primary-400" : "bg-primary-600"}`} />{children}<span className={`w-5 h-px ${light ? "bg-primary-400" : "bg-primary-600"}`} />
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

const networks = [
  { emoji: "🟡", name: "MTN Nigeria", country: "Nigeria", flag: "🇳🇬", type: "Airtime & Data" },
  { emoji: "🔴", name: "Airtel Nigeria", country: "Nigeria", flag: "🇳🇬", type: "Airtime & Data" },
  { emoji: "🟢", name: "Glo Mobile", country: "Nigeria", flag: "🇳🇬", type: "Airtime & Data" },
  { emoji: "🟣", name: "9mobile", country: "Nigeria", flag: "🇳🇬", type: "Airtime & Data" },
  { emoji: "🌍", name: "Camtel", country: "Cameroon", flag: "🇨🇲", type: "Airtime" },
  { emoji: "🌍", name: "MTN Cameroon", country: "Cameroon", flag: "🇨🇲", type: "Airtime & Data" },
  { emoji: "🌍", name: "MTN Ghana", country: "Ghana", flag: "🇬🇭", type: "Airtime & Data" },
  { emoji: "🌐", name: "International", country: "100+ Countries", flag: "🌍", type: "Intl Airtime" },
];

const features = [
  { icon: <FaBolt size={20} className="text-primary-600" />, title: "Instant Delivery", desc: "Recharge processed and delivered in under 5 seconds — no waiting, no delays, guaranteed." },
  { icon: <MdOutlineSpeed size={22} className="text-primary-600" />, title: "Cheapest Rates", desc: "Wholesale-negotiated prices give you the best airtime and data rates in Africa, always." },
  { icon: <MdOutlinePublic size={22} className="text-primary-600" />, title: "100+ Countries", desc: "Send international airtime to any mobile network in over 100 countries worldwide." },
  { icon: <BiWifi size={22} className="text-primary-600" />, title: "All Data Plans", desc: "Daily, weekly, monthly — every data bundle plan for every Nigerian and African network." },
  { icon: <RiRefund2Line size={22} className="text-primary-600" />, title: "Auto-Refund", desc: "Failed transaction? Your wallet is refunded instantly and automatically — zero hassle." },
  { icon: <TbBuildingStore size={22} className="text-primary-600" />, title: "Bulk Recharge", desc: "Top-up multiple numbers in one transaction. Perfect for businesses and VTU resellers." },
];

const steps = [
  { n: "01", icon: <TbDeviceMobile size={28} className="text-primary-600" />, title: "Enter Number & Amount", desc: "Type the recipient's phone number, select the network, pick airtime or data and the amount." },
  { n: "02", icon: <BiTransfer size={26} className="text-primary-600" />, title: "Pay from Wallet", desc: "Deduct instantly from your Speednet wallet — pre-funded with bank transfer, card, or crypto." },
  { n: "03", icon: <FaBolt size={22} className="text-primary-600" />, title: "Delivered in Seconds", desc: "Recharge lands on the recipient's line within 3–10 seconds, confirmed by real-time status." },
];

const testimonials = [
  { name: "Emeka T.", role: "VTU Reseller", country: "🇳🇬 Lagos", text: "I process 200+ top-ups daily on Speednet. The speed is unbeatable and when there's a failure, refunds hit my wallet in seconds — not hours.", rating: 5 },
  { name: "Fatima A.", role: "Small Business Owner", country: "🇳🇬 Kano", text: "I send airtime to my staff every week. Speednet is the only platform I use — cheapest rates and never failed me once in 8 months.", rating: 5 },
  { name: "Kwame B.", role: "Freelancer", country: "🇬🇭 Accra", text: "MTN Ghana top-ups work perfectly. Fast delivery, affordable rates, and I love that I can fund from crypto if I want.", rating: 5 },
];

const faqs = [
  { q: "How fast is VTU delivery?", a: "Recharge is typically delivered within 3–10 seconds. In rare network delays, it may take up to 5 minutes. If not delivered after that, an automatic refund is issued to your wallet." },
  { q: "Can I recharge international numbers?", a: "Yes! Speednet supports international airtime to 100+ countries. Enter the recipient's full number with country code and select the amount." },
  { q: "What networks are supported?", a: "MTN, Airtel, Glo, and 9mobile in Nigeria; MTN and Camtel in Cameroon; MTN Ghana; and 100+ international operators via our global airtime gateway." },
  { q: "Is there a minimum recharge amount?", a: "Minimum is ₦50 for airtime. Data bundle minimums vary by plan. There is no maximum limit per single transaction." },
  { q: "What happens if the recharge fails?", a: "Your wallet balance is automatically refunded within seconds of a failed transaction. No support ticket, no waiting — it's fully automated." },
];

export default function VtuPage() {
  return (
    <>
      <PageSeo
        title="VTU — Airtime & Data Top-Up"
        description="Buy airtime and data bundles instantly for MTN, Airtel, Glo, and 9mobile. Cheapest VTU rates in Africa on Speednet."
        keywords="vtu, buy airtime, buy data, mtn airtime, airtel data, glo data, 9mobile, recharge nigeria"
        path="/services/vtu"
      />
      {/* ── Hero ── */}
      <section className="relative min-h-[95vh] flex items-center bg-gradient-to-br from-[#fff9ec] via-white to-orange-50 pt-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-primary-600/8 blur-[120px]" />
          <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full bg-dash/15 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "radial-gradient(circle, #E46300 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative w-full px-5 pc:px-20 py-16">
          <div className="max-w-6xl mx-auto flex flex-col pc:flex-row items-center gap-16">
            {/* Left */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }} className="flex-1 text-center pc:text-left">
              <span className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-primary-600/20">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />VTU Airtime & Data
              </span>
              <h1 className="text-[2.4rem] tab:text-[3.2rem] pc:text-[4.2rem] font-extrabold text-gray-900 leading-[1.1] mb-6">
                Instant Airtime &amp; Data —{" "}
                <span className="text-primary-600">Zero Delays,</span>{" "}
                Lowest Rates
              </h1>
              <p className="text-gray-600 text-base pc:text-xl max-w-xl leading-relaxed mb-10">
                Top-up any Nigerian or African network in under 5 seconds. Fully automated, auto-refund on failure, and the cheapest rates in the market.
              </p>
              <div className="flex flex-col tab:flex-row gap-4 justify-center pc:justify-start mb-10">
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm w-full tab:w-auto">
                    Recharge Now <FaArrowRight size={13} />
                  </button>
                </NavLink>
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-primary-600 text-gray-700 hover:text-primary-600 font-bold px-8 py-4 rounded-xl transition-all text-sm w-full tab:w-auto bg-white shadow-sm hover:-translate-y-0.5">
                    <TbBuildingStore size={16} /> Bulk / Reseller Access
                  </button>
                </NavLink>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pc:justify-start">
                {["⚡ Delivered in 5 seconds", "🔄 Auto-refund on failure", "🌍 100+ Countries", "📱 All Networks"].map(t => (
                  <span key={t} className="text-xs text-gray-600 font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">{t}</span>
                ))}
              </div>
            </motion.div>
            {/* Right — speed visual */}
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden pc:flex w-[380px] h-[380px] flex-shrink-0 relative items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary-600/5 border border-primary-600/10 animate-pulse" />
              <div className="absolute inset-10 rounded-full bg-primary-600/8 border border-primary-600/10" />
              <div className="relative w-36 h-36 rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col items-center justify-center gap-1.5">
                <FaBolt className="text-primary-600 text-4xl" />
                <p className="text-sm font-extrabold text-gray-900">3 Seconds</p>
                <p className="text-[11px] text-gray-400">Avg. Delivery</p>
              </div>
              {[
                { style: "top-6 left-16", label: "MTN 🟡", delay: 2.8 },
                { style: "bottom-6 right-16", label: "Airtel 🔴", delay: 3.5 },
                { style: "top-20 right-2", label: "Glo 🟢", delay: 4 },
                { style: "bottom-20 left-2", label: "9mobile 🟣", delay: 3.2 },
              ].map(({ style, label, delay }) => (
                <motion.div key={label} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: delay, ease: "easeInOut" }}
                  className={`absolute ${style} bg-white shadow-lg border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-700`}>
                  {label}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto grid grid-cols-2 pc:grid-cols-4 divide-x divide-white/10">
          {[{ v: "99.9%", l: "Success Rate", icon: "✅" }, { v: "<5s", l: "Avg Delivery", icon: "⚡" }, { v: "500K+", l: "Top-ups Done", icon: "📱" }, { v: "₦0", l: "Lost on Failures", icon: "🔄" }].map(({ v, l, icon }) => (
            <div key={l} className="flex flex-col items-center py-8 px-4 text-center">
              <span className="text-2xl mb-2">{icon}</span>
              <p className="text-2xl font-extrabold text-primary-600">{v}</p>
              <p className="text-xs text-gray-400 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Networks ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Supported Networks</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Every Network, Every Country</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">All major African networks and 100+ international operators — all in one platform.</p>
        </motion.div>
        <div className="grid grid-cols-2 tab:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {networks.map(({ emoji, name, country, flag, type }, i) => (
            <motion.div key={name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex flex-col items-center gap-2 p-6 rounded-2xl border border-gray-100 hover:border-primary-600/30 hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all bg-white group cursor-pointer">
              <span className="text-4xl group-hover:scale-110 transition-transform">{emoji}</span>
              <p className="text-sm font-extrabold text-gray-900 text-center">{name}</p>
              <p className="text-[11px] text-gray-400">{flag} {country}</p>
              <span className="text-[10px] font-semibold text-primary-600 bg-primary-600/8 px-2 py-0.5 rounded-full">{type}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-pay px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Simple Process</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Top-Up in 3 Easy Steps</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm pc:text-base">No complexity, no confusion — recharge anyone in seconds.</p>
        </motion.div>
        <div className="relative max-w-4xl mx-auto grid grid-cols-1 tab:grid-cols-3 gap-8">
          <div className="hidden tab:block absolute top-12 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-primary-600/40 to-transparent" />
          {steps.map(({ n, icon, title, desc }, i) => (
            <motion.div key={n} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center">{icon}</div>
                <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-lg shadow-primary-600/30">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Why Choose Us</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Built for Speed & Reliability</h2>
        </motion.div>
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-white border border-gray-100 rounded-2xl p-7 hover:border-primary-600/30 hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-5 group-hover:bg-primary-600/20 transition-colors">{icon}</div>
              <h3 className="text-base font-extrabold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Zero-Failure Guarantee ── */}
      <section className="bg-secondary px-5 pc:px-20 py-20 pc:py-24 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto flex flex-col pc:flex-row items-center gap-14 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex-1">
            <SectionLabel light>Our Promise</SectionLabel>
            <h2 className="text-2xl pc:text-4xl font-extrabold text-white mt-1 mb-5 leading-tight">
              Zero-Failure <span className="text-primary-600">Guarantee</span>
            </h2>
            <p className="text-gray-300 text-sm pc:text-base leading-relaxed mb-8">
              If your recharge fails for any reason — network downtime, wrong number, anything — your wallet is refunded instantly and automatically. Zero support tickets needed.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Funds auto-refunded on any failed transaction",
                "Real-time delivery status tracking",
                "24/7 uptime monitoring with 99.9% SLA",
                "Dedicated VTU support team on standby",
              ].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <HiCheckCircle className="text-primary-600 text-lg flex-shrink-0" />
                  <span className="text-sm text-gray-200">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 grid grid-cols-2 gap-4">
            {[{ v: "99.9%", l: "Success Rate" }, { v: "<5s", l: "Avg Delivery" }, { v: "500K+", l: "Top-ups Done" }, { v: "₦0", l: "Lost Funds" }].map(({ v, l }) => (
              <div key={l} className="bg-white/5 border border-white/10 hover:border-primary-600/30 rounded-2xl p-6 text-center transition-all">
                <p className="text-3xl font-extrabold text-primary-600 mb-1">{v}</p>
                <p className="text-xs text-gray-400">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Real Reviews</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">What Our Users Say</h2>
        </motion.div>
        <div className="grid grid-cols-1 tab:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {testimonials.map(({ name, role, country, text, rating }, i) => (
            <motion.div key={name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-pay border border-orange-100 rounded-2xl p-7 flex flex-col gap-4 hover:shadow-xl hover:shadow-orange-100/60 hover:-translate-y-1 transition-all duration-300">
              <FaQuoteLeft className="text-primary-600/30 text-3xl" />
              <p className="text-sm text-gray-700 leading-relaxed flex-1">"{text}"</p>
              <div className="flex gap-0.5 mb-1">
                {[...Array(rating)].map((_, j) => <HiStar key={j} className="text-primary-600 text-sm" />)}
              </div>
              <div className="flex items-center gap-3 border-t border-orange-100 pt-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center font-extrabold text-white text-sm">{name[0]}</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-400">{role} · {country}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-pay px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
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
      <section className="relative bg-gradient-to-br from-secondary via-slate-900 to-slate-900 px-5 pc:px-20 py-24 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #E46300 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/15 rounded-full blur-[80px] pointer-events-none" />
        <motion.div className="relative z-10 max-w-xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 bg-primary-600/20 text-primary-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-primary-600/30">
            <FaGlobeAfrica size={12} /> Africa's Fastest VTU Platform
          </span>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-white mb-4">Top Up in Under 5 Seconds</h2>
          <p className="text-gray-300 text-sm pc:text-base mb-10">Sign up free and get instant access to the cheapest VTU rates in Africa. Auto-refund guaranteed.</p>
          <div className="flex flex-col tab:flex-row gap-3 justify-center">
            <NavLink to="/auth/register">
              <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/30 hover:-translate-y-0.5 transition-all text-sm w-full tab:w-auto">
                Start Recharging Free <FaArrowRight size={13} />
              </button>
            </NavLink>
            <NavLink to="/contact">
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all text-sm w-full tab:w-auto">
                Talk to Support
              </button>
            </NavLink>
          </div>
        </motion.div>
      </section>
    </>
  );
}

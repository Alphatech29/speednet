import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import PageSeo from "../../../components/utils/PageSeo";
import { HiCheckCircle, HiChevronDown, HiStar } from "react-icons/hi";
import { RiShieldCheckLine, RiStoreLine, RiVerifiedBadgeFill } from "react-icons/ri";
import { FaArrowRight, FaQuoteLeft, FaShieldAlt, FaStore } from "react-icons/fa";
import { MdOutlineVerified, MdOutlineLocalShipping, MdGavel, MdOutlineSupportAgent, MdTrendingUp } from "react-icons/md";
import { BiTransfer, BiWallet, BiSearch } from "react-icons/bi";
import { TbWorld, TbRocket } from "react-icons/tb";

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

const accountTypes = [
  { emoji: "📧", label: "Gmail Accounts", count: "2.4K+" },
  { emoji: "📘", label: "Facebook Accounts", count: "1.8K+" },
  { emoji: "📸", label: "Instagram Accounts", count: "3.1K+" },
  { emoji: "🐦", label: "Twitter / X", count: "980+" },
  { emoji: "🎵", label: "TikTok Accounts", count: "1.2K+" },
  { emoji: "🎬", label: "Netflix Premium", count: "760+" },
  { emoji: "🎵", label: "Spotify Premium", count: "540+" },
  { emoji: "💼", label: "LinkedIn Premium", count: "320+" },
  { emoji: "🛒", label: "Amazon Accounts", count: "410+" },
  { emoji: "🔐", label: "VPN Accounts", count: "890+" },
  { emoji: "🎮", label: "Gaming Accounts", count: "1.5K+" },
  { emoji: "📡", label: "IPTV Access", count: "680+" },
];

const features = [
  { icon: <MdOutlineVerified size={22} className="text-primary-600" />, title: "Verified Merchants", desc: "Every seller undergoes identity verification and review before listing. Zero unverified sellers on Speednet." },
  { icon: <RiShieldCheckLine size={22} className="text-primary-600" />, title: "Escrow Protection", desc: "Your funds are held in escrow until you confirm delivery. You always stay in control of every transaction." },
  { icon: <MdOutlineLocalShipping size={22} className="text-primary-600" />, title: "Instant Delivery", desc: "Digital products are delivered automatically within seconds of payment — no manual processing needed." },
  { icon: <MdGavel size={22} className="text-primary-600" />, title: "Dispute Resolution", desc: "Our expert team mediates all buyer-seller disputes fairly and quickly. Your investment is always protected." },
  { icon: <BiTransfer size={22} className="text-primary-600" />, title: "Transparent Pricing", desc: "No hidden fees, ever. You see exactly what you pay and what the seller earns before every transaction." },
  { icon: <RiStoreLine size={22} className="text-primary-600" />, title: "Merchant Dashboard", desc: "Powerful seller tools to list products, manage orders, track earnings, and withdraw funds in minutes." },
];

const steps = [
  { n: "01", icon: <BiSearch size={28} className="text-primary-600" />, title: "Browse & Choose", desc: "Search thousands of verified listings by category, price, or seller rating. Filter by platform or account type." },
  { n: "02", icon: <FaShieldAlt size={24} className="text-primary-600" />, title: "Pay into Escrow", desc: "Your funds go into secure escrow — not to the seller — until you confirm you received exactly what you paid for." },
  { n: "03", icon: <HiCheckCircle size={26} className="text-primary-600" />, title: "Receive & Confirm", desc: "Get instant delivery of your digital product. Confirm receipt and funds are released to the seller automatically." },
];

const testimonials = [
  { name: "Adeyemi K.", role: "Digital Entrepreneur", country: "🇳🇬 Lagos", text: "Speednet is the safest place I've found to buy verified accounts. 30+ purchases and zero issues — the escrow system is a game changer.", rating: 5 },
  { name: "Amara N.", role: "Social Media Manager", country: "🇬🇭 Accra", text: "I source all my client accounts through Speednet Marketplace. The quality is consistent and delivery is instant every time.", rating: 5 },
  { name: "Chidi O.", role: "Reseller", country: "🇳🇬 Abuja", text: "As a merchant, the dashboard gives me everything I need. Managing listings, withdrawing earnings — it's all seamless and fast.", rating: 5 },
];

const faqs = [
  { q: "How do I know the accounts are genuine?", a: "Every seller is verified and accounts go through a review process. Buyers can also open a dispute within 24 hours if the product doesn't match the description." },
  { q: "What happens if I get a bad product?", a: "Open a dispute from your dashboard. Our team investigates and either forces the seller to replace the product or issues a full refund from escrow." },
  { q: "Can I become a seller/merchant?", a: "Yes! After signing up, go to your dashboard and click 'Become a Merchant'. Submit your application and we'll review and activate it within 24 hours." },
  { q: "What are the seller fees?", a: "Speednet charges a small, transparent commission per sale. The exact rate depends on the product category and is visible on your merchant dashboard before listing." },
  { q: "Can I buy accounts in bulk?", a: "Yes. Bulk purchasing is supported. Contact our support team or message the merchant directly for bulk pricing and arrangements." },
];

export default function MarketplacePage() {
  return (
    <>
      <PageSeo
        title="Digital Accounts Marketplace"
        description="Browse thousands of verified digital accounts — social media, gaming, streaming, email and more. Buy with confidence on Speednet."
        keywords="buy accounts, sell accounts, social media accounts, gaming accounts, verified accounts marketplace africa"
        path="/services/marketplace"
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
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />Accounts Marketplace
              </span>
              <h1 className="text-[2.4rem] tab:text-[3.2rem] pc:text-[4.2rem] font-extrabold text-gray-900 leading-[1.1] mb-6">
                Buy &amp; Sell{" "}
                <span className="relative inline-block">
                  <span className="text-primary-600">Verified Digital</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 10" fill="none"><path d="M2 7 Q75 2 150 7 Q225 12 298 7" stroke="#E46300" strokeWidth="2.5" strokeLinecap="round" fill="none" /></svg>
                </span>
                {" "}Accounts
              </h1>
              <p className="text-gray-600 text-base pc:text-xl max-w-xl leading-relaxed mb-10">
                Africa's most trusted escrow-protected marketplace for social media, streaming, and digital accounts — with every seller verified.
              </p>
              <div className="flex flex-col tab:flex-row gap-4 justify-center pc:justify-start mb-10">
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm w-full tab:w-auto">
                    Start Shopping Free <FaArrowRight size={13} />
                  </button>
                </NavLink>
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-primary-600 text-gray-700 hover:text-primary-600 font-bold px-8 py-4 rounded-xl transition-all text-sm w-full tab:w-auto bg-white shadow-sm hover:-translate-y-0.5">
                    <FaStore size={14} /> Become a Seller
                  </button>
                </NavLink>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pc:justify-start">
                {["🛡️ Escrow Protected", "✅ Verified Sellers Only", "⚡ Instant Delivery", "🔄 Dispute Resolution"].map(t => (
                  <span key={t} className="text-xs text-gray-600 font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">{t}</span>
                ))}
              </div>
            </motion.div>
            {/* Right — floating product cards */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden pc:block flex-shrink-0 w-[380px] relative h-[420px]">
              {/* Main card */}
              <div className="absolute top-0 left-0 right-0 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center text-xl">📸</div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">Instagram Aged Account</p>
                    <p className="text-xs text-gray-400">Listed by VerifiedPro · ⭐ 4.9</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">In Stock</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-[10px] text-gray-400">Price</p>
                    <p className="text-xl font-extrabold text-gray-900">$0.70</p>
                  </div>
                  <button className="bg-primary-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Buy Now</button>
                </div>
              </div>
              {/* Escrow badge */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute bottom-28 -left-8 bg-white shadow-xl border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <RiShieldCheckLine className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-900">Escrow Active</p>
                  <p className="text-[9px] text-gray-400">Funds protected</p>
                </div>
              </motion.div>
              {/* Delivery badge */}
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-10 right-0 bg-white shadow-xl border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-[10px] font-bold text-gray-900">Delivered Instantly</p>
                  <p className="text-[9px] text-gray-400">10,482 orders today</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto grid grid-cols-2 pc:grid-cols-4 divide-x divide-white/10">
          {[{ v: "10K+", l: "Accounts Listed", icon: "🗂️" }, { v: "5K+", l: "Verified Merchants", icon: "✅" }, { v: "100%", l: "Escrow Protected", icon: "🛡️" }, { v: "24/7", l: "Support Available", icon: "🎧" }].map(({ v, l, icon }) => (
            <div key={l} className="flex flex-col items-center py-8 px-4 text-center">
              <span className="text-2xl mb-2">{icon}</span>
              <p className="text-2xl font-extrabold text-primary-600">{v}</p>
              <p className="text-xs text-gray-400 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Account Categories ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Browse Every Category</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">Thousands of verified listings across every major platform and digital service.</p>
        </motion.div>
        <div className="grid grid-cols-2 tab:grid-cols-3 pc:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {accountTypes.map(({ emoji, label, count }, i) => (
            <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-100 hover:border-primary-600/40 hover:shadow-xl hover:shadow-orange-100/60 cursor-pointer transition-all duration-300 bg-white relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[9px] font-bold text-primary-600 bg-primary-600/8 px-1.5 py-0.5 rounded-full">{count}</div>
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{emoji}</span>
              <span className="text-xs font-bold text-gray-700 group-hover:text-primary-600 transition-colors text-center leading-tight">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-pay px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Simple Process</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">How It Works</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm pc:text-base">Three simple steps to buy any digital account safely and securely.</p>
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
          <SectionLabel>Platform Benefits</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Why Trade on Speednet?</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">Built for trust, speed, and complete buyer protection at every step.</p>
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

      {/* ── Merchant / Seller Section ── */}
      <section className="bg-secondary px-5 pc:px-20 py-20 pc:py-24 overflow-hidden relative">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto flex flex-col pc:flex-row items-center gap-14 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex-1">
            <SectionLabel light>For Sellers</SectionLabel>
            <h2 className="text-2xl pc:text-4xl font-extrabold text-white mt-1 mb-5 leading-tight">
              Start Earning on <span className="text-primary-600">Africa's Fastest</span> Growing Marketplace
            </h2>
            <p className="text-gray-300 text-sm pc:text-base leading-relaxed mb-8">
              Join 5,000+ verified merchants already making consistent income selling digital accounts on Speednet. Zero upfront fees, instant payouts.
            </p>
            <div className="flex flex-col gap-4 mb-8">
              {[
                { icon: <TbRocket size={18} className="text-primary-600" />, t: "Get listed in under 24 hours" },
                { icon: <MdTrendingUp size={18} className="text-primary-600" />, t: "Access 70,000+ active buyers" },
                { icon: <BiWallet size={18} className="text-primary-600" />, t: "Instant wallet payouts, any time" },
                { icon: <MdOutlineSupportAgent size={18} className="text-primary-600" />, t: "Dedicated merchant support team" },
              ].map(({ icon, t }) => (
                <div key={t} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">{icon}</div>
                  <span className="text-sm text-gray-200">{t}</span>
                </div>
              ))}
            </div>
            <NavLink to="/auth/register">
              <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/30 transition-all text-sm">
                <FaStore size={14} /> Become a Merchant
              </button>
            </NavLink>
          </motion.div>
          {/* Stats grid */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 grid grid-cols-2 gap-4">
            {[{ v: "₦0", l: "Listing Fee" }, { v: "5K+", l: "Active Merchants" }, { v: "24h", l: "Approval Time" }, { v: "100%", l: "Secure Payouts" }].map(({ v, l }) => (
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
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Trusted by Thousands</h2>
          <p className="text-gray-500 mt-3 text-sm pc:text-base">What buyers and sellers are saying about Speednet Marketplace.</p>
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

      {/* ── Trust Strip ── */}
      <section className="bg-pay border-y border-orange-100 px-5 pc:px-20 py-8">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
          {[
            { icon: <RiShieldCheckLine size={16} className="text-primary-600" />, t: "256-bit SSL Encryption" },
            { icon: <RiVerifiedBadgeFill size={16} className="text-primary-600" />, t: "All Sellers Verified" },
            { icon: <FaShieldAlt size={14} className="text-primary-600" />, t: "Escrow on Every Trade" },
            { icon: <MdGavel size={16} className="text-primary-600" />, t: "Free Dispute Resolution" },
            { icon: <TbWorld size={16} className="text-primary-600" />, t: "50+ Countries Served" },
            { icon: <MdOutlineSupportAgent size={16} className="text-primary-600" />, t: "24/7 Live Support" },
          ].map(({ icon, t }) => (
            <div key={t} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <div className="w-6 h-6 rounded-full bg-primary-600/10 flex items-center justify-center">{icon}</div>{t}
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
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
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[60px] pointer-events-none" />
        <motion.div className="relative z-10 max-w-xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 bg-primary-600/20 text-primary-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-primary-600/30">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />Join 70,000+ Users
          </span>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-white mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-300 text-sm pc:text-base mb-10">Join thousands of buyers and sellers on Africa's most trusted digital marketplace. Free to join, forever.</p>
          <div className="flex flex-col tab:flex-row gap-3 justify-center">
            <NavLink to="/auth/register">
              <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/30 hover:-translate-y-0.5 transition-all text-sm w-full tab:w-auto">
                Create Free Account <FaArrowRight size={13} />
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

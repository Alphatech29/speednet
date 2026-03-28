import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { HiCheckCircle, HiChevronDown, HiArrowRight } from "react-icons/hi";
import { FaArrowRight, FaHandshake } from "react-icons/fa";
import { RiP2pFill, RiShieldCheckLine } from "react-icons/ri";
import { MdGavel, MdOutlineVerified, MdOutlineSupportAgent } from "react-icons/md";
import { BiTransfer, BiWallet } from "react-icons/bi";

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

const escrowSteps = [
  { emoji: "🛒", label: "Buyer Places Order", desc: "Buyer selects a product and pays. Funds move to escrow — not the seller." },
  { emoji: "🔒", label: "Funds Held in Escrow", desc: "Speednet holds the funds securely until both parties fulfill their obligations." },
  { emoji: "📦", label: "Seller Delivers", desc: "Seller delivers the digital product or account credentials to the buyer." },
  { emoji: "✅", label: "Buyer Confirms", desc: "Buyer confirms receipt. Escrow releases funds to the seller's wallet automatically." },
];

const buyerBenefits = [
  "Money held in escrow until you confirm delivery",
  "Full refund if seller doesn't deliver",
  "24-hour dispute window after delivery",
  "Verified seller profiles with ratings",
  "Instant delivery on digital products",
];

const sellerBenefits = [
  "Instant order notifications",
  "Automatic settlement after buyer confirms",
  "Transparent commission deduction",
  "Merchant dashboard with analytics",
  "Withdraw earnings anytime to bank or wallet",
];

const features = [
  { icon: <RiShieldCheckLine size={22} className="text-primary-600" />, title: "Smart Escrow", desc: "Funds are locked in a secure escrow smart system until both parties confirm the transaction." },
  { icon: <MdGavel size={22} className="text-primary-600" />, title: "Dispute Resolution", desc: "Our team mediates every dispute fairly, with 24-48 hour resolution guarantee." },
  { icon: <MdOutlineVerified size={22} className="text-primary-600" />, title: "Verified Profiles", desc: "Every buyer and seller has a verified profile with transaction history and ratings." },
  { icon: <BiTransfer size={22} className="text-primary-600" />, title: "Instant Settlement", desc: "Once buyer confirms, funds are instantly released to the seller's wallet — no delays." },
  { icon: <MdOutlineSupportAgent size={22} className="text-primary-600" />, title: "24/7 Mediation", desc: "Human support agents available around the clock to handle any trading issues." },
  { icon: <BiWallet size={22} className="text-primary-600" />, title: "Multi-Currency Wallet", desc: "Account balance, escrow balance, and merchant balance — all in one dashboard." },
];

const faqs = [
  { q: "How does the escrow timer work?", a: "After a seller delivers, a countdown timer starts. If the buyer doesn't dispute within the timer period, funds are automatically released to the seller. The default timer is set by the platform per product category." },
  { q: "What happens if there's a dispute?", a: "Either party can open a dispute. Our team investigates by reviewing delivery evidence. We'll either force a replacement, partial refund, or full refund depending on the outcome." },
  { q: "How long until I receive my payment as a seller?", a: "After the buyer confirms receipt (or the escrow timer expires), funds are instantly sent to your merchant wallet. From there you can withdraw to bank or use for purchases." },
  { q: "Is there a fee for using P2P trading?", a: "Speednet charges a small commission on each sale, deducted from the seller's earnings. Buyers pay no extra fees beyond the listed price. Commission rates vary by category and are visible on your dashboard." },
];

export default function P2PTradingPage() {
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
          <div className="max-w-5xl mx-auto flex flex-col pc:flex-row items-center gap-14">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }} className="flex-1 text-center pc:text-left">
              <span className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-600 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-primary-600/20">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />P2P Escrow Trading
              </span>
              <h1 className="text-[2.2rem] tab:text-[3rem] pc:text-[3.8rem] font-extrabold text-gray-900 leading-tight mb-5">
                Trade Peer-to-Peer with{" "}
                <span className="text-primary-600">Zero Risk.</span>
                {" "}Always Protected.
              </h1>
              <p className="text-gray-600 text-base pc:text-lg max-w-xl leading-relaxed mb-8">
                Buy and sell digital products directly with other users. Every transaction is protected by our smart escrow system — no fraud, no disputes unresolved.
              </p>
              <div className="flex flex-col tab:flex-row gap-4 justify-center pc:justify-start mb-8">
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/25 transition-all text-sm w-full tab:w-auto">
                    Start Trading <FaArrowRight size={13} />
                  </button>
                </NavLink>
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-primary-600 text-gray-700 hover:text-primary-600 font-bold px-8 py-4 rounded-xl transition-all text-sm w-full tab:w-auto bg-white shadow-sm">
                    Become a Seller <HiArrowRight size={16} />
                  </button>
                </NavLink>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pc:justify-start">
                {["🔒 Escrow Protected", "⚡ Instant Settlement", "🛡️ Dispute Resolution", "✅ Verified Traders"].map(t => (
                  <span key={t} className="text-xs text-gray-600 font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">{t}</span>
                ))}
              </div>
            </motion.div>
            {/* Visual */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden pc:flex w-72 flex-shrink-0 flex-col gap-3">
              {[{ emoji: "🛒", label: "Order Placed", color: "bg-blue-50 border-blue-200 text-blue-700" },
                { emoji: "🔒", label: "Funds in Escrow", color: "bg-orange-50 border-primary-600/20 text-primary-600" },
                { emoji: "📦", label: "Product Delivered", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                { emoji: "✅", label: "Payment Released", color: "bg-green-50 border-green-200 text-green-700" }].map(({ emoji, label, color }, i) => (
                <motion.div key={label} animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut", delay: i * 0.4 }}
                  className={`flex items-center gap-3 ${color} border rounded-xl px-4 py-3 shadow-sm`}>
                  <span className="text-xl">{emoji}</span>
                  <span className="text-sm font-bold">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Escrow Flow ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>How Escrow Works</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Your Money, Protected Every Step</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">Our escrow system holds funds safely between buyer and seller until both parties are satisfied.</p>
        </motion.div>
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 tab:grid-cols-4 gap-6">
          <div className="hidden tab:block absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary-600/30 to-transparent" />
          {escrowSteps.map(({ emoji, label, desc }, i) => (
            <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center text-3xl">{emoji}</div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">{i + 1}</span>
              </div>
              <p className="text-sm font-extrabold text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Buyer vs Seller ── */}
      <section className="bg-pay px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>For Everyone</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Benefits for Buyers & Sellers</h2>
        </motion.div>
        <div className="grid grid-cols-1 tab:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[{ title: "For Buyers", emoji: "🛒", items: buyerBenefits, color: "border-blue-200 bg-blue-50/50" },
            { title: "For Sellers", emoji: "💼", items: sellerBenefits, color: "border-primary-600/30 bg-orange-50/30" }].map(({ title, emoji, items, color }) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
              className={`bg-white border rounded-2xl p-7 shadow-sm ${color}`}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{emoji}</span>
                <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
              </div>
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <HiCheckCircle className="text-primary-600 text-lg mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Platform Features</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Built for Safe Trading</h2>
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

      {/* ── FAQ ── */}
      <section className="bg-pay px-5 pc:px-20 py-20 pc:py-24">
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
          <h2 className="text-2xl pc:text-4xl font-extrabold text-white mb-4">Start Trading Safely Today</h2>
          <p className="text-gray-300 text-sm pc:text-base mb-8">Join thousands of buyers and sellers using Speednet's escrow-protected P2P platform.</p>
          <div className="flex flex-col tab:flex-row gap-3 justify-center">
            <NavLink to="/auth/register">
              <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/30 transition-all text-sm w-full tab:w-auto">
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { HiCheckCircle, HiChevronDown } from "react-icons/hi";
import { FaArrowRight, FaLock } from "react-icons/fa";
import { RiShieldCheckLine, RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlineAccountBalance, MdOutlineSpeed, MdOutlineSupportAgent } from "react-icons/md";
import { BiWallet } from "react-icons/bi";
import { TbCurrencyBitcoin } from "react-icons/tb";

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

const gateways = [
  {
    emoji: "🏦",
    name: "Monnify",
    subtitle: "Bank Transfer (NGN)",
    desc: "Deposit via Nigerian bank transfer. Instant confirmation, no extra fees. Virtual account assigned to your profile.",
    tags: ["NGN Only", "Instant", "No Fees"],
    color: "border-blue-200 bg-blue-50/40",
    badge: "Most Used",
  },
  {
    emoji: "💎",
    name: "Cryptomus",
    subtitle: "USDT / TRON Network",
    desc: "Fund your wallet with USDT on the TRON (TRC-20) network. Perfect for international users and crypto holders.",
    tags: ["USDT/TRC-20", "Global", "Low Fees"],
    color: "border-purple-200 bg-purple-50/40",
    badge: null,
  },
  {
    emoji: "📱",
    name: "Fapshi",
    subtitle: "Mobile Money (Cameroon)",
    desc: "Deposit using MTN Mobile Money or Orange Money in Cameroon. Seamless and instant for Cameroonian users.",
    tags: ["Cameroon", "MTN/Orange", "Instant"],
    color: "border-green-200 bg-green-50/40",
    badge: null,
  },
];

const features = [
  { icon: <FaLock size={20} className="text-primary-600" />, title: "Bank-Grade Security", desc: "All transactions use AES-256 encryption. Your payment data is never stored on our servers." },
  { icon: <MdOutlineSpeed size={22} className="text-primary-600" />, title: "Instant Confirmation", desc: "Wallet is credited instantly upon payment confirmation — no waiting periods." },
  { icon: <RiShieldCheckLine size={22} className="text-primary-600" />, title: "IP Whitelisting", desc: "Crypto webhooks are IP-whitelisted and signature-verified for maximum security." },
  { icon: <MdOutlineAccountBalance size={22} className="text-primary-600" />, title: "Virtual Account", desc: "Monnify users get a dedicated virtual bank account number for seamless deposits." },
  { icon: <TbCurrencyBitcoin size={22} className="text-primary-600" />, title: "Crypto Friendly", desc: "International users can fund via USDT with automatic NGN conversion at fair rates." },
  { icon: <MdOutlineSupportAgent size={22} className="text-primary-600" />, title: "24/7 Payment Support", desc: "Dedicated payment support team available around the clock for any funding issues." },
];

const walletFeatures = [
  "Separate account, escrow, and merchant balances",
  "Instant transfer between balance types",
  "Full transaction history with filtering",
  "Withdraw to Nigerian bank account anytime",
  "Minimum withdrawal: $10",
  "Same-day withdrawal processing",
];

const faqs = [
  { q: "How long does a bank transfer deposit take?", a: "Monnify bank transfers are confirmed and credited to your wallet within 1–5 minutes after payment. In rare cases, it may take up to 30 minutes due to bank processing times." },
  { q: "Are there deposit fees?", a: "Speednet does not charge deposit fees. However, your bank may charge a transfer fee. Crypto deposits on the TRON network have very low network fees (usually < $1)." },
  { q: "Can I withdraw to my bank account?", a: "Yes! From your wallet, click Withdraw, enter your bank details, and the amount. Withdrawals are processed same-day during business hours (8AM–8PM WAT)." },
  { q: "Is USDT deposit available to all countries?", a: "Yes. Crypto deposits via Cryptomus (USDT/TRC-20) are available to users worldwide. There is no geographic restriction for crypto funding." },
  { q: "What is the minimum deposit amount?", a: "Minimum deposit via bank transfer is ₦100. For crypto, minimum is $1 USDT. For mobile money (Fapshi), minimum varies by the gateway's rules." },
];

export default function PaymentsPage() {
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
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />Multi-Gateway Payments
              </span>
              <h1 className="text-[2.2rem] tab:text-[3rem] pc:text-[4rem] font-extrabold text-gray-900 leading-tight mb-5">
                Fund Your Wallet{" "}
                <span className="text-primary-600">Your Way.</span>
                {" "}Always Secure.
              </h1>
              <p className="text-gray-600 text-base pc:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                Three powerful payment gateways — bank transfer, crypto, and mobile money. Instant deposits, zero hidden fees, bank-grade security.
              </p>
              <div className="flex flex-col tab:flex-row gap-4 justify-center mb-12">
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/25 transition-all text-sm w-full tab:w-auto">
                    Create Free Wallet <FaArrowRight size={13} />
                  </button>
                </NavLink>
              </div>
              {/* Gateway logos row */}
              <div className="flex flex-wrap justify-center gap-4">
                {gateways.map(({ emoji, name, subtitle }) => (
                  <div key={name} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <span className="text-xl">{emoji}</span>
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-gray-900">{name}</p>
                      <p className="text-[10px] text-gray-400">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Payment Gateways ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Payment Gateways</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Three Ways to Fund Your Wallet</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">Choose the gateway that works best for your location and preference.</p>
        </motion.div>
        <div className="grid grid-cols-1 tab:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {gateways.map(({ emoji, name, subtitle, desc, tags, color, badge }, i) => (
            <motion.div key={name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative group border rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:shadow-orange-100/50 ${color}`}>
              {badge && <span className="absolute -top-2 left-6 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-600 text-white">{badge}</span>}
              <span className="text-4xl mb-4 block">{emoji}</span>
              <h3 className="text-lg font-extrabold text-gray-900 mb-0.5">{name}</h3>
              <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(t => (
                  <span key={t} className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Wallet Features ── */}
      <section className="bg-secondary px-5 pc:px-20 py-20 pc:py-24">
        <div className="max-w-5xl mx-auto flex flex-col pc:flex-row items-center gap-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex-1">
            <SectionLabel>Smart Wallet</SectionLabel>
            <h2 className="text-2xl pc:text-4xl font-extrabold text-white mt-1 mb-5 leading-tight">
              One Wallet.<br />Three Balances.
            </h2>
            <p className="text-gray-300 text-sm pc:text-base leading-relaxed mb-6">
              Your Speednet wallet has three separate balances — account balance for purchases, escrow balance during active trades, and merchant balance for seller earnings.
            </p>
            <div className="flex flex-col gap-3">
              {walletFeatures.map(t => (
                <div key={t} className="flex items-center gap-3"><HiCheckCircle className="text-primary-600 text-lg flex-shrink-0" /><span className="text-sm text-gray-200">{t}</span></div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <BiWallet className="text-primary-600 text-2xl" />
                <span className="font-extrabold text-white">My Wallet</span>
              </div>
              {[{ label: "Account Balance", val: "$ 25,400.00", color: "text-green-400" },
                { label: "Escrow Balance", val: "$ 5,000.00", color: "text-yellow-400" },
                { label: "Merchant Balance", val: "$ 12,800.00", color: "text-primary-600" }].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-white/8 last:border-0">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className={`text-sm font-extrabold ${color}`}>{val}</span>
                </div>
              ))}
              <button className="w-full mt-5 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-sm transition-all">
                Fund Wallet →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Security Features ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Security</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Your Money is Safe With Us</h2>
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
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Payment Questions</h2>
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
          <h2 className="text-2xl pc:text-4xl font-extrabold text-white mb-4">Create Your Free Wallet</h2>
          <p className="text-gray-300 text-sm pc:text-base mb-8">Sign up in 2 minutes and fund your wallet using your preferred payment method.</p>
          <NavLink to="/auth/register">
            <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-10 py-4 rounded-xl shadow-xl shadow-primary-600/30 transition-all text-sm">
              Get Started Free <FaArrowRight size={13} />
            </button>
          </NavLink>
        </motion.div>
      </section>
    </>
  );
}

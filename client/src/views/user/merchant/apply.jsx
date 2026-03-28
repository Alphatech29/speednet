import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { HiShieldCheck, HiArrowRight, HiLightningBolt } from "react-icons/hi";
import { FaStore, FaRocket, FaUpload, FaLock, FaUsers } from "react-icons/fa";
import { MdVerified, MdTrendingUp } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { AuthContext } from "../../../components/control/authContext";
import Activate from "./modal/activate";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const benefits = [
  { icon: <FaUsers size={18} />, title: "Wide Audience", desc: "Reach thousands of active buyers on our growing marketplace.", color: "bg-blue-100 text-blue-600" },
  { icon: <FaUpload size={18} />, title: "Seamless Listing", desc: "Easily upload products with detailed descriptions and pricing.", color: "bg-purple-100 text-purple-600" },
  { icon: <HiLightningBolt size={18} />, title: "Instant Processing", desc: "Fast automated transactions for buyers and sellers.", color: "bg-yellow-100 text-yellow-600" },
  { icon: <FaLock size={18} />, title: "Secure Payments", desc: "Get paid instantly with escrow protection on every sale.", color: "bg-green-100 text-green-600" },
  { icon: <MdTrendingUp size={18} />, title: "Track Earnings", desc: "Real-time dashboard with detailed sales analytics.", color: "bg-orange-100 text-orange-600" },
  { icon: <BiPackage size={18} />, title: "Product Management", desc: "Full control to update, pause or remove listings anytime.", color: "bg-pink-100 text-pink-600" },
];

const steps = [
  { n: "01", title: "Activate Account", desc: "Pay a one-time merchant activation fee to unlock seller access." },
  { n: "02", title: "List Products", desc: "Upload your digital accounts or services with pricing and details." },
  { n: "03", title: "Start Selling", desc: "Buyers browse and purchase your listings securely on the platform." },
  { n: "04", title: "Get Paid", desc: "Earnings are credited to your merchant wallet after each sale." },
];

const Apply = () => {
  const [isActivate, setActivate] = useState(false);
  const { webSettings } = useContext(AuthContext);
  const currency = webSettings?.currency || "$";
  const fee = webSettings?.merchant_activation_fee || "0.00";

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Become a Merchant</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">Start selling digital products on the Speednet marketplace</p>
      </div>

      {/* Hero banner */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-secondary via-primary-100 to-slate-900 rounded-3xl p-8 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-600/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex flex-col tab:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center flex-shrink-0">
            <FaStore size={28} className="text-primary-500" />
          </div>
          <div className="flex-1 text-center tab:text-left">
            <h2 className="text-2xl pc:text-3xl font-extrabold text-white mb-2">
              Sell on <span className="text-primary-500">Speednet</span> Marketplace
            </h2>
            <p className="text-slate-400 text-sm max-w-lg">
              Monetize your digital assets — premium accounts, subscriptions, and services.
              One-time activation for <strong className="text-white">{currency}{fee}</strong> and you're live instantly.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setActivate(true)}
              className="flex items-center gap-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-primary-600/30 hover:-translate-y-0.5 transition-all"
            >
              <FaRocket size={14} />
              Activate Now
              <HiArrowRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 pc:grid-cols-2 gap-5">
        {/* Left — benefits */}
        <div className="flex flex-col gap-5">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-5">Why Sell With Us</p>
            <div className="grid grid-cols-1 gap-3">
              {benefits.map(({ icon, title, desc, color }) => (
                <div key={title} className="flex items-start gap-4 p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary-600/20 transition-all">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{title}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — steps + pricing */}
        <div className="flex flex-col gap-5">
          {/* How it works */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-5">How It Works</p>
            <div className="flex flex-col gap-4">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-primary-600/10 border border-primary-600/20 flex items-center justify-center flex-shrink-0 text-[11px] font-extrabold text-primary-600">
                    {n}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{title}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pricing card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border-2 border-primary-600/20 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center">
                  <MdVerified size={16} className="text-primary-600" />
                </div>
                <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Merchant Plan</p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{currency}{fee}</span>
                <span className="text-sm text-gray-400 dark:text-slate-500 ml-2">one-time fee</span>
              </div>
              <ul className="space-y-2 mb-6">
                {["Full marketplace access", "Unlimited product listings", "Instant payment processing", "Dedicated merchant dashboard", "Escrow protection on all sales"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-slate-300">
                    <HiShieldCheck size={15} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setActivate(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm"
              >
                <FaRocket size={13} />
                Activate Merchant Account
              </button>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 text-center mt-3">
                Fee is deducted from your wallet balance
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {isActivate && <Activate onClose={() => setActivate(false)} />}
    </div>
  );
};

export default Apply;

import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiGiftTop } from "react-icons/hi2";
import { IoMdWallet } from "react-icons/io";
import { FaUsers, FaCopy, FaCheck, FaShareAlt } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { HiExternalLink } from "react-icons/hi";
import Pending from "./tabs/pending";
import Completed from "./tabs/completed";
import { AuthContext } from "../../../components/control/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchReferralsByUser } from "../../../components/backendApis/referral/referral";

const fadeUp = {
  hidden:   { opacity: 0, y: 18 },
  visible:  (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.38, delay: i * 0.08, ease: "easeOut" } }),
};

const STEPS = [
  { n: "01", title: "Copy your link",   desc: "Share your unique referral link with friends and family." },
  { n: "02", title: "Friend signs up",  desc: "They register on Speednet using your referral link." },
  { n: "03", title: "They fund & buy",  desc: "Friend funds wallet ($25+) and makes their first purchase." },
  { n: "04", title: "You earn $5",      desc: "Reward is instantly credited to your Speednet wallet." },
];

const TABS = [
  { id: "pending",   label: "Pending",   Icon: MdOutlinePendingActions },
  { id: "completed", label: "Completed", Icon: GiConfirmed },
];

/* ── Stat card ── */
const StatCard = ({ icon, label, value, loading, accent }) => (
  <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
    <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">{label}</p>
      <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">
        {loading ? <span className="inline-block w-12 h-5 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" /> : value}
      </p>
    </div>
  </div>
);

const Referral = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [referrals, setReferrals]     = useState([]);
  const [referralCount, setReferralCount] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [copied, setCopied]           = useState(false);
  const [activeTab, setActiveTab]     = useState("pending");

  const currency    = webSettings?.currency || "$";
  const referralLink = webSettings?.web_url && user?.uid
    ? `${webSettings.web_url}/auth/register?ref=${user.uid}`
    : "";

  const copyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast.success("Referral link copied!");
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => toast.error("Failed to copy link"));
  };

  const shareLink = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Speednet",
          text: "Use my referral link to sign up on Speednet and we both earn rewards!",
          url: referralLink,
        });
      } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
  };

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);

    const load = async () => {
      try {
        const res = await fetchReferralsByUser(user.uid);
        if (res.success && Array.isArray(res.data)) {
          setReferrals(res.data);
          setReferralCount(res.data.length);
          const earned = res.data
            .filter((r) => r.referral_status === 1)
            .reduce((s, r) => s + Number(r.referral_amount || 0), 0);
          setTotalEarned(earned);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };

    load();
  }, [user?.uid]);

  const pendingCount   = referrals.filter((r) => r.referral_status === 0).length;
  const completedCount = referrals.filter((r) => r.referral_status === 1).length;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <ToastContainer position="top-right" theme="colored" />

      {/* Page header */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="mb-6"
      >
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Referral Program</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">Earn rewards by inviting friends to Speednet</p>
      </motion.div>

      {/* Hero banner */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="relative bg-gradient-to-br from-secondary via-[#2a0e02] to-slate-900 rounded-3xl p-7 pc:p-10 mb-6 overflow-hidden"
      >
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col tab:flex-row items-center gap-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-3xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center flex-shrink-0">
            <HiGiftTop size={32} className="text-primary-500" />
          </div>

          {/* Text */}
          <div className="flex-1 text-center tab:text-left">
            <h2 className="text-2xl pc:text-3xl font-extrabold text-white mb-2">
              Earn <span className="text-primary-500">$5</span> per Referral
            </h2>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              When your friend registers, funds their wallet with a minimum of{" "}
              <strong className="text-white">$25</strong> and completes their first purchase, you get rewarded instantly.
            </p>
          </div>

          {/* Mini stat bubbles */}
          <div className="flex gap-3 flex-shrink-0">
            <div className="bg-white/8 border border-white/10 rounded-2xl px-5 py-3.5 text-center min-w-[80px]">
              {loading
                ? <div className="w-10 h-6 bg-white/10 rounded-lg animate-pulse mx-auto mb-1" />
                : <p className="text-2xl font-extrabold text-primary-500">{referralCount}</p>
              }
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Referrals</p>
            </div>
            <div className="bg-white/8 border border-white/10 rounded-2xl px-5 py-3.5 text-center min-w-[80px]">
              {loading
                ? <div className="w-10 h-6 bg-white/10 rounded-lg animate-pulse mx-auto mb-1" />
                : <p className="text-2xl font-extrabold text-primary-500">{currency}{totalEarned}</p>
              }
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Earned</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 pc:grid-cols-2 gap-5">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-5">

          {/* Referral link card */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm"
          >
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-4">
              Your Referral Link
            </p>

            {/* Link display */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 mb-4">
              <HiExternalLink size={13} className="text-primary-600 flex-shrink-0" />
              <input
                type="text"
                value={referralLink || "Loading your link..."}
                readOnly
                className="bg-transparent text-xs text-gray-600 dark:text-slate-300 w-full outline-none font-mono flex-1 min-w-0"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                disabled={!referralLink}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-2xl shadow-md shadow-primary-600/25 transition-all hover:-translate-y-0.5"
              >
                {copied
                  ? <><FaCheck size={12} /> Copied!</>
                  : <><FaCopy size={12} /> Copy Link</>
                }
              </button>
              <button
                onClick={shareLink}
                disabled={!referralLink}
                className="w-11 h-11 flex items-center justify-center bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 text-gray-600 dark:text-slate-300 rounded-2xl transition-all flex-shrink-0"
                title="Share link"
              >
                <FaShareAlt size={14} />
              </button>
            </div>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="grid grid-cols-2 gap-4"
          >
            <StatCard
              icon={<IoMdWallet size={18} className="text-primary-600" />}
              label="Total Earned"
              value={`${currency}${totalEarned.toLocaleString()}`}
              loading={loading}
              accent="bg-primary-600/10"
            />
            <StatCard
              icon={<FaUsers size={16} className="text-blue-600" />}
              label="Total Referrals"
              value={referralCount}
              loading={loading}
              accent="bg-blue-100 dark:bg-blue-900/30"
            />
          </motion.div>

          {/* How it works */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm"
          >
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-5">
              How It Works
            </p>
            <div className="relative flex flex-col gap-0">
              {STEPS.map(({ n, title, desc }, i) => (
                <div key={n} className="flex items-start gap-4 pb-5 last:pb-0 relative">
                  {/* connecting line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-100 dark:bg-white/5" />
                  )}
                  <div className="w-8 h-8 rounded-xl bg-primary-600/10 border border-primary-600/20 flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold text-primary-600 z-10">
                    {n}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{title}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right column — referral records ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col"
        >
          {/* Card header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-50 dark:border-white/5">
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-4">
              Referral Records
            </p>

            {/* Custom tab pills */}
            <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl">
              {TABS.map(({ id, label, Icon }) => {
                const count = id === "pending" ? pendingCount : completedCount;
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white dark:bg-slate-900 text-primary-600 shadow-sm"
                        : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                    {!loading && count > 0 && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-primary-600 text-white"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "pending"
                  ? <Pending referrals={referrals} loading={loading} />
                  : <Completed referrals={referrals} loading={loading} />
                }
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Referral;

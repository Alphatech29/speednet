import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import { HiTrendingUp, HiArrowRight, HiRefresh } from "react-icons/hi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdStorefront } from "react-icons/md";
import RecentSubmition from "./partials/deposit&submition";
import { getAllUsers } from "../../../../components/backendApis/admin/apis/users";
import { getAllWithdrawals } from "../../../../components/backendApis/admin/apis/withdrawal";
import { getAllMerchantTransactions } from "../../../../components/backendApis/admin/apis/histroy";

/* ─── Animation ──────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Greeting helper ────────────────────────────────────────────── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const todayLabel = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

/* ─── Stat card ──────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon: Icon, gradient, iconColor, loading, index, to }) => (
  <motion.div
    variants={fadeUp} initial="hidden" animate="visible" custom={index}
    className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
  >
    {/* Subtle background glow */}
    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${gradient}`} />

    <div className="relative flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
          {sub && <p className="text-[10px] text-gray-300 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient} flex-shrink-0`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>

      {/* Value */}
      {loading
        ? <div className="space-y-2">
            <div className="h-8 w-28 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-3 w-16 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        : <div>
            <p className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-none">{value}</p>
            {to && (
              <NavLink to={to}
                className="inline-flex items-center gap-1 text-[11px] text-primary-600 font-semibold mt-1.5 hover:gap-2 transition-all">
                View all <HiArrowRight size={11} />
              </NavLink>
            )}
          </div>
      }
    </div>
  </motion.div>
);

/* ─── Quick info pill ────────────────────────────────────────────── */
const InfoPill = ({ label, value, color }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${color} text-xs font-semibold`}>
    <span className="opacity-60">{label}</span>
    <span className="font-extrabold">{value}</span>
  </div>
);

/* ─── Main component ─────────────────────────────────────────────── */
const DefaultDashboard = () => {
  const [users,             setUsers]             = useState([]);
  const [totalWithdrawal,   setTotalWithdrawal]   = useState(0);
  const [totalSystemAmount, setTotalSystemAmount] = useState(0);
  const [loading,           setLoading]           = useState(true);
  const [refreshKey,        setRefreshKey]        = useState(0);
  const [refreshing,        setRefreshing]        = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [usersRes, wdRes, txnRes] = await Promise.all([
        getAllUsers(),
        getAllWithdrawals(),
        getAllMerchantTransactions(),
      ]);
      if (usersRes?.data && Array.isArray(usersRes.data)) setUsers(usersRes.data);
      if (wdRes?.success && Array.isArray(wdRes.data)) {
        const total = wdRes.data
          .filter((w) => w.status === "completed")
          .reduce((s, w) => s + Number(w.amount || 0), 0);
        setTotalWithdrawal(total);
      }
      if (txnRes?.success && Array.isArray(txnRes.data)) {
        const total = txnRes.data
          .filter((t) => t.status === "system")
          .reduce((s, t) => s + Number(t.amount || 0), 0);
        setTotalSystemAmount(total);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const merchantCount = users.filter((u) => u.role === "merchant").length;
  const regularCount  = users.length - merchantCount;

  const stats = [
    {
      label:     "Total Users",
      value:     users.length.toLocaleString(),
      sub:       "Registered accounts",
      icon:      FaUsers,
      gradient:  "bg-blue-100",
      iconColor: "text-blue-600",
      to:        "/admin/users",
    },
    {
      label:     "Merchants",
      value:     merchantCount.toLocaleString(),
      sub:       "Active sellers",
      icon:      MdStorefront,
      gradient:  "bg-orange-100",
      iconColor: "text-orange-600",
      to:        "/admin/vendor",
    },
    {
      label:     "Commission",
      value:     `$${Number(totalSystemAmount).toLocaleString()}`,
      sub:       "System earnings",
      icon:      HiTrendingUp,
      gradient:  "bg-purple-100",
      iconColor: "text-purple-600",
      to:        "/admin/histroy/transaction",
    },
    {
      label:     "Total Payout",
      value:     `$${Number(totalWithdrawal).toLocaleString()}`,
      sub:       "Completed withdrawals",
      icon:      RiMoneyDollarCircleLine,
      gradient:  "bg-emerald-100",
      iconColor: "text-emerald-600",
      to:        "/admin/withdrawal",
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex flex-wrap items-start justify-between gap-3"
      >
        <div>
          <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">{todayLabel()}</p>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">
            {getGreeting()}, Admin 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Here's what's happening on your platform today.</p>
        </div>

        <button
          onClick={() => { setRefreshKey((k) => k + 1); }}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all shadow-sm"
        >
          <HiRefresh size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} loading={loading} index={i + 1} />
        ))}
      </div>

      {/* ── Quick breakdown bar ── */}
      {!loading && (
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <p className="text-xs font-bold text-gray-700">User Breakdown</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Composition of all registered accounts</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <InfoPill label="Regular" value={regularCount.toLocaleString()}  color="bg-blue-50 border-blue-100 text-blue-700" />
            <InfoPill label="Merchant" value={merchantCount.toLocaleString()} color="bg-orange-50 border-orange-100 text-orange-700" />
            <InfoPill label="Total"    value={users.length.toLocaleString()}  color="bg-gray-50 border-gray-200 text-gray-700" />
          </div>

          {/* Progress bar */}
          <div className="w-full">
            <div className="flex rounded-full overflow-hidden h-2 bg-gray-100">
              {users.length > 0 && (
                <>
                  <div
                    className="bg-blue-400 transition-all duration-700"
                    style={{ width: `${(regularCount / users.length) * 100}%` }}
                  />
                  <div
                    className="bg-orange-400 transition-all duration-700"
                    style={{ width: `${(merchantCount / users.length) * 100}%` }}
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1.5">
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Regular users
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Merchants
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Recent activity tables ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
        <RecentSubmition />
      </motion.div>

    </div>
  );
};

export default DefaultDashboard;

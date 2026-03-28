import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../../components/control/authContext";
import { getUserOrderHistory } from "../../../components/backendApis/history/orderHistory";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { BiTransfer, BiSearch } from "react-icons/bi";
import { HiChevronDown, HiCheck } from "react-icons/hi";
import { MdTrendingUp, MdPending, MdCheckCircle, MdCancel } from "react-icons/md";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const STATUS_CONFIG = {
  completed: {
    classes: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
  },
  credited: {
    classes: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
  },
  pending: {
    classes: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
  },
  refunded: {
    classes: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50",
  },
  system: {
    classes: "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-600",
  },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase();
  const cfg = STATUS_CONFIG[key] || "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50";
  const classes = typeof cfg === "string" ? cfg : cfg.classes;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${classes}`}>
      {status || "Unknown"}
    </span>
  );
};

const FILTER_OPTIONS = [
  { value: "all",       label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "credited",  label: "Credited" },
  { value: "pending",   label: "Pending" },
  { value: "refunded",  label: "Refunded" },
];

const Transaction = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [filter, setFilter]             = useState("all");
  const [filterOpen, setFilterOpen]     = useState(false);
  const filterRef = useRef(null);

  /* close filter dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchOrderHistory = async () => {
      if (!user?.uid) { setError("User not authenticated"); setLoading(false); return; }
      try {
        const response = await getUserOrderHistory(String(user.uid));
        const { orderHistory = [], merchantHistory = [] } = response.data || {};
        const merged = [
          ...orderHistory.map((o) => ({
            id:     o.order_no || "N/A",
            type:   o.order_type || "Unknown",
            amount: o.amount || 0,
            status: o.status || "Unknown",
            date:   o.updated_at ? new Date(o.updated_at) : new Date(),
            source: "Order",
          })),
          ...merchantHistory.map((t) => ({
            id:     t.transaction_id || "N/A",
            type:   t.transaction_type || "Unknown",
            amount: t.amount || 0,
            status: t.status || "Unknown",
            date:   t.created_at ? new Date(t.created_at) : new Date(),
            source: "Transaction",
          })),
        ].sort((a, b) => b.date - a.date);

        setTransactions(merged);
        setError(null);
      } catch {
        setError("Error fetching transaction history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
    intervalId = setInterval(fetchOrderHistory, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status?.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const currency = webSettings?.currency || "$";

  /* stat counts */
  const totalCompleted = transactions.filter((t) => ["completed", "credited"].includes(t.status?.toLowerCase())).length;
  const totalPending   = transactions.filter((t) => t.status?.toLowerCase() === "pending").length;
  const totalRefunded  = transactions.filter((t) => t.status?.toLowerCase() === "refunded").length;

  const selectedLabel = FILTER_OPTIONS.find((o) => o.value === filter)?.label || "All Status";

  return (
    <div className="w-full max-w-6xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Transaction History</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">
            {transactions.length} total transactions
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl px-2.5 py-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="hidden mobile:inline">Auto-refreshing</span>
          <span className="mobile:hidden">Live</span>
        </div>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.35 }}
        className="grid grid-cols-2 tab:grid-cols-4 gap-3 mb-5"
      >
        {[
          { label: "Total",      value: transactions.length, icon: MdTrendingUp,  color: "text-primary-600", bg: "bg-primary-600/10 dark:bg-primary-600/15" },
          { label: "Completed",  value: totalCompleted,      icon: MdCheckCircle, color: "text-green-600 dark:text-green-400",  bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Pending",    value: totalPending,        icon: MdPending,     color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
          { label: "Refunded",   value: totalRefunded,       icon: MdCancel,      color: "text-red-500 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-900/20" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">{label}</p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white leading-none mt-0.5">
                {loading ? <span className="inline-block w-6 h-4 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" /> : value}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.4 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl p-4 mb-5 shadow-sm flex flex-col tab:flex-row gap-3 items-stretch tab:items-center"
      >
        {/* Search */}
        <div className="relative flex-1">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by ID or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Custom status filter dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className={`w-full tab:w-auto flex items-center justify-between tab:justify-start gap-2 pl-4 pr-3 py-2.5 text-sm font-medium rounded-xl border transition-all focus:outline-none ${
              filterOpen
                ? "bg-white dark:bg-slate-800 border-primary-600 ring-2 ring-primary-600/20 text-gray-800 dark:text-slate-200"
                : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-primary-600/50"
            }`}
          >
            {selectedLabel}
            <HiChevronDown
              size={14}
              className={`text-gray-400 dark:text-slate-500 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-30"
              >
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setFilter(opt.value); setFilterOpen(false); }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                      filter === opt.value
                        ? "bg-primary-600/10 dark:bg-primary-600/15 text-primary-600 font-semibold"
                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {opt.label}
                    {filter === opt.value && <HiCheck size={13} className="text-primary-600 flex-shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="p-4 flex flex-col gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse p-1">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded w-1/3" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-16" />
                  <div className="h-5 bg-gray-100 dark:bg-slate-700 rounded-full w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <BiTransfer size={28} className="text-gray-300 dark:text-slate-600" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">
                {error || "No transactions found"}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {search || filter !== "all"
                  ? "Try adjusting your filters"
                  : "Your transaction history will appear here"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Mobile cards (hidden on tab+) ── */}
            <div className="tab:hidden divide-y divide-gray-50 dark:divide-white/5">
              {filtered.map((t) => (
                <div
                  key={`mob-${t.id}-${t.date}`}
                  className="flex items-start gap-3 p-4 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* icon */}
                  <div className="w-9 h-9 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BiTransfer size={14} className="text-primary-600" />
                  </div>

                  {/* left info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-semibold text-gray-700 dark:text-slate-300 truncate">{t.id}</p>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 capitalize mt-0.5">{t.type}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{formatDateTime(t.date)}</p>
                  </div>

                  {/* right info */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {currency}{parseFloat(t.amount).toFixed(2)}
                    </span>
                    <StatusBadge status={t.status} />
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">{t.source}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table (hidden below tab) ── */}
            <div className="hidden tab:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-white/5">
                    {["ID / Reference", "Type", "Amount", "Status", "Date"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3.5 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {filtered.map((t) => (
                    <tr
                      key={`desk-${t.id}-${t.date}`}
                      className="hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                            <BiTransfer size={14} className="text-primary-600" />
                          </div>
                          <div>
                            <p className="text-xs font-mono font-semibold text-gray-700 dark:text-slate-300">{t.id}</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500">{t.source}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-slate-400 whitespace-nowrap capitalize">
                        {t.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {currency}{parseFloat(t.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                        {formatDateTime(t.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Showing{" "}
              <span className="font-semibold text-gray-600 dark:text-slate-300">{filtered.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-gray-600 dark:text-slate-300">{transactions.length}</span>{" "}
              records
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live · every 30s
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Transaction;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiSearch } from "react-icons/hi";
import { HiXCircle, HiCurrencyDollar } from "react-icons/hi2";
import { getAllWithdrawals } from "../../../../components/backendApis/admin/apis/withdrawal";
import { fadeUp, Avatar, MethodBadge, StatusBadge, WithdrawalModal, EmptyState } from "./_shared";

/* ── Skeleton card ────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-2/5" />
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
        <div className="flex gap-1.5">
          <div className="h-4 bg-gray-100 rounded-full w-14" />
          <div className="h-4 bg-gray-100 rounded-full w-12" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-5 bg-gray-100 rounded w-16" />
        <div className="h-7 bg-gray-100 rounded-xl w-20" />
      </div>
    </div>
  </div>
);

/* ── Withdrawal card ──────────────────────────────────────────── */
const WithdrawalCard = ({ w, index, onView }) => (
  <motion.div
    variants={fadeUp} initial="hidden" animate="visible" custom={index}
    className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all"
  >
    {/* Top: user info + amount */}
    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
      <Avatar name={w.full_name} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-extrabold text-gray-900 truncate">{w.full_name}</p>
        {w.email && <p className="text-[11px] text-gray-400 truncate">{w.email}</p>}
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <MethodBadge method={w.method} />
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] text-gray-400">
            {w.updated_at ? new Date(w.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-lg font-extrabold text-red-500 leading-tight">
          ${Number(w.amount).toLocaleString()}
        </span>
        <StatusBadge status={w.status} />
      </div>
    </div>

    {/* Payout destination */}
    {(w.method === "Bank" || w.method === "Crypto" || w.method === "MOMO") && (
      <div className="mx-4 mb-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 truncate">
        {w.method === "Bank"   && <span><span className="font-semibold text-gray-700">{w.bank_name}</span> · {w.account_number}</span>}
        {w.method === "Crypto" && <span><span className="font-semibold text-gray-700">{w.coin_name}</span> · {w.wallet_address}</span>}
        {w.method === "MOMO"   && <span><span className="font-semibold text-gray-700">MOMO</span> · {w.momo_number}</span>}
      </div>
    )}

    {/* Action row */}
    <div className="px-4 pb-4">
      <button
        onClick={() => onView(w)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
      >
        View Details
      </button>
    </div>
  </motion.div>
);

/* ── Component ────────────────────────────────────────────────── */
const RejectedTab = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState(null);
  const [search,      setSearch]      = useState("");

  useEffect(() => {
    getAllWithdrawals()
      .then((res) => {
        if (res.success && Array.isArray(res.data))
          setWithdrawals(res.data.filter((w) => w.status === "rejected"));
        else toast.error("Failed to load withdrawals");
      })
      .catch(() => toast.error("Error loading withdrawals"))
      .finally(() => setLoading(false));
  }, []);

  const total    = withdrawals.reduce((s, w) => s + Number(w.amount), 0);
  const q        = search.toLowerCase();
  const filtered = withdrawals.filter((w) =>
    (w.full_name || "").toLowerCase().includes(q) ||
    (w.method    || "").toLowerCase().includes(q)
  );

  return (
    <div className="flex flex-col gap-4">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* ── Summary strip ── */}
      <AnimatePresence>
        {!loading && withdrawals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <HiXCircle size={17} className="text-red-500" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">{withdrawals.length}</p>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">Rejected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <HiCurrencyDollar size={17} className="text-rose-500" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">${total.toLocaleString()}</p>
                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">Total Rejected</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <HiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or method…"
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all"
          />
        </div>
        {!loading && (
          <span className="flex items-center px-3 py-2.5 bg-red-50 border border-red-100 text-red-600 text-[10px] font-extrabold rounded-xl flex-shrink-0 whitespace-nowrap">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Cards grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? "No results found." : "No rejected withdrawals."}
          icon={HiXCircle}
        />
      ) : (
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-3">
          {filtered.map((w, i) => (
            <WithdrawalCard key={w.id} w={w} index={i} onView={setSelected} />
          ))}
        </div>
      )}

      {selected && <WithdrawalModal withdrawal={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default RejectedTab;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiSearch, HiRefresh } from "react-icons/hi";
import { HiCheckCircle, HiXCircle, HiCurrencyDollar } from "react-icons/hi2";
import { MdOutlinePendingActions } from "react-icons/md";
import { getAllWithdrawals, updateWithdrawalStatus } from "../../../../components/backendApis/admin/apis/withdrawal";
import { fadeUp, Avatar, MethodBadge, StatusBadge, WithdrawalModal, EmptyState } from "./_shared";

/* ── Skeleton card ────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-2/5" />
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
      </div>
      <div className="h-5 bg-gray-100 rounded w-16" />
    </div>
    <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
      <div className="h-8 bg-gray-100 rounded-xl flex-1" />
      <div className="h-8 bg-gray-100 rounded-xl flex-1" />
      <div className="h-8 bg-gray-100 rounded-xl w-10" />
    </div>
  </div>
);

/* ── Withdrawal card ──────────────────────────────────────────── */
const WithdrawalCard = ({ w, index, onView, onApprove, onReject, approvingId, rejectingId }) => {
  const isApproving = approvingId === w.id;
  const isRejecting = rejectingId === w.id;
  const busy        = isApproving || isRejecting;

  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all"
    >
      {/* ── Top: user info + amount ── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Avatar name={w.full_name} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-gray-900 truncate">{w.full_name}</p>
          {w.email && <p className="text-[11px] text-gray-400 truncate">{w.email}</p>}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <MethodBadge method={w.method} />
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-400">
              {w.created_at ? new Date(w.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-lg font-extrabold text-amber-600 leading-tight">
            ${Number(w.amount).toLocaleString()}
          </span>
          <StatusBadge status={w.status} />
        </div>
      </div>

      {/* ── Payout destination ── */}
      {(w.method === "Bank" || w.method === "Crypto" || w.method === "MOMO") && (
        <div className="mx-4 mb-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 truncate">
          {w.method === "Bank"   && <span><span className="font-semibold text-gray-700">{w.bank_name}</span> · {w.account_number}</span>}
          {w.method === "Crypto" && <span><span className="font-semibold text-gray-700">{w.coin_name}</span> · {w.wallet_address}</span>}
          {w.method === "MOMO"   && <span><span className="font-semibold text-gray-700">MOMO</span> · {w.momo_number}</span>}
        </div>
      )}

      {/* ── Action row ── */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <button
          onClick={() => onApprove(w.id)} disabled={busy}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-emerald-600/20"
        >
          {isApproving
            ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : <HiCheckCircle size={14} />}
          Approve
        </button>
        <button
          onClick={() => onReject(w.id)} disabled={busy}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-red-500/20"
        >
          {isRejecting
            ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : <HiXCircle size={14} />}
          Reject
        </button>
        <button
          onClick={() => onView(w)}
          className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold rounded-xl transition-all"
          title="View details"
        >
          Details
        </button>
      </div>
    </motion.div>
  );
};

/* ── Component ────────────────────────────────────────────────── */
const PendingTab = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState(null);
  const [search,      setSearch]      = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllWithdrawals();
      if (res.success && Array.isArray(res.data))
        setWithdrawals(res.data.filter((w) => w.status === "pending"));
      else toast.error("Failed to load withdrawals");
    } catch { toast.error("Error loading withdrawals"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      const res = await updateWithdrawalStatus(id, "completed");
      if (res.success) { toast.success("Withdrawal approved"); setSelected(null); fetchData(); }
      else toast.error(res.message || "Approval failed");
    } catch { toast.error("Something went wrong"); }
    setApprovingId(null);
  };

  const handleReject = async (id) => {
    setRejectingId(id);
    try {
      const res = await updateWithdrawalStatus(id, "rejected");
      if (res.success) { toast.success("Withdrawal rejected"); setSelected(null); fetchData(); }
      else toast.error(res.message || "Rejection failed");
    } catch { toast.error("Something went wrong"); }
    setRejectingId(null);
  };

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
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <MdOutlinePendingActions size={17} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">{withdrawals.length}</p>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Pending</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <HiCurrencyDollar size={17} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">${total.toLocaleString()}</p>
                <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wide">Total Value</p>
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
        <button
          onClick={fetchData} disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex-shrink-0"
        >
          <HiRefresh size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
        {!loading && (
          <span className="flex items-center px-3 py-2.5 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-extrabold rounded-xl flex-shrink-0 whitespace-nowrap">
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
          message={search ? "No results found." : "No pending withdrawals."}
          icon={MdOutlinePendingActions}
        />
      ) : (
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-3">
          {filtered.map((w, i) => (
            <WithdrawalCard
              key={w.id} w={w} index={i}
              onView={setSelected}
              onApprove={handleApprove}
              onReject={handleReject}
              approvingId={approvingId}
              rejectingId={rejectingId}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <WithdrawalModal
          withdrawal={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          approvingId={approvingId}
          rejectingId={rejectingId}
        />
      )}
    </div>
  );
};

export default PendingTab;

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getAllTransactions } from "../../../components/backendApis/admin/apis/histroy";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";
import { PiArrowsLeftRightBold } from "react-icons/pi";
import {
  fadeUp, cap, fmtAmount, fmtDate,
  Avatar, StatusBadge, amountColor,
  SkeletonCard, EmptyState, DetailRow, DetailModal,
  SummaryStrip, FilterTabs, Toolbar,
} from "./_shared";

/* ── Transaction card ─────────────────────────────────────────── */
const TxCard = ({ tx, index, onView }) => (
  <motion.div
    variants={fadeUp} initial="hidden" animate="visible" custom={index}
    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-3"
  >
    <Avatar name={tx.full_name || "?"} />

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-xs font-extrabold text-gray-900 truncate">{tx.full_name || "N/A"}</p>
        <span className={`text-sm font-extrabold flex-shrink-0 ${amountColor(tx.status)}`}>
          {fmtAmount(tx.amount)}
        </span>
      </div>
      <p className="text-[10px] text-gray-400 font-mono truncate mb-1.5">{tx.transaction_no}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <StatusBadge status={tx.status} />
          {tx.transaction_type && (
            <span className="text-[10px] text-gray-400 truncate">{tx.transaction_type}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] text-gray-400">{fmtDate(tx.created_at)}</span>
          <button
            onClick={() => onView(tx)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold rounded-lg transition-all"
          >
            View
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ── Component ────────────────────────────────────────────────── */
const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filter,       setFilter]       = useState("all");
  const [selected,     setSelected]     = useState(null);

  useEffect(() => {
    getAllTransactions()
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) setTransactions(res.data);
        else toast.error("Failed to fetch transactions.");
      })
      .catch(() => toast.error("Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  const q = search.toLowerCase();
  const filtered = transactions
    .filter((tx) => filter === "all" || tx.status?.toLowerCase() === filter)
    .filter((tx) =>
      (tx.transaction_no   || "").toLowerCase().includes(q) ||
      (tx.full_name        || "").toLowerCase().includes(q) ||
      (tx.email            || "").toLowerCase().includes(q) ||
      (tx.transaction_type || "").toLowerCase().includes(q)
    );

  const count = (s) => transactions.filter((tx) => tx.status?.toLowerCase() === s).length;

  const summaryStats = [
    { label: "Total",     value: transactions.length, bg: "bg-gray-50",    border: "border-gray-200",    text: "text-gray-600"    },
    { label: "Completed", value: count("completed") + count("successful"), bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
    { label: "Pending",   value: count("pending"),    bg: "bg-amber-50",   border: "border-amber-100",   text: "text-amber-600"   },
    { label: "Failed",    value: count("failed"),     bg: "bg-red-50",     border: "border-red-100",     text: "text-red-500"     },
  ];

  const filterTabs = [
    { key: "all",       label: "All",       count: transactions.length,                            color: "border-gray-500"    },
    { key: "completed", label: "Completed", count: count("completed") + count("successful"),       color: "border-emerald-500" },
    { key: "pending",   label: "Pending",   count: count("pending"),                               color: "border-amber-500"   },
    { key: "failed",    label: "Failed",    count: count("failed"),                                color: "border-red-500"     },
  ];

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">History</p>
        <h1 className="text-xl font-extrabold text-gray-900">Transaction History</h1>
        <p className="text-sm text-gray-400 mt-0.5">All platform wallet and payment transactions</p>
      </div>

      {/* Shell */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

        <AnimatePresence>
          {!loading && transactions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SummaryStrip stats={summaryStats} />
            </motion.div>
          )}
        </AnimatePresence>

        <FilterTabs filters={filterTabs} active={filter} onChange={setFilter} />
        <Toolbar search={search} onSearch={setSearch} count={filtered.length} loading={loading} placeholder="Search by name, TX no or type…" />

        <div className="px-4 pb-4 flex flex-col gap-3">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
              ? <EmptyState message={search ? "No results found." : "No transactions yet."} icon={PiArrowsLeftRightBold} />
              : filtered.map((tx, i) => <TxCard key={tx.id || tx.transaction_no || i} tx={tx} index={i} onView={setSelected} />)
          }
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <DetailModal
          title="Transaction Details"
          subtitle={selected.transaction_no}
          onClose={() => setSelected(null)}
        >
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">User</p>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <DetailRow label="Full Name" value={selected.full_name} />
                <DetailRow label="Email"     value={selected.email} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Transaction</p>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <DetailRow label="TX No"   value={selected.transaction_no} mono />
                <DetailRow label="Type"    value={selected.transaction_type} />
                <DetailRow label="Amount"  value={fmtAmount(selected.amount)} />
                <DetailRow label="Status"  value={cap(selected.status)} />
                <DetailRow label="Date"    value={fmtDate(selected.created_at)} />
              </div>
            </div>
          </div>
        </DetailModal>
      )}
    </div>
  );
};

export default Transaction;

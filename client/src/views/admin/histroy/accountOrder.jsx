import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getAllOrderList } from "../../../components/backendApis/admin/apis/histroy";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import {
  fadeUp, cap, fmtAmount, fmtDate,
  Avatar, StatusBadge, amountColor,
  SkeletonCard, EmptyState, DetailRow, DetailModal,
  SummaryStrip, FilterTabs, Toolbar,
} from "./_shared";

/* ── Order card ───────────────────────────────────────────────── */
const OrderCard = ({ o, index, onView }) => (
  <motion.div
    variants={fadeUp} initial="hidden" animate="visible" custom={index}
    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-3"
  >
    <Avatar name={o.buyer_name || o.seller_name || "?"} />

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold text-gray-900 truncate">{o.title || o.platform || "N/A"}</p>
          <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wide truncate">{o.platform}</p>
        </div>
        <span className={`text-sm font-extrabold flex-shrink-0 ${amountColor(o.payment_status)}`}>
          {fmtAmount(o.price)}
        </span>
      </div>
      <p className="text-[10px] text-gray-400 font-mono truncate mb-1.5">{o.order_no}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <StatusBadge status={o.payment_status} />
          <span className="text-[10px] text-gray-400 truncate">
            {o.buyer_name} → {o.seller_name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] text-gray-400">{fmtDate(o.create_at)}</span>
          <button
            onClick={() => onView(o)}
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
const AccountOrder = () => {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAllOrderList()
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) setOrders(res.data);
        else toast.error("Failed to fetch account orders.");
      })
      .catch(() => toast.error("Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  const q = search.toLowerCase();
  const filtered = orders
    .filter((o) => filter === "all" || o.payment_status?.toLowerCase() === filter)
    .filter((o) =>
      (o.order_no     || "").toLowerCase().includes(q) ||
      (o.title        || "").toLowerCase().includes(q) ||
      (o.platform     || "").toLowerCase().includes(q) ||
      (o.buyer_name   || "").toLowerCase().includes(q) ||
      (o.seller_name  || "").toLowerCase().includes(q)
    );

  const count = (s) => orders.filter((o) => o.payment_status?.toLowerCase() === s).length;

  const summaryStats = [
    { label: "Total",     value: orders.length,       bg: "bg-gray-50",    border: "border-gray-200",    text: "text-gray-600"    },
    { label: "Completed", value: count("completed"),  bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
    { label: "Pending",   value: count("pending"),    bg: "bg-amber-50",   border: "border-amber-100",   text: "text-amber-600"   },
    { label: "Declined",  value: count("declined"),   bg: "bg-red-50",     border: "border-red-100",     text: "text-red-500"     },
  ];

  const filterTabs = [
    { key: "all",       label: "All",       count: orders.length,       color: "border-gray-500"    },
    { key: "completed", label: "Completed", count: count("completed"),  color: "border-emerald-500" },
    { key: "pending",   label: "Pending",   count: count("pending"),    color: "border-amber-500"   },
    { key: "declined",  label: "Declined",  count: count("declined"),   color: "border-red-500"     },
  ];

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">History</p>
        <h1 className="text-xl font-extrabold text-gray-900">Account Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">All marketplace account and product orders</p>
      </div>

      {/* Shell */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

        <AnimatePresence>
          {!loading && orders.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SummaryStrip stats={summaryStats} />
            </motion.div>
          )}
        </AnimatePresence>

        <FilterTabs filters={filterTabs} active={filter} onChange={setFilter} />
        <Toolbar search={search} onSearch={setSearch} count={filtered.length} loading={loading} placeholder="Search by order, product, buyer or seller…" />

        <div className="px-4 pb-4 flex flex-col gap-3">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
              ? <EmptyState message={search ? "No results found." : "No orders yet."} icon={PiShoppingCartSimpleBold} />
              : filtered.map((o, i) => <OrderCard key={o.id} o={o} index={i} onView={setSelected} />)
          }
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <DetailModal
          title="Order Details"
          subtitle={selected.order_no}
          onClose={() => setSelected(null)}
        >
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product</p>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <DetailRow label="Title"    value={selected.title} />
                <DetailRow label="Platform" value={selected.platform} />
                <DetailRow label="Amount"   value={fmtAmount(selected.price)} />
                <DetailRow label="Status"   value={cap(selected.payment_status)} />
                <DetailRow label="Date"     value={fmtDate(selected.create_at)} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Seller</p>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <DetailRow label="Name"  value={selected.seller_name} />
                <DetailRow label="Email" value={selected.seller_email} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Buyer</p>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <DetailRow label="Name"  value={selected.buyer_name} />
                <DetailRow label="Email" value={selected.buyer_email} />
              </div>
            </div>
          </div>
        </DetailModal>
      )}
    </div>
  );
};

export default AccountOrder;

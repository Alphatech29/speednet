import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  HiArrowRight, HiShoppingBag, HiClipboardList,
  HiExternalLink,
} from "react-icons/hi";
import { getAllProducts, getAllOrders } from "../../../../../components/backendApis/admin/apis/products";
import { formatDateTime } from "../../../../../components/utils/formatTimeDate";

/* ─── Status config ──────────────────────────────────────────────── */
const statusConfig = (s) => {
  switch (s?.toLowerCase()) {
    case "approved":
    case "completed":       return { cls: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" };
    case "under reviewing": return { cls: "bg-amber-50 text-amber-700 border-amber-100",       dot: "bg-amber-500"   };
    case "rejected":        return { cls: "bg-red-50 text-red-700 border-red-100",             dot: "bg-red-500"     };
    case "sold":            return { cls: "bg-blue-50 text-blue-700 border-blue-100",          dot: "bg-blue-500"    };
    case "pending":         return { cls: "bg-orange-50 text-orange-700 border-orange-100",    dot: "bg-orange-500"  };
    default:                return { cls: "bg-gray-100 text-gray-500 border-gray-200",         dot: "bg-gray-400"    };
  }
};

const StatusBadge = ({ status }) => {
  const { cls, dot } = statusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize whitespace-nowrap ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {status || "N/A"}
    </span>
  );
};

/* ─── Avatar initials ────────────────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-pink-100 text-pink-600",
  "bg-indigo-100 text-indigo-600",
];
const Avatar = ({ name, index = 0 }) => (
  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-extrabold
    ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
    {(name || "?")[0].toUpperCase()}
  </div>
);

/* ─── Skeleton ───────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse divide-y divide-gray-50">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-3 px-5 py-4">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-2.5 bg-gray-100 rounded-lg w-2/5" />
          <div className="h-2 bg-gray-100 rounded-lg w-1/3" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-2.5 bg-gray-100 rounded-lg w-14" />
          <div className="h-5 bg-gray-100 rounded-full w-20" />
        </div>
      </div>
    ))}
  </div>
);

/* ─── Empty state ────────────────────────────────────────────────── */
const Empty = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
      <Icon size={22} className="text-gray-300" />
    </div>
    <p className="text-sm font-semibold text-gray-400">{message}</p>
    <p className="text-xs text-gray-300 mt-0.5">New entries will appear here automatically.</p>
  </div>
);

/* ─── Table helpers (desktop) ────────────────────────────────────── */
const Th = ({ children, right = false }) => (
  <th className={`px-5 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap
    ${right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-5 py-3.5 ${className}`}>{children}</td>
);

/* ─── Mobile row card ────────────────────────────────────────────── */
const MobileProductRow = ({ p, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.03, ease: "easeOut" }}
    className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
  >
    <Avatar name={p.platform} index={i} />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-800 leading-none truncate">{p.platform || "—"}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{p.title || "—"}</p>
        </div>
        <p className="text-xs font-extrabold text-gray-900 flex-shrink-0">${Number(p.price || 0).toLocaleString()}</p>
      </div>
      <div className="flex items-center justify-between mt-2 gap-2">
        <p className="text-[10px] text-gray-400 truncate">
          {p.username || "—"} · {formatDateTime(p.create_at)}
        </p>
        <StatusBadge status={p.status} />
      </div>
    </div>
  </motion.div>
);

const MobileOrderRow = ({ o, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.03, ease: "easeOut" }}
    className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
  >
    <Avatar name={o.platform} index={i} />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-800 leading-none truncate">{o.platform || "—"}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{o.title || "—"}</p>
        </div>
        <p className="text-xs font-extrabold text-gray-900 flex-shrink-0">${Number(o.price || 0).toLocaleString()}</p>
      </div>
      <div className="flex items-center justify-between mt-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
            {String(o.order_no || "—").slice(0, 8)}
          </span>
          <p className="text-[10px] text-gray-400 truncate">{o.buyer_name || "—"}</p>
        </div>
        <StatusBadge status={o.payment_status} />
      </div>
    </div>
  </motion.div>
);

/* ─── Card shell ─────────────────────────────────────────────────── */
const DataCard = ({ title, subtitle, count, loading, viewTo, icon: Icon, accentColor, children }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
    {/* Gradient top accent */}
    <div className={`h-0.5 w-full ${accentColor}`} />

    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 leading-none">{title}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {loading ? "Loading…" : `${count} recent ${subtitle}`}
          </p>
        </div>
      </div>
      {viewTo && (
        <NavLink
          to={viewTo}
          className="flex items-center gap-1.5 text-[11px] font-bold text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="hidden tab:inline">View all</span>
          <HiExternalLink size={13} />
        </NavLink>
      )}
    </div>

    {/* Body */}
    {loading ? <Skeleton /> : <>{children}</>}
  </div>
);

/* ─── Main component ─────────────────────────────────────────────── */
const RecentSubmition = () => {
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingO, setLoadingO] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((r) => {
        if (r?.success && Array.isArray(r.data))
          setProducts([...r.data].sort((a, b) => new Date(b.create_at) - new Date(a.create_at)).slice(0, 15));
      })
      .catch(console.error)
      .finally(() => setLoadingP(false));

    getAllOrders()
      .then((r) => {
        if (r?.success && Array.isArray(r.data))
          setOrders([...r.data].sort((a, b) => new Date(b.create_at) - new Date(a.create_at)).slice(0, 15));
      })
      .catch(console.error)
      .finally(() => setLoadingO(false));
  }, []);

  return (
    <div className="grid grid-cols-1 pc:grid-cols-2 gap-5">

      {/* ── Recent Products ─────────────────────────────────────────── */}
      <DataCard
        title="Recent Product Listings"
        subtitle="products"
        count={products.length}
        loading={loadingP}
        viewTo="/admin/products"
        icon={HiShoppingBag}
        accentColor="bg-gradient-to-r from-orange-400 to-primary-600"
      >
        {products.length === 0 ? (
          <Empty icon={HiShoppingBag} message="No product listings yet." />
        ) : (
          <>
            {/* Mobile list — shown below tab breakpoint */}
            <div className="tab:hidden divide-y divide-gray-50">
              {products.map((p, i) => <MobileProductRow key={p.id || i} p={p} i={i} />)}
            </div>

            {/* Desktop table — shown from tab breakpoint up */}
            <div className="hidden tab:block overflow-x-auto admin-table-wrap">
              <table className="w-full text-left">
                <thead className="bg-gray-50/70 border-b border-gray-100">
                  <tr>
                    <Th>#</Th>
                    <Th>Product</Th>
                    <Th>Seller</Th>
                    <Th right>Price</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p, i) => (
                    <motion.tr key={p.id || i}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.025 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <Td className="w-10">
                        <span className="text-xs font-bold text-gray-300">{String(i + 1).padStart(2, "0")}</span>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={p.platform} index={i} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 leading-none">{p.platform || "—"}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[120px]">{p.title || "—"}</p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <p className="text-xs font-semibold text-gray-700">{p.username || "—"}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDateTime(p.create_at)}</p>
                      </Td>
                      <Td className="text-right">
                        <span className="text-xs font-extrabold text-gray-900">
                          ${Number(p.price || 0).toLocaleString()}
                        </span>
                      </Td>
                      <Td>
                        <StatusBadge status={p.status} />
                      </Td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer count */}
        {!loadingP && products.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400">Showing latest {products.length} entries</p>
            <NavLink to="/admin/products"
              className="flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:gap-2 transition-all">
              View all <HiArrowRight size={11} />
            </NavLink>
          </div>
        )}
      </DataCard>

      {/* ── Recent Orders ────────────────────────────────────────────── */}
      <DataCard
        title="Recent Purchase Orders"
        subtitle="orders"
        count={orders.length}
        loading={loadingO}
        viewTo="/admin/order"
        icon={HiClipboardList}
        accentColor="bg-gradient-to-r from-blue-400 to-indigo-500"
      >
        {orders.length === 0 ? (
          <Empty icon={HiClipboardList} message="No purchase orders yet." />
        ) : (
          <>
            {/* Mobile list */}
            <div className="tab:hidden divide-y divide-gray-50">
              {orders.map((o, i) => <MobileOrderRow key={o.id || i} o={o} i={i} />)}
            </div>

            {/* Desktop table */}
            <div className="hidden tab:block overflow-x-auto admin-table-wrap">
              <table className="w-full text-left">
                <thead className="bg-gray-50/70 border-b border-gray-100">
                  <tr>
                    <Th>Order</Th>
                    <Th>Product</Th>
                    <Th>Buyer</Th>
                    <Th right>Price</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o, i) => (
                    <motion.tr key={o.id || i}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.025 }}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <Td>
                        <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          {String(o.order_no || "—").slice(0, 10)}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={o.platform} index={i} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 leading-none">{o.platform || "—"}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[120px]">{o.title || "—"}</p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <p className="text-xs font-semibold text-gray-700">{o.buyer_name || "—"}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDateTime(o.create_at)}</p>
                      </Td>
                      <Td className="text-right">
                        <span className="text-xs font-extrabold text-gray-900">
                          ${Number(o.price || 0).toLocaleString()}
                        </span>
                      </Td>
                      <Td>
                        <StatusBadge status={o.payment_status} />
                      </Td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer count */}
        {!loadingO && orders.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400">Showing latest {orders.length} entries</p>
            <NavLink to="/admin/order"
              className="flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:gap-2 transition-all">
              View all <HiArrowRight size={11} />
            </NavLink>
          </div>
        )}
      </DataCard>

    </div>
  );
};

export default RecentSubmition;

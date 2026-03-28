import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";

/* ── Fade-up variant ──────────────────────────────────────────── */
export const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Helpers ──────────────────────────────────────────────────── */
export const cap = (t) => t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : "—";
export const fmtAmount = (v) =>
  v != null ? Number(v).toLocaleString("en-US", { style: "currency", currency: "USD" }) : "N/A";
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "N/A";

/* ── Avatar ───────────────────────────────────────────────────── */
const COLORS = [
  "bg-violet-100 text-violet-600", "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600", "bg-orange-100 text-orange-600",
  "bg-rose-100 text-rose-600", "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600", "bg-indigo-100 text-indigo-600",
];
export const Avatar = ({ name = "" }) => {
  const color = COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${color}`}>
      {name.charAt(0).toUpperCase() || "?"}
    </div>
  );
};

/* ── Status badge ─────────────────────────────────────────────── */
const STATUS_MAP = {
  completed:  { cls: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  successful: { cls: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  credited:   { cls: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  pending:    { cls: "bg-amber-50 text-amber-700 border-amber-100",       dot: "bg-amber-500"   },
  failed:     { cls: "bg-red-50 text-red-700 border-red-100",             dot: "bg-red-500"     },
  declined:   { cls: "bg-red-50 text-red-700 border-red-100",             dot: "bg-red-500"     },
  system:     { cls: "bg-blue-50 text-blue-700 border-blue-100",          dot: "bg-blue-500"    },
};
export const StatusBadge = ({ status }) => {
  const cfg = STATUS_MAP[status?.toLowerCase()] || { cls: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold capitalize ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cap(status)}
    </span>
  );
};

/* ── Amount color ─────────────────────────────────────────────── */
export const amountColor = (status) => {
  const v = status?.toLowerCase();
  if (["completed","successful","credited"].includes(v)) return "text-emerald-600";
  if (["failed","declined"].includes(v)) return "text-red-500";
  return "text-amber-600";
};

/* ── Skeleton card ────────────────────────────────────────────── */
export const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-3">
    <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-2/5" />
      <div className="h-2.5 bg-gray-100 rounded w-3/5" />
    </div>
    <div className="flex flex-col items-end gap-1.5">
      <div className="h-3.5 bg-gray-100 rounded w-16" />
      <div className="h-4 bg-gray-100 rounded-full w-14" />
    </div>
  </div>
);

/* ── Empty state ──────────────────────────────────────────────── */
export const EmptyState = ({ message = "No records found.", icon: Icon }) => (
  <div className="flex flex-col items-center gap-3 py-16">
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
        <Icon size={24} className="text-gray-300" />
      </div>
    )}
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

/* ── Detail row ───────────────────────────────────────────────── */
export const DetailRow = ({ label, value, mono }) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-semibold text-gray-400 flex-shrink-0 w-28">{label}</span>
    <span className={`text-xs font-bold text-gray-800 text-right break-all min-w-0 ${mono ? "font-mono" : ""}`}>{value || "—"}</span>
  </div>
);

/* ── Detail Modal ─────────────────────────────────────────────── */
export const DetailModal = ({ title, subtitle, onClose, children }) => (
  <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-end tab:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 48 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 bg-white w-full tab:max-w-md tab:mx-4
                   rounded-t-3xl tab:rounded-2xl shadow-2xl
                   flex flex-col max-h-[92vh] tab:max-h-[88vh]"
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent flex-shrink-0" />
        <div className="flex justify-center pt-3 pb-1 tab:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-sm font-extrabold text-gray-900">{title}</p>
            {subtitle && <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all flex-shrink-0 ml-2">
            <HiX size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {children}
        </div>
        <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4">
          <button onClick={onClose} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);

/* ── Summary strip ────────────────────────────────────────────── */
export const SummaryStrip = ({ stats }) => (
  <div className="flex gap-3 p-4 pb-0">
    {stats.map(({ label, value, bg, border, text }) => (
      <div key={label} className={`flex-1 ${bg} ${border} border rounded-2xl px-3 py-2.5 text-center`}>
        <p className={`text-base font-extrabold ${text} leading-tight`}>{value}</p>
        <p className={`text-[9px] font-bold uppercase tracking-wide mt-0.5 ${text}`}>{label}</p>
      </div>
    ))}
  </div>
);

/* ── Filter tabs ──────────────────────────────────────────────── */
export const FilterTabs = ({ filters, active, onChange }) => (
  <div className="flex items-center gap-1 px-4 pt-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
    {filters.map(({ key, label, count, color }) => (
      <button
        key={key} onClick={() => onChange(key)}
        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border-b-2 whitespace-nowrap transition-all flex-shrink-0
          ${active === key
            ? `bg-white shadow-sm ${color} text-gray-900`
            : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}
      >
        {label}
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold
          ${active === key ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-400"}`}>
          {count}
        </span>
      </button>
    ))}
  </div>
);

/* ── Toolbar ──────────────────────────────────────────────────── */
export const Toolbar = ({ search, onSearch, count, loading, placeholder = "Search…" }) => (
  <div className="flex items-center gap-2 p-4">
    <div className="relative flex-1">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="text" value={search} onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all"
      />
    </div>
    {!loading && (
      <span className="flex items-center px-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-extrabold rounded-xl flex-shrink-0 whitespace-nowrap">
        {count} result{count !== 1 ? "s" : ""}
      </span>
    )}
  </div>
);

import { useEffect, useState } from "react";
import { getAllNotices } from "../../../components/backendApis/admin/apis/notice";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiPlus, HiPencil, HiSearch } from "react-icons/hi";
import { PiMegaphoneBold } from "react-icons/pi";

/* ── Animation ────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Role config ──────────────────────────────────────────────── */
const ROLE = {
  merchant: { cls: "bg-orange-50 text-orange-700 border-orange-100", dot: "bg-orange-500" },
  user:     { cls: "bg-blue-50 text-blue-700 border-blue-100",       dot: "bg-blue-500"   },
};
const getRole = (r) => ROLE[r?.toLowerCase()] || ROLE.user;

/* ── Skeleton card ────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm animate-pulse flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="h-3.5 bg-gray-100 rounded w-2/5" />
        <div className="h-4 bg-gray-100 rounded-full w-16" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-4/5" />
      <div className="flex items-center justify-between pt-0.5">
        <div className="h-2.5 bg-gray-100 rounded w-24" />
        <div className="h-7 bg-gray-100 rounded-xl w-14" />
      </div>
    </div>
  </div>
);

/* ── Notice card ──────────────────────────────────────────────── */
const NoticeCard = ({ notice, index }) => {
  const rc = getRole(notice.role);
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-start gap-3"
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-primary-600/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <PiMegaphoneBold size={15} className="text-primary-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title + role badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-1 flex-1">{notice.title}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold flex-shrink-0 capitalize ${rc.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
            {notice.role}
          </span>
        </div>

        {/* Message preview */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">{notice.message}</p>

        {/* Date + edit */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
          <span className="text-[10px] text-gray-400">{formatDateTime(notice.created_at)}</span>
          <NavLink
            to="/admin/announcement/edit" state={notice}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-600/10 hover:bg-primary-600/20 text-primary-600 text-[10px] font-bold rounded-lg transition-all flex-shrink-0"
          >
            <HiPencil size={10} /> Edit
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Component ────────────────────────────────────────────────── */
const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    getAllNotices()
      .then((res) => { if (res?.success) setNotices(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const q        = search.toLowerCase();
  const filtered = notices
    .filter((n) => filter === "all" || n.role?.toLowerCase() === filter)
    .filter((n) =>
      (n.title   || "").toLowerCase().includes(q) ||
      (n.message || "").toLowerCase().includes(q) ||
      (n.role    || "").toLowerCase().includes(q)
    );

  const counts = {
    all:      notices.length,
    user:     notices.filter((n) => n.role?.toLowerCase() === "user").length,
    merchant: notices.filter((n) => n.role?.toLowerCase() === "merchant").length,
  };

  const FILTERS = [
    { key: "all",      label: "All",      color: "border-gray-500"   },
    { key: "user",     label: "Users",    color: "border-blue-500"   },
    { key: "merchant", label: "Merchants",color: "border-orange-500" },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-xl font-extrabold text-gray-900">Notice Board</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage announcements sent to users and merchants</p>
        </div>
        <NavLink
          to="/admin/announcement/create"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-primary-600/20 flex-shrink-0"
        >
          <HiPlus size={13} /> Create Notice
        </NavLink>
      </div>

      {/* ── Shell ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

        {/* ── Summary strip ── */}
        <AnimatePresence>
          {!loading && notices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-3 p-4 pb-0"
            >
              {[
                { label: "Total",     value: counts.all,      bg: "bg-primary-600/5", border: "border-primary-600/10", text: "text-primary-600" },
                { label: "Users",     value: counts.user,     bg: "bg-blue-50",       border: "border-blue-100",       text: "text-blue-600"    },
                { label: "Merchants", value: counts.merchant, bg: "bg-orange-50",     border: "border-orange-100",     text: "text-orange-600"  },
              ].map(({ label, value, bg, border, text }) => (
                <div key={label} className={`flex-1 ${bg} ${border} border rounded-2xl px-3 py-2.5 text-center`}>
                  <p className={`text-base font-extrabold ${text} leading-tight`}>{value}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-wide mt-0.5 ${text}`}>{label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-1 px-4 pt-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map(({ key, label, color }) => (
            <button
              key={key} onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border-b-2 whitespace-nowrap transition-all flex-shrink-0
                ${filter === key
                  ? `bg-white shadow-sm ${color} text-gray-900`
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
            >
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold
                ${filter === key ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-400"}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-2 p-4">
          <div className="relative flex-1">
            <HiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, message or role…"
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all"
            />
          </div>
          {!loading && (
            <span className="flex items-center px-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-extrabold rounded-xl flex-shrink-0 whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── List ── */}
        <div className="px-4 pb-4 flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <PiMegaphoneBold size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">
                {search ? "No results found." : "No notices yet. Create one to get started."}
              </p>
              {!search && (
                <NavLink
                  to="/admin/announcement/create"
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <HiPlus size={12} /> Create Notice
                </NavLink>
              )}
            </div>
          ) : (
            filtered.map((notice, i) => (
              <NoticeCard key={notice?.id || i} notice={notice} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notice;

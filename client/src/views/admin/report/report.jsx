import { useEffect, useState } from "react";
import { getAllReports, updateReportById } from "../../../components/backendApis/admin/apis/report";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { AnimatePresence, motion } from "framer-motion";
import { HiX, HiSearch } from "react-icons/hi";
import { MdOutlineReport } from "react-icons/md";
import { HiCheckCircle, HiEye } from "react-icons/hi2";

/* ── Animation ────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Status config ────────────────────────────────────────────── */
const STATUS = {
  pending:  { cls: "bg-amber-50 text-amber-700 border-amber-100",     dot: "bg-amber-500"   },
  reviewed: { cls: "bg-blue-50 text-blue-700 border-blue-100",        dot: "bg-blue-500"    },
  resolved: { cls: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
};
const getStatus = (s) => STATUS[s] || STATUS.pending;

/* ── Avatar ───────────────────────────────────────────────────── */
const COLORS = [
  "bg-violet-100 text-violet-600", "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600", "bg-orange-100 text-orange-600",
  "bg-rose-100 text-rose-600", "bg-sky-100 text-sky-600",
];
const Avatar = ({ name = "" }) => {
  const color = COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${color}`}>
      {name.charAt(0).toUpperCase() || "?"}
    </div>
  );
};

/* ── Detail row ───────────────────────────────────────────────── */
const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-semibold text-gray-400 flex-shrink-0 w-24">{label}</span>
    <span className="text-xs font-bold text-gray-800 text-right break-all min-w-0">{value || "—"}</span>
  </div>
);

/* ── Skeleton card ────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-4">
    <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-2/5" />
      <div className="h-2.5 bg-gray-100 rounded w-3/5" />
    </div>
    <div className="h-5 bg-gray-100 rounded-full w-16 flex-shrink-0" />
  </div>
);

/* ── Report card ──────────────────────────────────────────────── */
const ReportCard = ({ r, index, onView }) => {
  const st = getStatus(r.status);
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-3"
    >
      {/* Reporter avatar */}
      <Avatar name={r.reporter_name || ""} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-xs font-extrabold text-gray-900 truncate">{r.reporter_name}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold flex-shrink-0 ${st.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {r.status || "pending"}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 truncate mb-1">{r.reporter_email}</p>
        <p className="text-xs text-gray-600 line-clamp-1">{r.message}</p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">vs</span>
            <span className="text-[10px] font-semibold text-gray-600 truncate max-w-[120px]">{r.defendant_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{formatDateTime(r.created_at)}</span>
            <button
              onClick={() => onView(r)}
              className="flex items-center gap-1 px-2.5 py-1 bg-gray-900 hover:bg-gray-700 text-white text-[10px] font-bold rounded-lg transition-all flex-shrink-0"
            >
              <HiEye size={10} /> View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Component ────────────────────────────────────────────────── */
const Report = () => {
  const [reports,  setReports]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  useEffect(() => {
    getAllReports()
      .then((res) => { if (res?.success) setReports(res.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (status) => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await updateReportById(selected.id, status);
      if (res?.success) {
        setReports((prev) => prev.map((r) => r.id === selected.id ? { ...r, status } : r));
        setSelected((prev) => ({ ...prev, status }));
      }
    } catch (err) { console.error(err); }
    setUpdating(false);
  };

  const q        = search.toLowerCase();
  const filtered = reports
    .filter((r) => filter === "all" || (r.status || "pending") === filter)
    .filter((r) =>
      (r.reporter_name   || "").toLowerCase().includes(q) ||
      (r.defendant_name  || "").toLowerCase().includes(q) ||
      (r.message         || "").toLowerCase().includes(q)
    );

  const counts = {
    all:      reports.length,
    pending:  reports.filter((r) => (r.status || "pending") === "pending").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  const currentReport = reports.find((r) => r.id === selected?.id);
  const modalStatus   = currentReport?.status || selected?.status || "pending";
  const mst           = getStatus(modalStatus);

  const FILTERS = [
    { key: "all",      label: "All",      color: "border-gray-400"    },
    { key: "pending",  label: "Pending",  color: "border-amber-500"   },
    { key: "reviewed", label: "Reviewed", color: "border-blue-500"    },
    { key: "resolved", label: "Resolved", color: "border-emerald-500" },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ── */}
      <div>
        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-xl font-extrabold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-400 mt-0.5">Review and resolve disputes submitted by users</p>
      </div>

      {/* ── Shell ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

        {/* ── Summary strip ── */}
        <AnimatePresence>
          {!loading && reports.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-3 p-4 pb-0"
            >
              {[
                { label: "Total",    value: counts.all,      bg: "bg-gray-50",     border: "border-gray-100",    text: "text-gray-600"    },
                { label: "Pending",  value: counts.pending,  bg: "bg-amber-50",    border: "border-amber-100",   text: "text-amber-600"   },
                { label: "Reviewed", value: counts.reviewed, bg: "bg-blue-50",     border: "border-blue-100",    text: "text-blue-600"    },
                { label: "Resolved", value: counts.resolved, bg: "bg-emerald-50",  border: "border-emerald-100", text: "text-emerald-600" },
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
              key={key}
              onClick={() => setFilter(key)}
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
              placeholder="Search reporter, defendant or message…"
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
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <MdOutlineReport size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">{search ? "No results found." : "No reports found."}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((r, i) => (
                <ReportCard key={r.id} r={r} index={i} onView={setSelected} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end tab:items-center justify-center">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />

            {/* Sheet / Dialog */}
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 48 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 bg-white w-full tab:max-w-md tab:mx-4
                         rounded-t-3xl tab:rounded-2xl shadow-2xl
                         flex flex-col max-h-[92vh] tab:max-h-[88vh]"
            >
              {/* Gradient accent */}
              <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent flex-shrink-0" />

              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 tab:hidden flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={selected.reporter_name || ""} />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-gray-900 truncate leading-tight">{selected.reporter_name}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold mt-0.5 ${mst.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${mst.dot}`} />
                      {modalStatus}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all flex-shrink-0 ml-2"
                >
                  <HiX size={15} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto overscroll-contain">

                {/* Message */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Message</p>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selected.message}</p>
                  </div>
                </div>

                {/* Parties */}
                <div className="px-5 py-4 border-b border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Parties</p>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                    <DetailRow label="Reporter"        value={selected.reporter_name}  />
                    <DetailRow label="Reporter Email"  value={selected.reporter_email} />
                    <DetailRow label="Defendant"       value={selected.defendant_name}  />
                    <DetailRow label="Defendant Email" value={selected.defendant_email} />
                  </div>
                </div>

                {/* Meta */}
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Details</p>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                    <DetailRow label="Order / Ref" value={selected.target_id} />
                    <DetailRow label="Submitted"   value={formatDateTime(selected.created_at)} />
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4">
                {modalStatus === "resolved" ? (
                  <button
                    onClick={() => setSelected(null)}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all"
                  >
                    Close
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus("reviewed")}
                        disabled={updating || modalStatus === "reviewed"}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-all"
                      >
                        {updating ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <HiEye size={15} />}
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("resolved")}
                        disabled={updating}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-all"
                      >
                        {updating ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <HiCheckCircle size={15} />}
                        Mark Resolved
                      </button>
                    </div>
                    <button
                      onClick={() => setSelected(null)} disabled={updating}
                      className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-600 text-sm font-semibold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Report;

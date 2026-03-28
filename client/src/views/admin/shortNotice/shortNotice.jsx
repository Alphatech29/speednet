import { useState, useEffect } from "react";
import {
  createShortNoticeAPI,
  getAllShortNoticesAPI,
  updateShortNoticeAPI,
  deleteShortNoticeAPI,
} from "../../../components/backendApis/admin/apis/shortNotice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { AnimatePresence, motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX } from "react-icons/hi";
import { PiBellRingingBold } from "react-icons/pi";

/* ── Animation ────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Skeleton ─────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm animate-pulse flex items-start gap-3">
    <div className="w-8 h-8 rounded-xl bg-gray-100 flex-shrink-0 mt-0.5" />
    <div className="flex-1 space-y-2.5">
      <div className="h-3 bg-gray-100 rounded w-4/5" />
      <div className="h-3 bg-gray-100 rounded w-3/5" />
      <div className="flex items-center gap-2 pt-1">
        <div className="h-4 bg-gray-100 rounded-full w-14" />
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
    </div>
    <div className="flex gap-1.5 flex-shrink-0">
      <div className="w-7 h-7 rounded-lg bg-gray-100" />
      <div className="w-7 h-7 rounded-lg bg-gray-100" />
    </div>
  </div>
);

/* ── Notice card ──────────────────────────────────────────────── */
const NoticeCard = ({ item, index, onEdit, onDelete, deleting }) => {
  const isActive  = item.status === "active";
  const isBusy    = deleting === item.id;

  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-start gap-3"
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isActive ? "bg-primary-600/10" : "bg-gray-100"}`}>
        <PiBellRingingBold size={14} className={isActive ? "text-primary-600" : "text-gray-400"} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-relaxed">{item.message}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold
            ${isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
            {item.status}
          </span>
          <span className="text-[10px] text-gray-400">{formatDateTime(item.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-600/10 hover:bg-primary-600/20 text-primary-600 transition-all"
        >
          <HiPencil size={12} />
        </button>
        <button
          onClick={() => onDelete(item.id)} disabled={isBusy}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all disabled:opacity-50"
        >
          {isBusy
            ? <div className="w-3 h-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
            : <HiTrash size={12} />
          }
        </button>
      </div>
    </motion.div>
  );
};

/* ── Component ────────────────────────────────────────────────── */
export default function ShortNotice({ notices = [], onCreate }) {
  const [allNotices,    setAllNotices]    = useState(notices);
  const [open,          setOpen]          = useState(false);
  const [message,       setMessage]       = useState("");
  const [status,        setStatus]        = useState("active");
  const [loading,       setLoading]       = useState(false);
  const [fetching,      setFetching]      = useState(false);
  const [deleting,      setDeleting]      = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);

  useEffect(() => {
    setFetching(true);
    getAllShortNoticesAPI()
      .then((res) => {
        if (res?.success) {
          setAllNotices(res.data.map((item) => ({
            id:        item.id,
            message:   item.content,
            status:    item.status || "active",
            createdAt: item.created_at || new Date().toISOString(),
          })));
        } else toast.error(res?.message || "Failed to fetch notices.");
      })
      .catch(() => toast.error("Something went wrong while fetching notices."))
      .finally(() => setFetching(false));
  }, []);

  const closeModal = () => {
    setOpen(false); setEditingNotice(null); setMessage(""); setStatus("active");
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice); setMessage(notice.message); setStatus(notice.status); setOpen(true);
  };

  const handleSubmit = async () => {
    if (!message.trim()) { toast.error("Message cannot be empty."); return; }
    setLoading(true);
    try {
      const payload = { content: message, status };
      const result  = editingNotice
        ? await updateShortNoticeAPI(editingNotice.id, payload)
        : await createShortNoticeAPI(payload);

      if (result?.success) {
        const updated = {
          id:        result.data.id,
          message:   result.data.content,
          status:    result.data.status || "active",
          createdAt: editingNotice ? editingNotice.createdAt : new Date().toISOString(),
        };
        setAllNotices((prev) =>
          editingNotice
            ? prev.map((item) => item.id === editingNotice.id ? updated : item)
            : [updated, ...prev]
        );
        onCreate?.(updated);
        toast.success(result.message || "Notice saved successfully!");
        closeModal();
      } else toast.error(result?.message || "Failed to save notice.");
    } catch { toast.error("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const deleteNotice = async (id) => {
    setDeleting(id);
    try {
      const result = await deleteShortNoticeAPI(id);
      if (result?.success) {
        setAllNotices((prev) => prev.filter((item) => item.id !== id));
        toast.success(result.message || "Notice deleted successfully!");
        if (editingNotice?.id === id) closeModal();
      } else toast.error(result?.message || "Failed to delete notice.");
    } catch { toast.error("Something went wrong. Please try again."); }
    setDeleting(null);
  };

  const active   = allNotices.filter((n) => n.status === "active").length;
  const inactive = allNotices.filter((n) => n.status !== "active").length;

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-xl font-extrabold text-gray-900">Short Notices</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage ticker notices displayed across the platform</p>
        </div>
        <button
          onClick={() => { setEditingNotice(null); setMessage(""); setStatus("active"); setOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-primary-600/20 flex-shrink-0"
        >
          <HiPlus size={13} /> New Notice
        </button>
      </div>

      {/* ── Shell ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

        {/* ── Summary strip ── */}
        <AnimatePresence>
          {!fetching && allNotices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-3 p-4 pb-0"
            >
              {[
                { label: "Total",    value: allNotices.length, bg: "bg-primary-600/5",  border: "border-primary-600/10", text: "text-primary-600" },
                { label: "Active",   value: active,            bg: "bg-emerald-50",      border: "border-emerald-100",    text: "text-emerald-600" },
                { label: "Inactive", value: inactive,          bg: "bg-gray-50",         border: "border-gray-200",       text: "text-gray-500"   },
              ].map(({ label, value, bg, border, text }) => (
                <div key={label} className={`flex-1 ${bg} ${border} border rounded-2xl px-3 py-2.5 text-center`}>
                  <p className={`text-base font-extrabold ${text} leading-tight`}>{value}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-wide mt-0.5 ${text}`}>{label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── List ── */}
        <div className="p-4 flex flex-col gap-3">
          {fetching ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : allNotices.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <PiBellRingingBold size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No short notices yet.</p>
              <button
                onClick={() => { setEditingNotice(null); setMessage(""); setStatus("active"); setOpen(true); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                <HiPlus size={12} /> Create First Notice
              </button>
            </div>
          ) : (
            allNotices.map((item, i) => (
              <NoticeCard
                key={item.id} item={item} index={i}
                onEdit={handleEdit} onDelete={deleteNotice} deleting={deleting}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end tab:items-center justify-center">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
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
                <div>
                  <p className="text-sm font-extrabold text-gray-900">
                    {editingNotice ? "Edit Notice" : "Create New Notice"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {editingNotice ? "Update the message or status" : "Fill in the details below"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all flex-shrink-0 ml-2"
                >
                  <HiX size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 flex flex-col gap-4">

                {/* Message field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-600">Message</label>
                    <span className={`text-[10px] font-semibold ${message.length >= 180 ? "text-red-500" : "text-gray-400"}`}>
                      {message.length}/200
                    </span>
                  </div>
                  <textarea
                    rows={4} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200}
                    placeholder="Enter notice message…"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all resize-none"
                  />
                </div>

                {/* Status toggle (edit only) */}
                {editingNotice && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Status</label>
                    <div className="flex gap-2">
                      {["active", "inactive"].map((s) => (
                        <button
                          key={s} onClick={() => setStatus(s)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all capitalize
                            ${status === s
                              ? s === "active"
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "bg-gray-700 border-gray-700 text-white"
                              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 flex gap-2">
                <button
                  onClick={closeModal} disabled={loading}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit} disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all"
                >
                  {loading
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Saving…</>
                    : <><HiCheck size={15} /> {editingNotice ? "Save Changes" : "Create Notice"}</>
                  }
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getAllPlatforms, deletePlatformById } from "../../../components/backendApis/admin/apis/platform";
import { AnimatePresence, motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiPlus, HiPencil, HiTrash, HiSearch, HiX } from "react-icons/hi";
import { PiStorefrontBold } from "react-icons/pi";
import Add  from "./modal/add";
import Edit from "./modal/edit";

/* ── Animation variant ────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Type badge colours ───────────────────────────────────────── */
const TYPE_COLORS = {
  "Social Media":           "bg-blue-50   text-blue-700   border-blue-100",
  "Email & Messaging":      "bg-violet-50 text-violet-700 border-violet-100",
  "VPN & Proxys":           "bg-slate-50  text-slate-700  border-slate-100",
  "Website":                "bg-cyan-50   text-cyan-700   border-cyan-100",
  "E-Commerce Platform":    "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Gaming":                 "bg-rose-50   text-rose-700   border-rose-100",
  "Account & Subscription": "bg-orange-50 text-orange-700 border-orange-100",
  "Other":                  "bg-gray-100  text-gray-600   border-gray-200",
};

/* ── Platform logo ────────────────────────────────────────────── */
const PlatformLogo = ({ src, name }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
        <PiStorefrontBold size={26} className="text-gray-300" />
      </div>
    );
  }
  return (
    <img
      src={src} alt={name}
      className="w-16 h-16 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
      onError={() => setErr(true)}
    />
  );
};

/* ── Skeleton card ────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-3/5" />
        <div className="h-4 bg-gray-100 rounded-full w-2/5" />
      </div>
    </div>
    <div className="h-9 bg-gray-100 rounded-xl" />
  </div>
);

/* ── Platform card ────────────────────────────────────────────── */
const PlatformCard = ({ p, index, onEdit, onDelete, deleting }) => {
  const typeCls = TYPE_COLORS[p.type] || TYPE_COLORS["Other"];
  const isBusy  = deleting === p.id;

  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col"
    >
      {/* Card body */}
      <div className="p-5 flex items-center gap-4 flex-1">
        <PlatformLogo src={p.image_path} name={p.name} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-gray-900 truncate leading-tight mb-1.5">{p.name}</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${typeCls}`}>
            {p.type || "Other"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <button
          onClick={() => onEdit(p)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary-600/8 hover:bg-primary-600/15 text-primary-600 text-xs font-bold rounded-xl transition-all"
        >
          <HiPencil size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(p.id, p.name)} disabled={isBusy}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-bold rounded-xl transition-all"
        >
          {isBusy
            ? <><div className="w-3 h-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin" /> Deleting…</>
            : <><HiTrash size={12} /> Delete</>
          }
        </button>
      </div>
    </motion.div>
  );
};

/* ── Component ────────────────────────────────────────────────── */
const Platform = () => {
  const [platforms,  setPlatforms]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [search,     setSearch]     = useState("");
  const [deleting,   setDeleting]   = useState(null);

  const fetchPlatforms = () => {
    setLoading(true);
    getAllPlatforms()
      .then((res) => { if (res?.success) setPlatforms(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlatforms(); }, []);

  const openAdd  = ()  => { setEditing(null); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p);    setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await deletePlatformById(id);
      if (res?.success) {
        setPlatforms((prev) => prev.filter((p) => p.id !== id));
        toast.success(`"${name}" deleted.`);
      } else toast.error(res?.message || `Failed to delete "${name}"`);
    } catch { toast.error(`Error deleting "${name}"`); }
    setDeleting(null);
  };

  const q        = search.toLowerCase();
  const filtered = platforms.filter((p) =>
    (p.name || "").toLowerCase().includes(q) ||
    (p.type || "").toLowerCase().includes(q)
  );

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-xl font-extrabold text-gray-900">Platforms</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage marketplace platforms and categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-primary-600/20 flex-shrink-0"
        >
          <HiPlus size={13} /> Add Platform
        </button>
      </div>

      {/* ── Shell ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

        {/* ── Summary strip ── */}
        <AnimatePresence>
          {!loading && platforms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-3 p-4 pb-0"
            >
              <div className="bg-primary-600/5 border border-primary-600/10 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                  <PiStorefrontBold size={17} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900 leading-tight">{platforms.length}</p>
                  <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wide">Total Platforms</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <HiSearch size={15} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900 leading-tight">{filtered.length}</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Showing</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-2 p-4">
          <div className="relative flex-1">
            <HiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or type…"
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all"
            />
          </div>
          {!loading && (
            <span className="flex items-center px-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-extrabold rounded-xl flex-shrink-0 whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── Grid ── */}
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <PiStorefrontBold size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">
                {search ? "No platforms match your search." : "No platforms yet. Add one to get started."}
              </p>
              {!search && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <HiPlus size={12} /> Add Platform
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((p, i) => (
                <PlatformCard
                  key={p.id} p={p} index={i}
                  onEdit={openEdit} onDelete={handleDelete} deleting={deleting}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalOpen && (
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

              {/* Drag handle — mobile only */}
              <div className="flex justify-center pt-3 pb-1 tab:hidden flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
                <div>
                  <p className="text-sm font-extrabold text-gray-900">
                    {editing ? "Edit Platform" : "Add New Platform"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {editing ? `Editing "${editing.name}"` : "Fill in the details below"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all flex-shrink-0 ml-2"
                >
                  <HiX size={15} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                {editing
                  ? <Edit existingData={editing} onClose={() => { closeModal(); fetchPlatforms(); }} />
                  : <Add  onClose={() => { closeModal(); fetchPlatforms(); }} />
                }
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Platform;

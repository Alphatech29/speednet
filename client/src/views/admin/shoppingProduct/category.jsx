import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  getDarkCategories,
  deleteCategoryAPI,
  deleteGroupAPI,
} from "../../../components/backendApis/admin/apis/darkshop";
import {
  HiChevronDown,
  HiTrash,
  HiRefresh,
  HiExclamationCircle,
  HiCollection,
  HiTag,
} from "react-icons/hi";
import { MdStorefront } from "react-icons/md";

/* ─── Animation ─────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const expand = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, height: 0,      transition: { duration: 0.2  } },
};

/* ─── Category icon with fallback ───────────────────────────── */
const CatIcon = ({ src, name }) => {
  const [err, setErr] = useState(false);
  const initial = (name || "?")[0].toUpperCase();
  const COLORS = [
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-emerald-100 text-emerald-600",
    "bg-orange-100 text-orange-600",
    "bg-rose-100 text-rose-600",
    "bg-indigo-100 text-indigo-600",
    "bg-amber-100 text-amber-600",
    "bg-teal-100 text-teal-600",
  ];
  const color = COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  if (!src || err) {
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${color}`}>
        {initial}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setErr(true)}
      className="w-10 h-10 rounded-xl object-contain border border-gray-100 bg-white flex-shrink-0"
    />
  );
};

/* ─── Skeleton card ──────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-100 rounded-xl" />
      <div className="flex-1">
        <div className="h-3.5 bg-gray-100 rounded w-2/3 mb-1.5" />
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
    <div className="h-2 bg-gray-100 rounded w-full" />
  </div>
);

/* ─── Delete confirm button ──────────────────────────────────── */
const DeleteBtn = ({ onDelete, loading, size = "md" }) => {
  const [confirm, setConfirm] = useState(false);

  const handleClick = () => {
    if (!confirm) { setConfirm(true); setTimeout(() => setConfirm(false), 2500); return; }
    setConfirm(false);
    onDelete();
  };

  const sm = size === "sm";
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={confirm ? "Click again to confirm" : "Delete"}
      className={`flex items-center gap-1 font-bold transition-all disabled:opacity-50 rounded-lg flex-shrink-0
        ${sm ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs"}
        ${confirm
          ? "bg-red-600 text-white shadow-sm"
          : "bg-red-50 hover:bg-red-100 text-red-500"
        }`}
    >
      {loading
        ? <div className={`rounded-full border-2 border-current border-t-transparent animate-spin ${sm ? "w-2.5 h-2.5" : "w-3 h-3"}`} />
        : <HiTrash size={sm ? 10 : 11} />
      }
      {confirm && <span>{sm ? "Sure?" : "Confirm?"}</span>}
    </button>
  );
};

/* ─── Main ───────────────────────────────────────────────────── */
export default function ShoppingCategories() {
  const [categories,    setCategories]  = useState([]);
  const [loading,       setLoading]     = useState(true);
  const [refreshing,    setRefreshing]  = useState(false);
  const [error,         setError]       = useState(null);
  const [openId,        setOpenId]      = useState(null);
  const [deletingId,    setDeletingId]  = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await getDarkCategories();
      if (!res?.success) throw new Error(res?.message || "Failed to load categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Error fetching categories.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteCategory = async (categoryId, name) => {
    setDeletingId(categoryId);
    try {
      const res = await deleteCategoryAPI(categoryId);
      if (res?.success) {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
        if (openId === categoryId) setOpenId(null);
        toast.success(`Category "${name}" deleted.`);
      } else toast.error(res?.message || "Failed to delete category.");
    } catch { toast.error("Error deleting category."); }
    setDeletingId(null);
  };

  const handleDeleteGroup = async (groupId, name) => {
    setDeletingId(groupId);
    try {
      const res = await deleteGroupAPI(groupId);
      if (res?.success) {
        setCategories((prev) => prev.map((cat) => ({
          ...cat,
          groups: cat.groups?.filter((g) => g.id !== groupId),
        })));
        toast.success(`Sub-category "${name}" deleted.`);
      } else toast.error(res?.message || "Failed to delete sub-category.");
    } catch { toast.error("Error deleting sub-category."); }
    setDeletingId(null);
  };

  const totalGroups = categories.reduce((s, c) => s + (c.groups?.length || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* ── Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">Dark Shop</p>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage dark shop categories and their sub-categories</p>
        </div>
        <button
          onClick={() => fetchCategories(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 shadow-sm transition-all"
        >
          <HiRefresh size={13} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </motion.div>

      {/* ── Summary strip ── */}
      {!loading && !error && categories.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="bg-white border border-gray-100 rounded-2xl px-5 py-3.5 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <HiCollection size={15} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Categories</p>
              <p className="text-sm font-extrabold text-gray-900">{categories.length}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <HiTag size={15} className="text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Sub-categories</p>
              <p className="text-sm font-extrabold text-gray-900">{totalGroups}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── States ── */}
      {loading ? (
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <HiExclamationCircle size={16} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-700">Failed to load categories</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
            <button onClick={() => fetchCategories()}
              className="mt-2 text-xs font-bold text-red-600 hover:underline">
              Try again
            </button>
          </div>
        </motion.div>
      ) : categories.length === 0 ? (
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <MdStorefront size={28} className="text-gray-300" />
          </div>
          <p className="text-sm font-bold text-gray-400">No categories yet</p>
          <p className="text-xs text-gray-300">Create a category to get started</p>
        </motion.div>
      ) : (

        /* ── Category grid ── */
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-4">
          {categories.map((cat, idx) => {
            const isOpen     = openId === cat.id;
            const groupCount = cat.groups?.length || 0;

            return (
              <motion.div
                key={cat.id}
                variants={fadeUp} initial="hidden" animate="visible" custom={idx}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* ── Category header ── */}
                <div className="p-4">
                  <div className="flex items-center gap-3">

                    {/* Icon */}
                    <CatIcon src={cat.icon} name={cat.name} />

                    {/* Name + group count */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{cat.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {groupCount} sub-{groupCount === 1 ? "category" : "categories"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <DeleteBtn
                        onDelete={() => handleDeleteCategory(cat.id, cat.name)}
                        loading={deletingId === cat.id}
                      />
                      <button
                        onClick={() => setOpenId(isOpen ? null : cat.id)}
                        className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all
                          ${isOpen
                            ? "bg-primary-600/10 border-primary-600/20 text-primary-600"
                            : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                          }`}
                      >
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <HiChevronDown size={14} />
                        </motion.div>
                      </button>
                    </div>
                  </div>

                  {/* Progress bar: groups visual */}
                  {groupCount > 0 && (
                    <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((groupCount / 10) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* ── Sub-categories panel ── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      variants={expand}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-50 bg-gray-50/50 px-4 py-3 flex flex-col gap-1.5 max-h-52 overflow-y-auto">
                        {groupCount > 0 ? (
                          cat.groups.map((g, gi) => (
                            <div key={g.id}
                              className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl group hover:border-gray-200 transition-all">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-lg bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                  {gi + 1}
                                </span>
                                <span className="text-xs font-medium text-gray-700 truncate">{g.name}</span>
                              </div>
                              <DeleteBtn
                                onDelete={() => handleDeleteGroup(g.id, g.name)}
                                loading={deletingId === g.id}
                                size="sm"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-xs text-gray-400">No sub-categories yet</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

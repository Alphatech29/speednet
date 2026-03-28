import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiCheckCircle, HiArrowRight } from "react-icons/hi";
import { PiTrafficConeLight } from "react-icons/pi";
import { HiCurrencyDollar } from "react-icons/hi2";
import { getAllProducts, bulkUpdateProductStatus } from "../../../../components/backendApis/admin/apis/products";
import { formatDateTime } from "../../../../components/utils/formatTimeDate";

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Safe product logo ────────────────────────────────────────── */
const ProductLogo = ({ src, title }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
        <PiTrafficConeLight size={22} className="text-amber-300" />
      </div>
    );
  }
  return (
    <img
      src={src} alt={title}
      className="w-16 h-16 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
      onError={() => setErr(true)}
    />
  );
};

/* ── Avatar initial ───────────────────────────────────────────── */
const COLORS = [
  "bg-violet-100 text-violet-600", "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600", "bg-orange-100 text-orange-600",
  "bg-rose-100 text-rose-600", "bg-sky-100 text-sky-600",
];
const Avatar = ({ name = "" }) => {
  const color = COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  return (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold flex-shrink-0 ${color}`}>
      {name.charAt(0).toUpperCase() || "?"}
    </div>
  );
};

/* ── Skeleton card ────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-4">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2.5">
      <div className="h-2.5 bg-gray-100 rounded w-1/4" />
      <div className="h-3.5 bg-gray-100 rounded w-3/5" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gray-100" />
          <div className="h-2.5 bg-gray-100 rounded w-20" />
        </div>
        <div className="h-7 bg-gray-100 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

/* ── Product card ─────────────────────────────────────────────── */
const ProductCard = ({ p, index, selected, onToggle }) => {
  const isSelected = selected.includes(p.id);
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4
        ${isSelected ? "border-primary-600 ring-2 ring-primary-600/10" : "border-gray-100 hover:border-gray-200"}`}
    >
      {/* Checkbox + Logo — left */}
      <div className="relative flex-shrink-0">
        <ProductLogo src={p.logo_url} title={p.title} />
        <button
          onClick={() => onToggle(p.id)}
          className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shadow-sm
            ${isSelected ? "bg-primary-600 border-primary-600" : "bg-white border-gray-300 hover:border-primary-600"}`}
        >
          {isSelected && <HiCheckCircle size={11} className="text-white" />}
        </button>
      </div>

      {/* Content — right */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Platform */}
        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest leading-none">{p.platform}</p>

        {/* Title + status badge */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2 flex-1">{p.title}</p>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold flex-shrink-0 bg-amber-50 text-amber-700 border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Reviewing
          </span>
        </div>

        {/* Price + date */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <HiCurrencyDollar size={13} className="text-emerald-500 flex-shrink-0" />
            <span className="text-sm font-extrabold text-gray-900">${Number(p.price).toLocaleString("en-US")}</span>
          </div>
          <span className="text-[10px] text-gray-400">{p.create_at ? formatDateTime(p.create_at) : "—"}</span>
        </div>

        {/* Merchant + action */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-50 mt-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar name={p.user_username || p.username || ""} />
            <p className="text-[10px] font-semibold text-gray-500 truncate">{p.user_username || p.username}</p>
          </div>
          <NavLink
            to={`/admin/products/${p.id}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white text-[10px] font-bold rounded-xl transition-all flex-shrink-0"
          >
            Review <HiArrowRight size={10} />
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Component ────────────────────────────────────────────────── */
const UnderReviewingTab = () => {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState([]);
  const [approving, setApproving] = useState(false);
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setProducts(
            res.data
              .filter((p) => p.status?.toLowerCase() === "under reviewing")
              .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
          );
        } else toast.error("Failed to fetch products");
      })
      .catch(() => toast.error("Error fetching products"))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle    = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const handleSelectAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));

  const handleApproveSelected = async () => {
    if (!selected.length) { toast.warning("No product selected"); return; }
    setApproving(true);
    try {
      const payload = selected.map((id) => ({ id, status: "approved" }));
      const res     = await bulkUpdateProductStatus(payload);
      if (res?.success) {
        toast.success(`${selected.length} product${selected.length > 1 ? "s" : ""} approved`);
        setProducts((prev) => prev.filter((p) => !selected.includes(p.id)));
        setSelected([]);
      } else toast.error(res?.message || "Bulk approval failed");
    } catch { toast.error("Error during bulk approval"); }
    setApproving(false);
  };

  const q        = search.toLowerCase();
  const filtered = products.filter((p) =>
    (p.title        || "").toLowerCase().includes(q) ||
    (p.platform     || "").toLowerCase().includes(q) ||
    (p.user_username|| p.username || "").toLowerCase().includes(q)
  );
  const allSelected = filtered.length > 0 && selected.length === filtered.length;

  return (
    <div className="flex flex-col gap-4">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* ── Summary strip ── */}
      <AnimatePresence>
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex gap-3"
          >
            <div className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <PiTrafficConeLight size={15} className="text-amber-600" />
                </div>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Awaiting</p>
              </div>
              <p className="text-xl font-extrabold text-gray-900 leading-tight">{products.length}</p>
            </div>
            <div className="flex-1 bg-primary-600/5 border border-primary-600/10 rounded-2xl px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                  <HiCheckCircle size={15} className="text-primary-600" />
                </div>
                <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wide">Selected</p>
              </div>
              <p className="text-xl font-extrabold text-gray-900 leading-tight">{selected.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bulk action bar ── */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0,  height: "auto" }}
            exit={{    opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 bg-primary-600/5 border border-primary-600/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <HiCheckCircle size={13} className="text-white" />
                </div>
                <p className="text-sm font-bold text-primary-700">
                  {selected.length} product{selected.length > 1 ? "s" : ""} selected
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelected([])}
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-xl transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={handleApproveSelected} disabled={approving}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all"
                >
                  {approving
                    ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Approving…</>
                    : <><HiCheckCircle size={13} /> Approve {selected.length}</>
                  }
                </button>
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
            placeholder="Search by title, platform or merchant…"
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all"
          />
        </div>
        {!loading && filtered.length > 0 && (
          <button
            onClick={handleSelectAll}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all flex-shrink-0
              ${allSelected
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
          >
            <HiCheckCircle size={13} />
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        )}
        {!loading && (
          <span className="flex items-center px-3 py-2.5 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-extrabold rounded-xl flex-shrink-0 whitespace-nowrap">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <PiTrafficConeLight size={24} className="text-amber-300" />
          </div>
          <p className="text-sm text-gray-400">{search ? "No results found." : "No products pending review."}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} selected={selected} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UnderReviewingTab;

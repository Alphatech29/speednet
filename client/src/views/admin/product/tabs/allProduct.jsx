import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiArrowRight } from "react-icons/hi";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { HiCurrencyDollar } from "react-icons/hi2";
import { getAllProducts } from "../../../../components/backendApis/admin/apis/products";

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Status config ────────────────────────────────────────────── */
const STATUS = {
  approved: { cls: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  sold:     { cls: "bg-blue-50 text-blue-700 border-blue-100",          dot: "bg-blue-500"    },
};

/* ── Safe product logo ────────────────────────────────────────── */
const ProductLogo = ({ src, title }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
        <PiShoppingCartSimpleFill size={22} className="text-gray-300" />
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
const ProductCard = ({ p, index }) => {
  const st = STATUS[p.status?.toLowerCase()] || { cls: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" };
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-4"
    >
      {/* Logo — left */}
      <ProductLogo src={p.logo_url} title={p.title} />

      {/* Content — right */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Platform */}
        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest leading-none">{p.platform}</p>

        {/* Title + status badge */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2 flex-1">{p.title}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold flex-shrink-0 ${st.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {p.status}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1">
          <HiCurrencyDollar size={13} className="text-emerald-500 flex-shrink-0" />
          <span className="text-sm font-extrabold text-gray-900">${Number(p.price).toLocaleString()}</span>
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
            View <HiArrowRight size={10} />
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Component ────────────────────────────────────────────────── */
const AllProductTab = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setProducts(
            res.data
              .filter((p) => ["approved", "sold"].includes(p.status?.toLowerCase()))
              .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
          );
        } else toast.error("Failed to fetch products");
      })
      .catch(() => toast.error("Error fetching products"))
      .finally(() => setLoading(false));
  }, []);

  const q        = search.toLowerCase();
  const filtered = products.filter((p) =>
    (p.title        || "").toLowerCase().includes(q) ||
    (p.platform     || "").toLowerCase().includes(q) ||
    (p.user_username|| p.username || "").toLowerCase().includes(q)
  );

  const approved = products.filter((p) => p.status?.toLowerCase() === "approved").length;
  const sold     = products.filter((p) => p.status?.toLowerCase() === "sold").length;

  return (
    <div className="flex flex-col gap-4">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* ── Summary strip ── */}
      <AnimatePresence>
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex w-full gap-3"
          >
            {[
              { label: "Total",    value: products.length, bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-600"    },
              { label: "Approved", value: approved,        bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
              { label: "Sold",     value: sold,            bg: "bg-indigo-50",  border: "border-indigo-100",  text: "text-indigo-600"  },
            ].map(({ label, value, bg, border, text }) => (
              <div key={label} className={`flex-1 ${bg} ${border} border rounded-2xl px-4 py-3 flex items-center justify-between`}>
                <p className={`text-[10px] font-bold uppercase tracking-wide ${text}`}>{label}</p>
                <p className={`text-lg font-extrabold ${text} leading-tight`}>{value}</p>
              </div>
            ))}
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
        {!loading && (
          <span className="flex items-center px-3 py-2.5 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-extrabold rounded-xl flex-shrink-0 whitespace-nowrap">
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
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <PiShoppingCartSimpleFill size={24} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">{search ? "No results found." : "No products found."}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default AllProductTab;

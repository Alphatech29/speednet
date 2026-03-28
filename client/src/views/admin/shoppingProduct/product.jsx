import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch } from "react-icons/bi";
import {
  HiChevronLeft, HiChevronRight, HiArrowLeft,
  HiX, HiPencil, HiTag, HiExclamationCircle,
} from "react-icons/hi";
import { MdStorefront } from "react-icons/md";
import { getDarkCategories, getDarkProducts } from "../../../components/backendApis/admin/apis/darkshop";
import Pagination from "../../admin/partials/pagination";
import { useShopping } from "../../../components/control/shoppingContext";

/* ─── Constants ──────────────────────────────────────────────────── */
const ITEMS_PER_SLIDE = 20;
const ITEMS_PER_PAGE  = 100;

/* ─── Product image with fallback ───────────────────────────────── */
const ProductThumb = ({ src, name }) => {
  const [err, setErr] = useState(false);
  if (err || !src)
    return (
      <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-100 flex items-center justify-center flex-shrink-0">
        <MdStorefront size={16} className="text-gray-300" />
      </div>
    );
  return (
    <img src={src} alt={name} onError={() => setErr(true)}
      className="w-11 h-11 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
  );
};

/* ─── Stock badge ────────────────────────────────────────────────── */
const StockBadge = ({ qty }) => {
  const n = Number(qty || 0);
  const cls = n === 0
    ? "bg-red-50 text-red-600 border-red-100"
    : n < 10
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-emerald-50 text-emerald-700 border-emerald-100";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${cls}`}>
      {n === 0 ? "Out of stock" : `Qty: ${n}`}
    </span>
  );
};

/* ─── Skeleton ───────────────────────────────────────────────────── */
const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[18, 11, 45, 25, 25, 18].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-3 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${w + (i * 8) % 25}%` }} />
      </td>
    ))}
  </tr>
);

const CategorySkeleton = () => (
  <div className="flex flex-wrap gap-2">
    {[80, 100, 70, 120, 90, 110, 75, 95, 85, 105].map((w, i) => (
      <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" style={{ width: `${w}px` }} />
    ))}
  </div>
);

/* ─── Empty state ────────────────────────────────────────────────── */
const Empty = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
      <MdStorefront size={22} className="text-gray-300" />
    </div>
    <p className="text-sm font-semibold text-gray-400">{message}</p>
    <p className="text-xs text-gray-300 mt-0.5">New items will appear here automatically.</p>
  </div>
);

/* ─── Table helpers ──────────────────────────────────────────────── */
const Th = ({ children, right = false }) => (
  <th className={`px-5 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap
    ${right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-5 py-4 text-sm text-gray-700 ${className}`}>{children}</td>
);

/* ─── Mobile product card ────────────────────────────────────────── */
const MobileProductCard = ({ p, onEdit, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.02, ease: "easeOut" }}
    className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
  >
    <ProductThumb src={p.miniature} name={p.name} />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-800 leading-none truncate">{p.name || "—"}</p>
          <p className="text-[10px] font-mono text-gray-400 mt-0.5">ID: {p.id}</p>
        </div>
        <button onClick={() => onEdit(p.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-bold rounded-lg transition-all flex-shrink-0">
          <HiPencil size={10} /> Edit
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <StockBadge qty={p.stock_quantity} />
        <span className="text-[10px] font-bold text-gray-600">
          {Number(p.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </span>
        {p.price_rub && (
          <span className="text-[10px] text-gray-400">{Number(p.price_rub).toFixed(2)} ₽</span>
        )}
      </div>
    </div>
  </motion.div>
);

/* ─── Main component ─────────────────────────────────────────────── */
export default function ShoppingProducts() {
  const navigate = useNavigate();
  const {
    categories, setCategories, products, setProducts,
    currentSlide, setCurrentSlide, openCategoryId, setOpenCategoryId,
    selectedGroupId, setSelectedGroupId, currentProductPage, setCurrentProductPage,
    scrollY, setScrollY,
  } = useShopping();

  const [loading,         setLoading]         = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error,           setError]           = useState(null);
  const [searchTerm,      setSearchTerm]      = useState("");

  useEffect(() => {
    if (categories.length > 0) { setLoading(false); return; }
    getDarkCategories()
      .then((res) => {
        if (!res?.success) throw new Error(res?.message);
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => setError(err.message || "Error fetching categories"))
      .finally(() => setLoading(false));
  }, [categories, setCategories]);

  useEffect(() => {
    if (products.length > 0) { setProductsLoading(false); return; }
    getDarkProducts()
      .then((res) => {
        if (!res?.success) throw new Error(res?.message);
        setProducts(res.data);
      })
      .catch((err) => setError(err.message || "Error fetching products"))
      .finally(() => setProductsLoading(false));
  }, [products, setProducts]);

  useEffect(() => {
    if (scrollY) window.scrollTo(0, scrollY);
  }, [scrollY]);

  const totalSlides    = Math.ceil(categories.length / ITEMS_PER_SLIDE);
  const activeCategory = categories.find((c) => c.id === openCategoryId);
  const visibleCats    = openCategoryId
    ? [activeCategory]
    : categories.slice(currentSlide * ITEMS_PER_SLIDE, currentSlide * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE);

  const filteredProducts = products
    .filter((p) => (selectedGroupId ? p.group_id === selectedGroupId : true))
    .filter((p) => {
      if (!searchTerm.trim()) return true;
      const t = searchTerm.toLowerCase();
      return String(p.id).includes(t) || p.name?.toLowerCase().includes(t);
    });

  const totalProductPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const visibleProducts   = filteredProducts.slice(
    (currentProductPage - 1) * ITEMS_PER_PAGE,
    currentProductPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => { setScrollY(window.scrollY); navigate(`/admin/shopping/product/edit/${id}`); };

  const clearSearch = () => { setSearchTerm(""); setCurrentProductPage(1); };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
        className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Shopping Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">Browse categories and manage product listings</p>
        </div>
        {!productsLoading && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
              <MdStorefront size={14} className="text-primary-600" />
              <span className="text-xs font-bold text-gray-700">{products.length.toLocaleString()} products</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
              <HiTag size={14} className="text-indigo-500" />
              <span className="text-xs font-bold text-gray-700">{categories.length} categories</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 border border-red-100 rounded-2xl text-red-700">
          <HiExclamationCircle size={18} className="flex-shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* ── Categories panel ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.07 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/40">
          <div className="flex items-center gap-2">
            {openCategoryId && (
              <>
                <button onClick={() => { setOpenCategoryId(null); setSelectedGroupId(null); }}
                  className="text-[11px] font-semibold text-gray-400 hover:text-primary-600 transition-colors">
                  Categories
                </button>
                <HiChevronRight size={12} className="text-gray-300" />
              </>
            )}
            <span className={`text-[11px] font-bold ${openCategoryId ? "text-gray-800" : "text-gray-500 uppercase tracking-widest"}`}>
              {openCategoryId ? activeCategory?.name : "All Categories"}
            </span>
            {!openCategoryId && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold">
                {categories.length}
              </span>
            )}
            {openCategoryId && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[9px] font-bold">
                {activeCategory?.groups?.length || 0} groups
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {openCategoryId ? (
              <button onClick={() => { setOpenCategoryId(null); setSelectedGroupId(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 text-[11px] font-bold rounded-xl transition-all shadow-sm">
                <HiArrowLeft size={11} /> Back
              </button>
            ) : (
              <>
                <button onClick={() => setCurrentSlide(Math.max(currentSlide - 1, 0))}
                  disabled={currentSlide === 0}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <HiChevronLeft size={13} />
                </button>
                <span className="text-[10px] font-bold text-gray-400 px-1 min-w-[32px] text-center tabular-nums">
                  {currentSlide + 1}/{totalSlides || 1}
                </span>
                <button onClick={() => setCurrentSlide(Math.min(currentSlide + 1, totalSlides - 1))}
                  disabled={currentSlide >= totalSlides - 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <HiChevronRight size={13} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-4">
          {loading ? (
            <CategorySkeleton />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={openCategoryId ?? `slide-${currentSlide}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                {/* ── All-categories grid ── */}
                {!openCategoryId && (
                  <div className="grid grid-cols-2 tab:grid-cols-4 pc:grid-cols-5 gap-2.5">
                    {visibleCats.map((cat) => cat && (
                      <button key={cat.id}
                        onClick={() => { setOpenCategoryId(cat.id); setSelectedGroupId(null); }}
                        className="group flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-left
                          bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-200
                          transition-all duration-150 hover:shadow-sm"
                      >
                        {/* Icon or initial */}
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-colors overflow-hidden">
                          {cat.icon
                            ? <img src={cat.icon} alt="" className="w-5 h-5 object-contain"
                                onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            : <span className="text-[11px] font-extrabold text-gray-400 group-hover:text-indigo-500 transition-colors">
                                {(cat.name || "?")[0].toUpperCase()}
                              </span>
                          }
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-700 group-hover:text-indigo-700 leading-none truncate transition-colors">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                            {cat.groups?.length || 0} group{cat.groups?.length !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <HiChevronRight size={12} className="text-gray-300 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Group selection (category opened) ── */}
                {openCategoryId && visibleCats[0] && (
                  <div className="flex flex-col gap-4">

                    {/* Category summary strip */}
                    <div className="flex items-center gap-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                        {visibleCats[0].icon
                          ? <img src={visibleCats[0].icon} alt="" className="w-6 h-6 object-contain"
                              onError={(e) => { e.currentTarget.style.display = "none"; }} />
                          : <span className="text-sm font-extrabold text-indigo-400">
                              {(visibleCats[0].name || "?")[0].toUpperCase()}
                            </span>
                        }
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-indigo-800 leading-none">{visibleCats[0].name}</p>
                        <p className="text-[11px] text-indigo-500 mt-0.5">
                          {visibleCats[0].groups?.length || 0} groups available — click a group to filter products
                        </p>
                      </div>
                    </div>

                    {/* Groups grid */}
                    {visibleCats[0].groups?.length > 0 ? (
                      <div className="grid grid-cols-2 tab:grid-cols-3 pc:grid-cols-4 gap-2">
                        {/* "All products" option */}
                        <button
                          onClick={() => { setSelectedGroupId(null); setCurrentProductPage(1); }}
                          className={`flex items-center gap-2 px-3.5 py-3 rounded-xl border text-left transition-all duration-150
                            ${!selectedGroupId
                              ? "bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-600/25"
                              : "bg-white border-gray-200 text-gray-600 hover:border-primary-600/40 hover:bg-primary-600/5"
                            }`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold
                            ${!selectedGroupId ? "bg-white/20" : "bg-gray-100"}`}>
                            All
                          </span>
                          <span className="text-xs font-bold truncate">All Products</span>
                        </button>

                        {visibleCats[0].groups.map((g) => (
                          <button key={g.id}
                            onClick={() => { setSelectedGroupId(g.id); setCurrentProductPage(1); }}
                            className={`flex items-center gap-2 px-3.5 py-3 rounded-xl border text-left transition-all duration-150
                              ${selectedGroupId === g.id
                                ? "bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-600/25"
                                : "bg-white border-gray-200 text-gray-700 hover:border-primary-600/40 hover:bg-primary-600/5"
                              }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold
                              ${selectedGroupId === g.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                              {(g.name || "?")[0].toUpperCase()}
                            </span>
                            <span className="text-xs font-bold truncate">{g.name}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-xs font-semibold text-gray-400">No groups in this category.</p>
                        <p className="text-[11px] text-gray-300 mt-0.5">All products are shown below.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* ── Products panel ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.13 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
              <MdStorefront size={15} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 leading-none">Products</p>
              {!productsLoading && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {filteredProducts.length.toLocaleString()} {searchTerm || selectedGroupId ? "matching" : "total"} items
                </p>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full tab:w-64">
            <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search by ID or name…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentProductPage(1); }}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10
                transition-all placeholder:text-gray-400 text-gray-800"
            />
            {searchTerm && (
              <button onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <HiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile card list */}
        <div className="tab:hidden">
          {productsLoading
            ? <div className="animate-pulse divide-y divide-gray-50">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/5" />
                      <div className="h-2.5 bg-gray-100 rounded w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            : visibleProducts.length > 0
              ? visibleProducts.map((p, i) => (
                  <MobileProductCard key={p.id} p={p} onEdit={handleEdit} i={i} />
                ))
              : <Empty message="No products found." />
          }
        </div>

        {/* Desktop table */}
        <div className="hidden tab:block overflow-x-auto admin-table-wrap">
          <table className="w-full text-left">
            <thead className="bg-gray-50/60 border-b border-gray-100">
              <tr>
                <Th>ID</Th>
                <Th>Product</Th>
                <Th>Stock</Th>
                <Th right>Price (USD)</Th>
                <Th right>Price (RUB)</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productsLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : visibleProducts.length > 0
                  ? visibleProducts.map((p, i) => (
                      <motion.tr key={p.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.015 }}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <Td>
                          <span className="font-mono text-[11px] text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                            {p.id}
                          </span>
                        </Td>

                        <Td>
                          <div className="flex items-center gap-3">
                            <ProductThumb src={p.miniature} name={p.name} />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 max-w-[220px]">
                                {p.name || "—"}
                              </p>
                            </div>
                          </div>
                        </Td>

                        <Td>
                          <StockBadge qty={p.stock_quantity} />
                        </Td>

                        <Td className="text-right">
                          <span className="text-sm font-extrabold text-gray-800">
                            {Number(p.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                          </span>
                        </Td>

                        <Td className="text-right">
                          <span className="text-sm font-bold text-gray-600">
                            {p.price_rub ? `${Number(p.price_rub).toFixed(2)} ₽` : "—"}
                          </span>
                        </Td>

                        <Td>
                          <button onClick={() => handleEdit(p.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700
                              active:bg-primary-800 text-white text-xs font-bold rounded-xl transition-all
                              shadow-sm shadow-primary-600/20 group-hover:shadow-md">
                            <HiPencil size={12} /> Edit
                          </button>
                        </Td>
                      </motion.tr>
                    ))
                  : (
                    <tr>
                      <td colSpan={6} className="py-4">
                        <Empty message="No products found." />
                      </td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!productsLoading && visibleProducts.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-bold text-gray-600">
                {((currentProductPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentProductPage * ITEMS_PER_PAGE, filteredProducts.length)}
              </span>
              {" "}of{" "}
              <span className="font-bold text-gray-600">{filteredProducts.length.toLocaleString()}</span> products
            </p>
            {totalProductPages > 1 && (
              <Pagination
                totalPages={totalProductPages}
                initialPage={currentProductPage}
                onPageChange={setCurrentProductPage}
              />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

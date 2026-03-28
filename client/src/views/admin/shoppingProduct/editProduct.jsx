import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDarkShopProductById, updateDarkShopProductAPI } from "../../../components/backendApis/admin/apis/darkshop";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { HiArrowLeft, HiCheck, HiPhotograph, HiTag, HiCurrencyDollar, HiDocumentText } from "react-icons/hi";
import { MdStorefront } from "react-icons/md";

/* ─── Animation ─────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Image with fallback ────────────────────────────────────── */
const ProductImage = ({ src, name }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-full h-52 tab:h-72 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 rounded-2xl gap-3">
        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
          <MdStorefront size={28} className="text-gray-300" />
        </div>
        <p className="text-xs text-gray-400 font-medium">No image available</p>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setErr(true)}
      className="w-full h-52 tab:h-72 object-cover rounded-2xl border border-gray-100 shadow-sm"
    />
  );
};

/* ─── Field wrapper ──────────────────────────────────────────── */
const Field = ({ label, hint, icon: Icon, children }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
        {Icon && <Icon size={12} className="text-gray-400" />}
        {label}
      </label>
      {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
    </div>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 " +
  "focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all " +
  "placeholder:text-gray-300";

const readonlyCls =
  "w-full px-4 py-3 text-sm rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-default outline-none";

/* ─── Main ───────────────────────────────────────────────────── */
const ViewProduct = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [product,   setProduct]   = useState({ name: "", price: "", miniature: "", description: "" });
  const [editable,  setEditable]  = useState({ name: "", description: "" });
  const [dirty,     setDirty]     = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchDarkShopProductById(id)
      .then((res) => {
        if (!res?.success) throw new Error(res?.message || "Product not found");
        const d = {
          name:        res.data.name        || "",
          price:       res.data.price       || "",
          miniature:   res.data.miniature   || "",
          description: res.data.description || "",
        };
        setProduct(d);
        setEditable({ name: d.name, description: d.description });
        const t = d.description.trim();
        setWordCount(t ? t.split(/\s+/).length : 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleNameChange = (e) => {
    setEditable((p) => ({ ...p, name: e.target.value }));
    setDirty(true);
  };

  const handleDescriptionChange = (e) => {
    const v = e.target.value;
    setEditable((p) => ({ ...p, description: v }));
    const t = v.trim();
    setWordCount(t ? t.split(/\s+/).length : 0);
    setDirty(true);
  };

  const handleSave = async () => {
    if (!editable.name.trim())        { toast.error("Product name is required"); return; }
    if (!editable.description.trim()) { toast.error("Description is required");  return; }
    setSaving(true);
    try {
      const res = await updateDarkShopProductAPI({ id, name: editable.name, description: editable.description });
      if (!res?.success) throw new Error(res?.message || "Failed to update product");
      toast.success("Product updated successfully");
      setDirty(false);
    } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading product…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-red-500 text-sm font-bold">!</span>
      </div>
      <div>
        <p className="text-sm font-bold text-red-700">Failed to load product</p>
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
        <button onClick={() => navigate(-1)}
          className="mt-3 text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
          <HiArrowLeft size={11} /> Go back
        </button>
      </div>
    </div>
  );

  const hasChanges = dirty &&
    (editable.name !== product.name || editable.description !== product.description);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* ── Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all">
            <HiArrowLeft size={15} />
          </button>
          <div>
            <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-0.5">Dark Shop</p>
            <h1 className="text-lg font-extrabold text-gray-900 leading-tight">Edit Product</h1>
            <p className="text-xs text-gray-400 mt-0.5">Update product name and description</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
            {saving
              ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
              : <><HiCheck size={13} /> Save Changes</>
            }
          </button>
        </div>
      </motion.div>

      {/* ── Product image ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
        <div className="flex items-center gap-2 mb-3">
          <HiPhotograph size={13} className="text-gray-400" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Image</p>
        </div>
        <ProductImage src={product.miniature} name={product.name} />
      </motion.div>

      {/* ── Edit form ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Card accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

        <div className="p-5 tab:p-6 flex flex-col gap-5">

          {/* Product name */}
          <Field label="Product Name" icon={HiTag}>
            <input
              type="text"
              value={editable.name}
              onChange={handleNameChange}
              placeholder="Enter product name"
              className={inputCls}
            />
          </Field>

          {/* Price — read-only */}
          <Field label="Price" icon={HiCurrencyDollar}>
            <div className="relative">
              <input
                type="text"
                value={`$${product.price}`}
                readOnly
                className={readonlyCls}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                Read-only
              </span>
            </div>
          </Field>

          {/* Description */}
          <Field
            label="Description"
            icon={HiDocumentText}
            hint={`${wordCount} word${wordCount !== 1 ? "s" : ""}`}
          >
            <textarea
              value={editable.description}
              onChange={handleDescriptionChange}
              placeholder="Write a detailed product description…"
              rows={10}
              className={`${inputCls} resize-y leading-relaxed`}
            />
          </Field>

        </div>

        {/* Card footer */}
        <div className="border-t border-gray-50 bg-gray-50/60 px-5 tab:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-gray-400">
            Only <span className="font-bold text-gray-600">name</span> and{" "}
            <span className="font-bold text-gray-600">description</span> can be edited.
          </p>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-all">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </motion.div>

    </div>
  );
};

export default ViewProduct;

import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { getProductById, updateProductById } from "../../../components/backendApis/admin/apis/products";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeft, HiPencil, HiCheck, HiX } from "react-icons/hi";

const FIELDS = [
  { id: "platform",               label: "Platform",                    readOnly: true },
  { id: "title",                  label: "Title" },
  { id: "email",                  label: "Account Email",               type: "email" },
  { id: "username",               label: "Account Username" },
  { id: "password",               label: "Password" },
  { id: "recovery_email",         label: "Recovery Email" },
  { id: "recoveryEmailpassword",  label: "Recovery Email Password" },
  { id: "additionalEmail",        label: "Additional Email" },
  { id: "additionalPassword",     label: "Additional Password" },
  { id: "previewLink",            label: "Preview Link" },
  { id: "price",                  label: "Price",                       type: "number" },
  { id: "subscription_status",    label: "Subscription Status" },
  { id: "expiry_date",            label: "Expiry Date" },
];

const inputCls = (ro) => `w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
  ro ? "bg-gray-50 border-gray-100 text-gray-500 cursor-default"
     : "bg-white border-gray-200 text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
}`;

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct]   = useState(null);
  const [form, setForm]         = useState({});
  const [initial, setInitial]   = useState({});
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        if (res?.success) {
          setProduct(res.data); setForm(res.data); setInitial(res.data);
        } else toast.error("Failed to fetch product details");
      } catch { toast.error("Error fetching product"); }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { id: fid, value } = e.target;
    setForm((p) => ({ ...p, [fid]: value }));
  };

  const handleSave = async () => {
    if (form.status === "rejected" && !form.remark?.trim()) {
      toast.error("Remark is required when status is Rejected"); return;
    }
    const changed = {};
    Object.keys(form).forEach((k) => { if (form[k] !== initial[k]) changed[k] = form[k]; });
    if (!Object.keys(changed).length) { toast.info("No changes to save"); return; }
    setSaving(true);
    try {
      const res = await updateProductById(id, changed);
      if (res?.success) {
        toast.success(res.message || "Product updated successfully");
        setInitial(form); setEditing(false);
      } else toast.error(res?.message || "Failed to update product");
    } catch { toast.error("Unexpected error occurred"); }
    setSaving(false);
  };

  if (!product) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400">Loading product...</p>
      </div>
    </div>
  );

  const twoFactor = form.two_factor_enabled === "1" || form.two_factor_enabled === 1 ? "Enabled" : "Disabled";

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <NavLink to="/admin/products"
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-all">
            <HiArrowLeft size={14} />
          </NavLink>
          <div>
            <p className="text-sm font-bold text-gray-800">Edit Product</p>
            <p className="text-xs text-gray-400 mt-0.5">Update product details and approval status</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!editing
            ? <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all">
                <HiPencil size={12} /> Edit
              </button>
            : <>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all">
                  <HiCheck size={12} /> {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setForm(initial); setEditing(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-all">
                  <HiX size={12} /> Cancel
                </button>
              </>
          }
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Information</p>
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-4">
          {FIELDS.map(({ id: fid, label, type = "text", readOnly }) => (
            <div key={fid} className="flex flex-col gap-1.5">
              <label htmlFor={fid} className="text-xs font-semibold text-gray-500">{label}</label>
              <input id={fid} type={type} value={form[fid] ?? ""} onChange={handleChange}
                readOnly={readOnly || !editing} className={inputCls(readOnly || !editing)} />
            </div>
          ))}

          {/* 2FA — read-only display */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">2FA Enabled</label>
            <input type="text" value={twoFactor} readOnly className={inputCls(true)} />
          </div>

          {/* 2FA description */}
          <div className="flex flex-col gap-1.5 col-span-1 tab:col-span-2">
            <label htmlFor="two_factor_description" className="text-xs font-semibold text-gray-500">2FA Instructions</label>
            <textarea id="two_factor_description" rows={3} value={form.two_factor_description ?? ""} onChange={handleChange}
              readOnly={!editing} className={`${inputCls(!editing)} resize-none`} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 col-span-1 tab:col-span-2 pc:col-span-3">
            <label htmlFor="description" className="text-xs font-semibold text-gray-500">Description</label>
            <textarea id="description" rows={4} value={form.description ?? ""} onChange={handleChange}
              readOnly={!editing} className={`${inputCls(!editing)} resize-none`} />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-xs font-semibold text-gray-500">Status</label>
            <select id="status" value={form.status || ""} onChange={handleChange} disabled={!editing}
              className={inputCls(!editing)}>
              <option value="">Select Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Remark — only when rejected */}
          {form.status === "rejected" && (
            <div className="flex flex-col gap-1.5 col-span-1 tab:col-span-2 pc:col-span-3">
              <label htmlFor="remark" className="text-xs font-semibold text-gray-500">Remark <span className="text-red-400">*</span></label>
              <textarea id="remark" rows={3} value={form.remark || ""} onChange={handleChange}
                readOnly={!editing} placeholder="Reason for rejection..."
                className={`${inputCls(!editing)} resize-none`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

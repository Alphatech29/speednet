import { useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { updatePageById } from "../../../components/backendApis/admin/apis/page";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

const Edit = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const page      = location.state?.pageData;

  const [title, setTitle]     = useState(page?.title || "");
  const [slug, setSlug]       = useState(page?.slug || "");
  const [content, setContent] = useState(page?.content || "");
  const [saving, setSaving]   = useState(false);

  if (!page) return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-red-500">No page data received.</p>
      <NavLink to="/admin/page" className="text-xs text-primary-600 underline">← Go back</NavLink>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updatePageById(page.id, { title, slug, content });
      if (res?.success) {
        toast.success("Page updated successfully!");
        setTimeout(() => navigate("/admin/page"), 1500);
      } else toast.error(res?.message || "Update failed.");
    } catch { toast.error("Something went wrong. Please try again."); }
    setSaving(false);
  };

  const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all";

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <NavLink to="/admin/page"
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-all">
            <HiArrowLeft size={14} />
          </NavLink>
          <div>
            <p className="text-sm font-bold text-gray-800">Edit Page</p>
            <p className="text-xs text-gray-400 mt-0.5">Update page content and metadata</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              required className={inputCls} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              required className={`${inputCls} font-mono`} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Content</label>
            <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Enter page content..." className={`${inputCls} resize-y`} />
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all">
              <HiCheck size={12} /> {saving ? "Updating..." : "Update Page"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit;

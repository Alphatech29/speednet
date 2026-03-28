import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createPage } from "../../../components/backendApis/admin/apis/page";
import { NavLink } from "react-router-dom";
import { HiArrowLeft, HiPaperAirplane } from "react-icons/hi";

const CreatePage = () => {
  const [title, setTitle]     = useState("");
  const [slug, setSlug]       = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    const v = e.target.value;
    setTitle(v);
    setSlug(v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({});
    try {
      const res = await createPage({ title, slug, content });
      if (res?.success) {
        toast.success(res.message || "Page created successfully!");
        setTitle(""); setSlug(""); setContent("");
      } else {
        if (res?.errors) {
          setErrors(res.errors);
          Object.values(res.errors).forEach((msgs) => msgs.forEach((m) => toast.error(m)));
        } else toast.error(res?.message || "Failed to create page.");
      }
    } catch { toast.error("Something went wrong."); }
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all";

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <div className="flex items-center gap-3">
        <NavLink to="/admin/page"
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-all">
          <HiArrowLeft size={14} />
        </NavLink>
        <div>
          <p className="text-sm font-bold text-gray-800">Create New Page</p>
          <p className="text-xs text-gray-400 mt-0.5">Add a new static content page</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Title</label>
            <input type="text" value={title} onChange={handleTitleChange}
              placeholder="Enter page title" required
              className={`${inputCls} ${errors.title ? "border-red-400 bg-red-50" : ""}`} />
            {errors.title && <p className="text-[11px] text-red-500">{errors.title[0]}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Slug <span className="font-normal text-gray-400">(auto-generated)</span></label>
            <input type="text" value={slug} readOnly
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-default outline-none font-mono" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              rows={10} placeholder="Enter page content..." required
              className={`${inputCls} resize-y ${errors.content ? "border-red-400 bg-red-50" : ""}`} />
            {errors.content && <p className="text-[11px] text-red-500">{errors.content[0]}</p>}
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all">
              <HiPaperAirplane size={12} /> {loading ? "Creating..." : "Create Page"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;

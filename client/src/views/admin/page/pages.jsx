import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAllPages, deletePageById } from "../../../components/backendApis/admin/apis/page";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";

const Pages = () => {
  const [pages, setPages]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [deleting, setDeleting] = useState(null);

  const fetchPages = () => {
    getAllPages()
      .then((res) => { if (res?.success) setPages(res.data); else setError(res?.message); })
      .catch(() => setError("Failed to load pages."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPages(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete page "${title}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await deletePageById(id);
      if (res?.success) {
        setPages((prev) => prev.filter((p) => p.id !== id));
        toast.success(`Page "${title}" deleted.`);
      } else toast.error(res?.message || "Failed to delete page.");
    } catch { toast.error("An error occurred while deleting the page."); }
    setDeleting(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-800">Pages</p>
          <p className="text-xs text-gray-400 mt-0.5">Manage static content pages for your platform</p>
        </div>
        <NavLink to="/admin/page/create"
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all">
          <HiPlus size={13} /> Create Page
        </NavLink>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/5" />
            </div>
          ))}
        </div>
      ) : pages.length === 0 && !error ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <p className="text-sm text-gray-400">No pages found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pages.map((page) => (
            <div key={page.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-3 hover:shadow-md transition-all">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{page.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">/{page.slug}</span>
                  <span className="mx-2 text-gray-200">·</span>
                  {formatDateTime(page.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <NavLink to="/admin/page/edit" state={{ pageData: page }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary-600/10 hover:bg-primary-600/20 text-primary-600 text-xs font-bold rounded-lg transition-all">
                  <HiPencil size={11} /> Edit
                </NavLink>
                <button onClick={() => handleDelete(page.id, page.title)} disabled={deleting === page.id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all disabled:opacity-50">
                  <HiTrash size={11} /> {deleting === page.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pages;

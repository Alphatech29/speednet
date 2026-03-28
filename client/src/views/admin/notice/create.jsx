import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { createNotice } from "../../../components/backendApis/admin/apis/notice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeft, HiPaperAirplane, HiRefresh } from "react-icons/hi";

const Create = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", message: "", role: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((p) => ({ ...p, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.message || !form.role) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await createNotice(form);
      if (res?.success) {
        toast.success(res.message || "Notice created successfully");
        setTimeout(() => navigate("/admin/announcement"), 1500);
      } else toast.error(res?.message || "Failed to create notice");
    } catch { toast.error("An unexpected error occurred"); }
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all";

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <NavLink to="/admin/announcement"
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-all">
            <HiArrowLeft size={14} />
          </NavLink>
          <div>
            <p className="text-sm font-bold text-gray-800">Create Notice</p>
            <p className="text-xs text-gray-400 mt-0.5">Send an announcement to users or merchants</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-5">
        <div className="grid grid-cols-1 tab:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-semibold text-gray-500">Title</label>
            <input id="title" type="text" value={form.title} onChange={handleChange}
              placeholder="Enter notice title" className={inputCls} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-xs font-semibold text-gray-500">Target Role</label>
            <select id="role" value={form.role} onChange={handleChange} className={inputCls}>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 col-span-1 tab:col-span-2">
            <label htmlFor="message" className="text-xs font-semibold text-gray-500">Message</label>
            <textarea id="message" rows={5} value={form.message} onChange={handleChange}
              placeholder="Write your notice message here..."
              className={`${inputCls} resize-none`} />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button onClick={() => setForm({ title: "", message: "", role: "" })}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-all">
            <HiRefresh size={12} /> Clear
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all">
            <HiPaperAirplane size={12} /> {loading ? "Sending..." : "Send Notice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;

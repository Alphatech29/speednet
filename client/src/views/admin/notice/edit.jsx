import { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { updateNoticeById } from "../../../components/backendApis/admin/apis/notice";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeft, HiPencil, HiCheck, HiX } from "react-icons/hi";

const EditNotice = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const notice    = location.state;

  const [form, setForm]       = useState({ ...notice });
  const [initial]             = useState({ ...notice });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);

  if (!notice) return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-red-500">No notice data received.</p>
      <NavLink to="/admin/announcement" className="text-xs text-primary-600 underline">← Go back</NavLink>
    </div>
  );

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((p) => ({ ...p, [id]: value }));
  };

  const handleSave = async () => {
    if (!form.title || !form.message || !form.role) {
      toast.error("All fields are required"); return;
    }
    const changed = {};
    Object.keys(form).forEach((k) => { if (form[k] !== initial[k]) changed[k] = form[k]; });
    if (!Object.keys(changed).length) { toast.info("No changes to save"); return; }
    setSaving(true);
    try {
      const res = await updateNoticeById(notice.id, changed);
      if (res?.success) {
        toast.success(res.message || "Notice updated successfully");
        setEditing(false);
        setTimeout(() => navigate("/admin/announcement"), 1500);
      } else toast.error(res?.message || "Failed to update notice");
    } catch { toast.error("Unexpected error occurred"); }
    setSaving(false);
  };

  const inputCls = (ro) => `w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
    ro ? "bg-gray-50 border-gray-100 text-gray-500 cursor-default"
       : "bg-white border-gray-200 text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
  }`;

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
            <p className="text-sm font-bold text-gray-800">Edit Notice</p>
            <p className="text-xs text-gray-400 mt-0.5">Update the notice content and target role</p>
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
                <button onClick={() => { setForm({ ...initial }); setEditing(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-all">
                  <HiX size={12} /> Cancel
                </button>
              </>
          }
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-5">
        <div className="grid grid-cols-1 tab:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-semibold text-gray-500">Title</label>
            <input id="title" type="text" value={form.title || ""} onChange={handleChange}
              readOnly={!editing} placeholder="Notice title" className={inputCls(!editing)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-xs font-semibold text-gray-500">Target Role</label>
            <select id="role" value={form.role || ""} onChange={handleChange}
              disabled={!editing} className={inputCls(!editing)}>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 col-span-1 tab:col-span-2">
            <label htmlFor="message" className="text-xs font-semibold text-gray-500">Message</label>
            <textarea id="message" rows={5} value={form.message || ""} onChange={handleChange}
              readOnly={!editing} placeholder="Notice message..."
              className={`${inputCls(!editing)} resize-none`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNotice;

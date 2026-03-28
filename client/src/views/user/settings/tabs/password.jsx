import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { changePassword } from "../../../../components/backendApis/user/user";

const FloatingInput = ({ id, label, type, value, onChange, show, onToggle }) => (
  <div className="relative group">
    <input
      id={id}
      type={show ? "text" : type}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-2xl px-4 pt-6 pb-2.5 pr-11 text-sm focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all hover:border-gray-300 dark:hover:border-slate-600"
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-2 text-[11px] text-primary-600 font-semibold tracking-wide pointer-events-none transition-all
        peer-placeholder-shown:top-[1.05rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-slate-500 peer-placeholder-shown:font-normal
        peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary-600 peer-focus:font-semibold"
    >
      {label}
    </label>
    {onToggle && (
      <button type="button" onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-primary-600 transition-colors">
        {show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
      </button>
    )}
  </div>
);

const PasswordTab = () => {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = formData;
    if (!oldPassword || !newPassword || !confirmPassword) return toast.error("All fields are required.");
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");

    setLoading(true);
    try {
      const res = await changePassword({ oldPassword, newPassword });
      if (res?.success) {
        toast.success(res.message || "Password updated successfully");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.message || "Failed to change password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ToastContainer position="top-right" theme="light" />
      <FloatingInput id="oldPassword" label="Current Password" type="password"
        value={formData.oldPassword} onChange={(e) => setFormData((p) => ({ ...p, oldPassword: e.target.value }))}
        show={show.old} onToggle={() => setShow((s) => ({ ...s, old: !s.old }))} />
      <FloatingInput id="newPassword" label="New Password" type="password"
        value={formData.newPassword} onChange={(e) => setFormData((p) => ({ ...p, newPassword: e.target.value }))}
        show={show.new} onToggle={() => setShow((s) => ({ ...s, new: !s.new }))} />
      <FloatingInput id="confirmPassword" label="Confirm New Password" type="password"
        value={formData.confirmPassword} onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
        show={show.confirm} onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} />
      <button type="submit" disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm mt-2">
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default PasswordTab;

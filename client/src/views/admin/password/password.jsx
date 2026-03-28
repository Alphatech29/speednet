import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminUpdatePasswordApi } from "../../../components/backendApis/admin/auth";
import { useAdminAuth } from "../../../components/control/adminContext";
import { HiEye, HiEyeOff, HiLockClosed } from "react-icons/hi";

const Field = ({ id, label, value, onChange, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="relative">
        <input id={id} type={show ? "text" : "password"} value={value} onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`w-full px-4 py-2.5 pr-10 text-sm rounded-xl border transition-all outline-none ${
            error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
          }`}
        />
        <button type="button" onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <HiEyeOff size={15} /> : <HiEye size={15} />}
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
};

const Password = () => {
  const { adminToken } = useAdminAuth();
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
    setErrors((p) => ({ ...p, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmNewPassword } = formData;
    if (newPassword !== confirmNewPassword) {
      setErrors({ confirmNewPassword: "Passwords do not match." }); return;
    }
    if (!adminToken) { toast.error("Session expired. Please log in again."); return; }
    setLoading(true); setErrors({});
    try {
      const res = await adminUpdatePasswordApi({ oldPassword: formData.oldPassword, newPassword }, adminToken);
      if (res?.success) {
        toast.success("Password updated successfully.");
        setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        if (res?.errorFields) setErrors(res.errorFields);
        toast.error(res?.message || "Failed to update password.");
      }
    } catch { toast.error("An unexpected error occurred."); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <div>
        <p className="text-sm font-bold text-gray-800">Change Password</p>
        <p className="text-xs text-gray-400 mt-0.5">Update your admin account password</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 p-3 bg-primary-600/5 border border-primary-600/15 rounded-xl">
            <HiLockClosed size={14} className="text-primary-600 shrink-0" />
            <p className="text-xs text-gray-600">Use a strong password with at least 8 characters, including uppercase, numbers, and symbols.</p>
          </div>

          <Field id="oldPassword" label="Current Password" value={formData.oldPassword}
            onChange={handleChange} error={errors.oldPassword} />
          <Field id="newPassword" label="New Password" value={formData.newPassword}
            onChange={handleChange} error={errors.newPassword} />
          <Field id="confirmNewPassword" label="Confirm New Password" value={formData.confirmNewPassword}
            onChange={handleChange} error={errors.confirmNewPassword} />

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all mt-1">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Password;

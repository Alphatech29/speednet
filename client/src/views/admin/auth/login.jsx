import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiEye, HiEyeOff, HiShieldCheck, HiLockClosed, HiUser } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminLoginApi } from "../../../components/backendApis/admin/auth";
import { useAdminAuth } from "../../../components/control/adminContext";

const AdminLogin = () => {
  const { signInAdmin } = useAdminAuth();

  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [loading, setLoading]         = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await adminLoginApi({ username, password });
      if (response?.success && response?.token && response?.user) {
        signInAdmin({ token: response.token, user: response.user });
        if (rememberMe) {
          localStorage.setItem("adminToken", response.token);
          localStorage.setItem("admin", JSON.stringify(response.user));
        }
        toast.success(response.message || "Login successful");
      } else {
        toast.error(response?.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An unexpected error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center px-4 py-8">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-800/60 border border-white/8 rounded-3xl shadow-2xl overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-primary-600" />

        <div className="px-8 py-10 flex flex-col gap-7">

          {/* Logo + title */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center">
              <HiShieldCheck size={22} className="text-primary-500" />
            </div>
            <div className="text-center">
              <p className="text-base font-extrabold text-white tracking-tight">Admin Portal</p>
              <p className="text-xs text-slate-400 mt-0.5">Sign in to manage your platform</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Username</label>
              <div className="relative">
                <HiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-700/60 border border-white/10 text-white placeholder:text-slate-500 rounded-xl outline-none focus:border-primary-600/60 focus:ring-2 focus:ring-primary-600/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <div className="relative">
                <HiLockClosed size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-700/60 border border-white/10 text-white placeholder:text-slate-500 rounded-xl outline-none focus:border-primary-600/60 focus:ring-2 focus:ring-primary-600/10 transition-all"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                  {showPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 accent-primary-600 cursor-pointer" />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-1 shadow-lg shadow-primary-600/25">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : "Sign In"
              }
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-[10px] text-slate-600">
            &copy; {new Date().getFullYear()} SpeedNet. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

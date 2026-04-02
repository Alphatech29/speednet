import { useState } from "react";
import PageSeo from "../../components/utils/PageSeo";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdOutlineLockReset } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../../components/backendApis/auth/auth";

const FloatingInput = ({ id, type, value, onChange, label, required, children }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder=" "
      className="peer w-full bg-slate-800/60 border border-slate-600 text-white rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/50 transition-all duration-200"
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-2 text-[11px] text-primary-600 font-medium transition-all
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:font-normal
        peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary-600 peer-focus:font-medium"
    >
      {label}
    </label>
    {children}
  </div>
);

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    const result = await resetPassword(password, token);
    if (result.success) {
      toast.success(result.message || "Password reset successfully!");
      setDone(true);
      setTimeout(() => navigate("/auth/login"), 2500);
    } else {
      toast.error(result.message || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center px-5 py-10 relative overflow-hidden">
      <PageSeo
        title="Reset Password"
        description="Create a new password for your Speednet account."
        keywords="reset password, new password, speednet"
        path="/auth/reset-password"
      />
      <ToastContainer position="top-right" theme="dark" />

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-600/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/">
            <img src="/image/user-logo.png" alt="Logo" className="h-11 w-auto object-contain" />
          </a>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl px-7 py-9 shadow-2xl backdrop-blur-sm">
          {done ? (
            /* Success state */
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-600/15 border border-primary-600/30 flex items-center justify-center">
                <MdOutlineLockReset className="text-primary-600 text-3xl" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white mb-2">Password Updated!</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your password has been reset successfully. Redirecting you to the login page…
                </p>
              </div>
              <NavLink to="/auth/login">
                <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors mt-1">
                  <FaArrowLeft size={12} />
                  Go to Sign In
                </button>
              </NavLink>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-white">Reset password</h2>
                <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                  Enter your new password below. Make it strong and memorable.
                </p>
              </div>

              <form onSubmit={handleReset} className="flex flex-col gap-5">
                {/* New Password */}
                <FloatingInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="New Password"
                  required
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </FloatingInput>

                {/* Confirm Password */}
                <FloatingInput
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Confirm New Password"
                  required
                >
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirm ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </FloatingInput>

                {/* Password hint */}
                <p className="text-xs text-slate-500 -mt-1">Minimum 6 characters.</p>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-900/40"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <FaArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <NavLink
                  to="/auth/login"
                  className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-primary-600 transition-colors font-medium"
                >
                  <FaArrowLeft size={12} />
                  Back to Sign In
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

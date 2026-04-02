import { useState } from "react";
import PageSeo from "../../components/utils/PageSeo";
import { NavLink } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { forgotPassword } from "../../components/backendApis/auth/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) {
      setSent(true);
      toast.success(result.message || "Reset link sent successfully!");
    } else {
      toast.error(result.message || "Failed to send reset link.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center px-5 py-10 relative overflow-hidden">
      <PageSeo
        title="Forgot Password"
        description="Reset your Speednet account password. Enter your email and we'll send you a recovery link."
        keywords="forgot password, reset password, account recovery"
        path="/auth/forgot-password"
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
          {sent ? (
            /* Success State */
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-600/15 border border-primary-600/30 flex items-center justify-center">
                <MdOutlineMarkEmailRead className="text-primary-600 text-3xl" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white mb-2">Check your inbox</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We've sent a password reset link to{" "}
                  <span className="text-primary-600 font-medium">{email}</span>.
                  Please check your email and follow the instructions.
                </p>
              </div>
              <NavLink to="/auth/login" className="mt-2">
                <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  <FaArrowLeft size={12} />
                  Back to Sign In
                </button>
              </NavLink>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-white">Forgot password?</h2>
                <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                  No worries. Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email */}
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder=" "
                    className="peer w-full bg-slate-800/60 border border-slate-600 text-white rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/50 transition-all duration-200"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 top-2 text-[11px] text-primary-600 font-medium transition-all
                      peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:font-normal
                      peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary-600 peer-focus:font-medium"
                  >
                    Email Address
                  </label>
                </div>

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
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
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

export default ForgetPassword;

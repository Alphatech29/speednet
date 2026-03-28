import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff, HiShieldCheck } from "react-icons/hi";
import { FaArrowRight, FaLock, FaShieldAlt, FaBolt } from "react-icons/fa";
import { MdOutlineVerified, MdStorefront } from "react-icons/md";
import { RiShieldCheckLine } from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../components/backendApis/auth/auth";
import { AuthContext } from "../../components/control/authContext";

const FloatingInput = ({ id, type = "text", value, onChange, label, required, autoComplete, children }) => (
  <div className="relative group">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete={autoComplete}
      placeholder=" "
      className="peer w-full bg-slate-800/70 border border-slate-700 text-white rounded-2xl px-4 pt-6 pb-2.5 text-sm focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all duration-200 hover:border-slate-600"
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-2 text-[11px] text-primary-500 font-semibold tracking-wide transition-all
        peer-placeholder-shown:top-[1.05rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:font-normal
        peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary-500 peer-focus:font-semibold pointer-events-none"
    >
      {label}
    </label>
    {children}
  </div>
);

const trustPoints = [
  { icon: <MdOutlineVerified size={16} className="text-primary-600" />, text: "Verified sellers & buyers" },
  { icon: <FaShieldAlt size={14} className="text-primary-600" />, text: "Escrow-protected every trade" },
  { icon: <FaBolt size={13} className="text-primary-600" />, text: "Instant digital delivery" },
  { icon: <BiTransfer size={16} className="text-primary-600" />, text: "Multi-currency payments" },
  { icon: <MdStorefront size={16} className="text-primary-600" />, text: "10,000+ active listings" },
];

const Login = () => {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true";
    if (remembered) {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await login({ email, password });
      if (response.success) {
        toast.success(response.message || "Login successful!");
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }
        await signIn();
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch {
      toast.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950">
      <ToastContainer position="top-right" theme="dark" />

      {/* ── Left Panel ── */}
      <div className="hidden pc:flex w-[52%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: "linear-gradient(135deg, #1c0a03 0%, #2d1106 40%, #0f172a 100%)" }}>
        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-600/8 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #E46300 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Logo */}
        <div className="relative z-10">
          <a href="/">
            <img src="/image/user-logo.png" alt="Speednet" className="h-11 w-auto object-contain" />
          </a>
        </div>

        {/* Main content */}
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-primary-600/15 text-primary-500 text-[11px] font-bold px-3 py-1.5 rounded-full mb-6 border border-primary-600/25">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
            Africa's #1 Digital Marketplace
          </span>

          <h1 className="text-[2.6rem] font-extrabold text-white leading-[1.12] mb-5">
            Connect. Trade.{" "}
            <span className="text-primary-600">Elevate</span>{" "}
            Your Digital Journey.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-10">
            Access verified accounts, instant airtime, VPN, virtual numbers, and secure P2P trading — all from one powerful platform.
          </p>

          {/* Trust points */}
          <div className="flex flex-col gap-3.5">
            {trustPoints.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-primary-600/15 border border-primary-600/20 flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>

          {/* Stat chips */}
          <div className="flex gap-3 mt-10 flex-wrap">
            {[{ v: "70K+", l: "Users" }, { v: "10M+", l: "Trades" }, { v: "99.9%", l: "Uptime" }].map(({ v, l }) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center">
                <p className="text-lg font-extrabold text-primary-600">{v}</p>
                <p className="text-[10px] text-slate-500">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Speednet. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="w-full pc:w-[48%] flex items-center justify-center px-5 tab:px-12 py-12 bg-slate-950">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile logo */}
          <div className="pc:hidden mb-10 flex justify-center">
            <a href="/">
              <img src="/image/user-logo.png" alt="Speednet" className="h-10 w-auto object-contain" />
            </a>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary-600/15 border border-primary-600/25 flex items-center justify-center">
                <FaLock size={13} className="text-primary-600" />
              </div>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Secure Login</span>
            </div>
            <h2 className="text-3xl tab:text-4xl font-extrabold text-white leading-tight">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-2">Sign in to your Speednet account to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <FloatingInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              required
              autoComplete="email"
            />

            <FloatingInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              required
              autoComplete="current-password"
            >
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
              >
                {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </FloatingInput>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${rememberMe ? "bg-primary-600 border-primary-600" : "border-slate-600 bg-transparent"}`}
                  onClick={() => setRememberMe(p => !p)}>
                  {rememberMe && <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Remember me</span>
              </label>
              <NavLink to="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-500 font-semibold transition-colors">
                Forgot password?
              </NavLink>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 hover:-translate-y-0.5 mt-2 text-sm overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>Sign In <FaArrowRight size={13} /></>
              )}
            </button>
          </form>

          {/* SSL badge */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <RiShieldCheckLine size={14} className="text-slate-600" />
            <span className="text-xs text-slate-600">256-bit SSL encrypted. Your data is safe.</span>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600 font-medium">New to Speednet?</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Register */}
          <NavLink to="/auth/register">
            <button className="w-full border border-slate-700 hover:border-primary-600/50 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 group">
              Create a Free Account
              <FaArrowRight size={11} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
            </button>
          </NavLink>

          {/* Terms note */}
          <p className="text-center text-[11px] text-slate-600 mt-5 leading-relaxed">
            By signing in, you agree to our{" "}
            <NavLink to="/page/terms-of-use" className="text-slate-500 hover:text-primary-600 underline underline-offset-2 transition-colors">Terms of Service</NavLink>
            {" "}and{" "}
            <NavLink to="/page/privacy-policy" className="text-slate-500 hover:text-primary-600 underline underline-offset-2 transition-colors">Privacy Policy</NavLink>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

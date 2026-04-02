import { useState, useEffect } from "react";
import PageSeo from "../../components/utils/PageSeo";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "../../components/backendApis/auth/auth";
import { NavLink, useLocation } from "react-router-dom";

const FloatingInput = ({ id, type = "text", value, onChange, label, required, children }) => (
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

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone_number, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const referralCode = new URLSearchParams(location.search).get("ref");

  useEffect(() => {
    setCountries([
      "Nigeria", "Cameroon", "Ghana", "South Africa",
      "Kenya", "Rwanda", "United Kingdom", "United States", "Canada",
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await register({
        full_name: fullname,
        username,
        email,
        phone_number,
        password,
        country,
        referral_code: referralCode || "",
      });

      if (response?.success) {
        toast.success("Registration successful!");
        setFullname(""); setUsername(""); setEmail(""); setPhone("");
        setPassword(""); setConfirmPassword(""); setAgree(false); setCountry("");
      } else {
        if (response?.error?.errors?.length) {
          response.error.errors.forEach((err) => toast.error(err));
        } else {
          toast.error(response?.message || "An unknown error occurred.");
        }
      }
    } catch (error) {
      const data = error.response?.data;
      if (data?.error?.errors?.length) {
        data.error.errors.forEach((err) => toast.error(err));
      } else {
        toast.error(data?.message || "Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-900">
      <PageSeo
        title="Create Account"
        description="Join Speednet for free — buy and sell digital accounts, top-up airtime, get VPN access, and trade securely."
        keywords="register, sign up, create account, join speednet"
        path="/auth/register"
      />
      <ToastContainer position="top-right" theme="dark" />

      {/* Left Panel — brand */}
      <div className="hidden pc:flex w-5/12 relative overflow-hidden bg-gradient-to-br from-secondary via-primary-100 to-slate-900 flex-col justify-between p-12 flex-shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <a href="/">
            <img src="/image/user-logo.png" alt="Logo" className="h-12 w-auto object-contain" />
          </a>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Join{" "}
            <span className="text-primary-600">70,000+</span>{" "}
            users on Speednet
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed mb-8">
            Buy and sell verified digital accounts, access virtual numbers, VPNs, airtime and
            more — all in one secure platform.
          </p>
          <div className="flex flex-col gap-3">
            {[
              "Free to sign up, no hidden fees",
              "Escrow-protected transactions",
              "Instant delivery on digital goods",
              "24/7 customer support",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-primary-600/20 border border-primary-600/40 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Speednet. All rights reserved.
        </p>
      </div>

      {/* Right Panel — form */}
      <div className="w-full pc:flex-1 flex items-start justify-center px-5 tab:px-10 py-10 overflow-y-auto">
        <div className="w-full max-w-lg py-4">
          {/* Mobile logo */}
          <div className="pc:hidden mb-8 flex justify-center">
            <a href="/">
              <img src="/image/user-logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            </a>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl tab:text-3xl font-extrabold text-white">Create account</h2>
            <p className="text-slate-400 text-sm mt-1">Join Speednet and start your journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name + Username */}
            <div className="grid grid-cols-1 tab:grid-cols-2 gap-4">
              <FloatingInput
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                label="Full Name"
                required
              />
              <FloatingInput
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label="Username"
                required
              />
            </div>

            {/* Email */}
            <FloatingInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              required
            />

            {/* Phone + Country */}
            <div className="grid grid-cols-1 tab:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-primary-600 font-medium mb-1.5 ml-1">Phone Number</p>
                <PhoneInput
                  country="ng"
                  value={phone_number}
                  onChange={(value) => setPhone(value)}
                  enableSearch
                  onlyCountries={["ng", "cm", "gh", "za", "ke", "rw", "gb", "us", "ca"]}
                  containerClass="w-full"
                  inputClass="!text-sm !w-full !py-5 !border !border-slate-600 !bg-slate-800 !bg-opacity-60 !text-white !rounded-xl !pl-12"
                  buttonClass="!bg-slate-800 !border-slate-600 !rounded-l-xl !border-r-0"
                  dropdownClass="!bg-slate-800 !text-white"
                />
              </div>
              <div className="relative">
                <p className="text-[11px] text-primary-600 font-medium mb-1.5 ml-1">Country</p>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full bg-slate-800/60 border border-slate-600 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/50 transition-all duration-200 appearance-none"
                >
                  <option value="" disabled>Select country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <FloatingInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
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
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm Password"
              required
            >
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </FloatingInput>

            {/* Agreement */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-primary-600 rounded cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-slate-300 leading-relaxed">
                I agree to Speednet's{" "}
                <NavLink to="/page/privacy-policy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </NavLink>{" "}
                and{" "}
                <NavLink to="/page/terms-of-use" className="text-primary-600 hover:underline">
                  Terms of Use
                </NavLink>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agree || loading}
              className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-900/40 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">Already have an account?</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <NavLink to="/auth/login">
            <button className="w-full border border-slate-600 hover:border-primary-600 text-slate-300 hover:text-primary-600 font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm">
              Sign In Instead
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;

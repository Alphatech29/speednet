import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "../../components/backendApis/auth/auth";
import { NavLink, useLocation } from "react-router-dom";

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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get("ref");

  // ✅ Hardcoded country list (no external fetch)
  useEffect(() => {
    const allowedCountries = [
      "Nigeria",
      "Cameroon",
      "Ghana",
      "South Africa",
      "Kenya",
      "Rwanda",
      "United Kingdom",
      "United States",
      "Canada"
    ];
    setCountries(allowedCountries);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const formData = {
        full_name: fullname,
        username,
        email,
        phone_number,
        password,
        country,
        referral_code: referralCode || "",
      };

      const response = await register(formData);

      if (response?.success) {
        toast.success("Registration successful!");
        setFullname("");
        setUsername("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setAgree(false);
        setCountry("");
      } else {
        if (response?.error?.errors?.length) {
          response.error.errors.forEach((err) => toast.error(err));
        } else if (response?.message) {
          toast.error(response.message);
        } else {
          toast.error("An unknown error occurred.");
        }
      }
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData?.error?.errors?.length) {
          errorData.error.errors.forEach((err) => toast.error(err));
        } else if (errorData?.message) {
          toast.error(errorData.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col pc:flex-row bg-slate-700 px-4 tab:px-10 pc:px-20 py-8 gap-10">
      <ToastContainer position="top-right" className="text-sm" />

      {/* Left panel */}
      <div className="hidden tab:flex w-full pc:w-1/2 bg-slate-500/50 px-6 py-8 rounded-xl flex-col justify-between">
        <div className="text-pay self-end">
          <h1 className="text-2xl tab:text-3xl pc:text-4xl font-bold mb-3 leading-snug">
            Connect. Trade. Elevate Your Influence.
          </h1>
          <p className="text-sm tab:text-base text-white">
            Empower your social journey by exploring and trading social media accounts on a platform built on integrity and ethical engagement.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full pc:w-1/2 px-2 tab:px-4 pc:px-10 flex items-center justify-center">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl tab:text-3xl pc:text-4xl font-bold text-pay">Welcome to Speednet</h1>
            <p className="text-slate-300 text-sm tab:text-base">Sign up and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6 text-pay">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white text-base rounded-md p-3 peer"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Full Name
              </label>
            </div>

            {/* Username */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white text-base rounded-md p-3 peer"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Username
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white text-base rounded-md p-3 peer"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Email Address
              </label>
            </div>

            {/* Phone and Country */}
            <div className="flex flex-col tab:flex-row gap-4">
              <PhoneInput
                country={"ng"}
                value={phone_number}
                onChange={(value) => setPhone(value)}
                enableSearch={true}
                onlyCountries={["ng", "cm", "gh", "za", "ke", "rw", "gb", "us", "ca"]}
                containerClass="w-full"
                inputClass="!text-base !w-full !py-5 !border !border-gray-500 !bg-gray-800 !text-white !rounded-md"
                buttonClass="!bg-gray-800 !border-gray-500 !rounded-l-md"
                dropdownClass="!bg-gray-800 !text-white"
              />

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white text-base rounded-md p-3"
              >
                <option value="" disabled>
                  Select your country
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white text-base rounded-md p-3 peer pr-10"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white text-base rounded-md p-3 peer pr-10"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            {/* Agreement */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-500 rounded focus:ring-0 cursor-pointer"
              />
              <label htmlFor="agree" className="ml-2 text-gray-300 text-sm cursor-pointer">
                I agree to Speednet's{" "}
                <span className="text-primary-600">Privacy Policy</span> and{" "}
                <span className="text-primary-600">Terms of Use</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="bg-primary-600 border-none shadow-md py-1 text-pay"
              disabled={!agree}
            >
              Sign Up
            </Button>
          </form>

          <div className="flex justify-center text-gray-300 mt-4">
            <span>
              Already have an account?{" "}
              <NavLink to="/auth/login" className="text-primary-600">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

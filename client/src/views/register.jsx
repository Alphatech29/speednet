import React, { useState } from "react";
import { Button, Checkbox } from "flowbite-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "./../components/backendApis/auth/auth";
import { NavLink } from "react-router-dom";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone_number, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = {
        full_name: fullname,
        email,
        phone_number,
        password,
      };
  
      const response = await register(formData);
  
      console.log("API Response:", response); // Debugging response
  
      if (response?.success) {
        toast.success("Registration successful!");
  
        // Reset form fields
        setFullname("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setAgree(false);
      } else {
        console.log("Error response:", response); // Debugging error response
  
        if (response?.error?.errors && Array.isArray(response.error.errors)) {
          response.error.errors.forEach((err) => toast.error(err));
        } else if (response?.message) {
          toast.error(response.message);
        } else {
          toast.error("An unknown error occurred.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
  
      if (error.response) {
        const errorData = error.response.data;
        console.log("Axios Error Response:", errorData);
  
        if (errorData?.error?.errors && Array.isArray(errorData.error.errors)) {
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
    <div className="h-screen w-full flex justify-between items-center bg-slate-700 px-20 py-5">
      <ToastContainer position="top-right" className="text-sm" />
      <div className="w-1/2 bg-slate-500/50 h-full px-10 flex flex-col justify-between py-8 rounded-xl">
        <div className="text-pay">
          <h1 className="text-4xl font-bold w-1/2">Connect. Trade. Elevate Your Influence.</h1>
          <p>Empower your social journey by exploring and trading social media accounts on a platform built on integrity and ethical engagement. Your next digital adventure begins here.</p>
        </div>
      </div>

      <div className="w-1/2 px-10 flex justify-center items-center">
        <div className="w-full flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-pay">Welcome to Speednet 👋🏾</h1>
            <p className="text-slate-300 text-base">Sign up and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6 text-pay">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 peer"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Full Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 peer"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Email Address
              </label>
            </div>

            {/* Phone Number */}
            <PhoneInput
              country={"us"}
              value={phone_number} // Corrected phone_number state
              onChange={(value) => setPhone(value)}
              enableSearch={true}
              containerClass="w-full"
              inputClass="!w-[93%] !ml-9 !py-5 !border !border-gray-500 !bg-gray-800 !text-white !rounded-md !p-3"
              buttonClass="!bg-gray-800 !border-gray-500 !rounded-l-md"
              dropdownClass="!bg-gray-800 !text-white"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 peer pr-10"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                className="w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 peer pr-10"
                placeholder=" "
              />
              <label className="absolute left-3 top-0 text-xs text-primary-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600">
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-500 rounded focus:ring-0 cursor-pointer"
              />

              <label htmlFor="agree" className="ml-2 text-gray-300 text-sm cursor-pointer">
                I agree to Speednet's <span className="text-primary-600">Privacy Policy</span> and <span className="text-primary-600">Terms of Use</span>
              </label>
            </div>



            <Button type="submit" className="bg-primary-600 border-none shadow-md py-1 text-pay">
              Sign Up
            </Button>
          </form>
          <div className="flex justify-center text-gray-300"><span >Already have an account? <NavLink to="/login" className="text-primary-600">Login</NavLink></span></div>
        </div>
      </div>
    </div>
  );
};

export default Register;

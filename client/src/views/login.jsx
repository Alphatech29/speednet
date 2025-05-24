import React, { useState, useContext } from 'react';
import { Button, Label, Spinner } from "flowbite-react";
import { NavLink } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "./../components/backendApis/auth/auth";
import { AuthContext } from "../components/control/authContext";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields", { position: "top-right" });
      return;
    }

    setLoading(true);

    try {
      const response = await login({ email, password });

      if (response?.success && response?.data?.token && response?.data?.user) {
        toast.success(response.message || "Login successful!", { position: "top-right" });

        if (!signIn || typeof signIn !== "function") {
          console.error("Error: signIn function is not available in AuthContext.");
          toast.error("Internal error. Please try again later.");
          setLoading(false);
          return;
        }

        // Store user data in AuthContext
        signIn({ token: response.data.token, user: response.data.user });

        // Persist in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("storedUser", JSON.stringify(response.data.user));
      } else {
        console.error("Invalid API response:", response);
        toast.error(response?.message || "Invalid server response", { position: "top-right" });
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An unexpected error occurred", { position: "top-right" });
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex flex-wrap sm:flex-nowrap justify-between items-center bg-slate-700 px-4 sm:px-20 py-5">
      <ToastContainer />

      {/* Left panel: hidden on mobile, visible at ≥640px */}
      <div className="pc:flex mobile:hidden w-1/2 bg-slate-500/50 h-full px-10 flex-col justify-between py-8 rounded-xl">
        <div>
          <img src="/image/user-logo.png" alt="Logo" className="h-14 mobile:hidden pc:flex" />
        </div>
        <div className="text-pay">
          <h1 className="text-4xl font-bold w-1/2">Connect. Trade. Elevate Your Influence.</h1>
          <p>Empower your social journey by exploring and trading social media accounts...</p>
        </div>
      </div>

      {/* Right panel: full width on mobile, half on sm+ */}
      <div className="pc:w-1/2 mobile:w-full px-10 flex flex-col justify-center items-center">
      <div className='mb-16'>
         <a href="/">
          <img src="/image/user-logo.png" alt="Logo" className="h-14 pc:hidden mobile:flex" />
        </a>
      </div>
        <div className="w-full flex flex-col gap-6">
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-pay">Welcome Back!</h1>
            <p className="text-slate-300 text-base">Sign in to your account and continue</p>
          </div>

          <form className="flex w-full flex-col gap-6 text-pay" onSubmit={handleLogin}>
            <div className="relative w-full">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 focus:border-primary-600 focus:ring-primary-600"
              />
              <Label
                htmlFor="email"
                className={`absolute left-3 transition-all ${
                  email ? "top-1 text-sm text-primary-600" : "top-3 text-base text-gray-400"
                }`}
              >
                Email Address
              </Label>
            </div>

            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 focus:border-primary-600 focus:ring-primary-600"
              />
              <Label
                htmlFor="password"
                className={`absolute left-3 transition-all ${
                  password ? "top-1 text-sm text-primary-600" : "top-3 text-base text-gray-400"
                }`}
              >
                Password
              </Label>
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-500 rounded focus:ring-0 cursor-pointer"
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <NavLink to="/auth/forgot-password" className="text-primary-600 hover:underline text-sm">
                Forgot Password?
              </NavLink>
            </div>

            <Button
              type="submit"
              className="bg-primary-600 border-none shadow-md py-2 text-pay flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don’t have an account?
                <NavLink to="/auth/register" className="text-primary-600 font-semibold hover:underline ml-1">
                  Register
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

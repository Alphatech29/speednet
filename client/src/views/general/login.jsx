import React, { useState, useEffect, useContext } from "react";
import { Button, Label, Spinner } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { login } from "../../components/backendApis/auth/auth";
import { AuthContext } from "../../components/control/authContext";

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
      toast.error("Please fill in all fields", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email, password });

      if (response.success) {
        toast.success(response.message || "Login successful!", {
          position: "top-right",
        });

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
        toast.error(response.message || "Login failed", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Unexpected error occurred", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100%] w-full flex mobile:flex-col tab:flex-row pc:justify-between tab:justify-between items-center bg-slate-700 px-4 pc:px-20 pc:py-5 tab:py-5">
      <ToastContainer />

      {/* Left Panel */}
      <div className="hidden pc:flex w-1/2 bg-slate-500/50 h-[600px] px-10 flex-col justify-between py-8 rounded-xl">
        <div><img src="/image/user-logo.png" alt="Logo" className="h-14 " /></div>
        <div className="text-pay">
          <h1 className="text-4xl font-bold leading-tight mb-2 w-3/4">
            Connect. Trade. Elevate Your Influence.
          </h1>
          <p>
            Empower your social journey by exploring and trading social media accounts...
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full pc:w-1/2 px-4 pc:px-10 flex flex-col justify-center items-center pc:border-none tab:border-0 mobile:border-[1px] mobile:border-gray-500 mobile:p-3 rounded-md mobile:mt-[120px]">
        <div className="mb-10 pc:hidden">
          <a href="/">
            <img src="/image/user-logo.png" alt="Logo" className="h-14 mobile:flex" />
          </a>
        </div>

        <div className="w-full max-w-md flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-pay">Welcome Back!</h1>
            <p className="text-slate-300 text-sm">Sign in to your account and continue</p>
          </div>

          <form className="flex w-full flex-col gap-6 text-pay" onSubmit={handleLogin}>
            {/* Email */}
            <div className="relative w-full">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer text-base w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 focus:border-primary-600 focus:ring-primary-600"
              />
              <Label
                htmlFor="email"
                className={`absolute left-3 transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary-600 ${
                  email ? "top-1 text-sm text-primary-600" : "top-3 text-sm text-gray-400"
                }`}
              >
                Email Address
              </Label>
            </div>

            {/* Password */}
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer text-base w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 focus:border-primary-600 focus:ring-primary-600"
              />
              <Label
                htmlFor="password"
                className={`absolute left-3 transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary-600 ${
                  password ? "top-1 text-sm text-primary-600" : "top-3 text-sm text-gray-400"
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

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-500 rounded focus:ring-0 cursor-pointer"
                />
                <Label className="text-white" htmlFor="remember">Remember me</Label>
              </div>
              <NavLink to="/auth/forgot-password" className="text-primary-600 hover:underline">
                Forgot Password?
              </NavLink>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="bg-primary-600 border-none shadow-md text-pay flex items-center justify-center"
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

            {/* Register */}
            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don’t have an account?
                <NavLink
                  to="/auth/register"
                  className="text-primary-600 font-semibold hover:underline ml-1"
                >
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

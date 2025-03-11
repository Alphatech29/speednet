import React, { useState, useContext } from 'react';
import { Button, Label } from "flowbite-react";
import { NavLink } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "./../components/backendApis/auth/auth";
import { AuthContext } from "../components/control/authContext";

const Login = () => {
  const { loginUser } = useContext(AuthContext); // Use AuthContext
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

      if (response.success) {
        toast.success(response.message, { position: "top-right" });

        // Store user data in AuthContext
        loginUser(response.data.user, response.data.token);

        // Redirect user
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 3000);
      } else {
        toast.error(response.message, { position: "top-right" });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { position: "top-right" });
    }

    setLoading(false);
  };

  return (
    <div className='h-screen w-full flex justify-between items-center bg-slate-700 px-20 py-5'>
      <ToastContainer />
      <div className='w-1/2 bg-slate-500/50 h-full px-10 flex flex-col justify-between py-8 rounded-xl '>
        <div>
          <img src="" alt="" />
        </div>
        <div className='text-pay'>
          <h1 className='text-4xl font-bold w-1/2'>Connect. Trade. Elevate Your Influence.</h1>
          <p>Empower your social journey by exploring and trading social media accounts...</p>
        </div>
      </div>

      <div className='w-1/2 px-10 flex justify-center items-center'>
        <div className='w-full flex flex-col gap-6'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-pay'>Welcome Back!</h1>
            <p className='text-slate-300 text-base'>Sign in to your account and continue</p>
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
              <Label htmlFor="email" className={`absolute left-3 transition-all ${email ? "top-1 text-sm text-primary-600" : "top-3 text-base text-gray-400"}`}>
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
              <Label htmlFor="password" className={`absolute left-3 transition-all ${password ? "top-1 text-sm text-primary-600" : "top-3 text-base text-gray-400"}`}>
                Password
              </Label>
              <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-500 rounded focus:ring-0 cursor-pointer"
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="/forgot-password" className="text-primary-600 hover:underline text-sm">
                Forgot Password?
              </a>
            </div>

            <Button type="submit" className='bg-primary-600 border-none shadow-md py-1 text-pay' disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don’t have an account?
                <NavLink to="/register" className="text-primary-600 font-semibold hover:underline ml-1">Register</NavLink>  
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

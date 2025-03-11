import React, { useState } from 'react';
import { Button, Checkbox, Label } from "flowbite-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className='h-screen w-full flex justify-between items-center bg-slate-700 px-20 py-5'>
      {/* Left Side */}
      <div className='w-1/2 bg-slate-500/50 h-full px-10 flex flex-col justify-between py-8 rounded-xl '>
        <div>
          <img src="" alt="" />
        </div>
        <div className='text-pay'>
          <h1 className='text-4xl font-bold w-1/2'>Connect. Trade. Elevate Your Influence.</h1>
          <p>Empower your social journey by exploring and trading social media accounts on a platform built on integrity and ethical engagement. Your next digital adventure begins here.</p>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className='w-1/2 px-10 flex justify-center items-center'>
        <div className='w-full flex flex-col gap-6'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-pay'>Welcome Back!</h1>
            <p className='text-slate-300 text-base'>Sign in to your account and continue</p>
          </div>

          <form className="flex w-full flex-col gap-6 text-pay">
            {/* ✅ Floating Email Field */}
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

            {/* ✅ Floating Password Field */}
            <div className="relative w-full">
              <input
                id="password"
                type="password"
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
            </div>

            {/* ✅ Remember Me & Forgot Password */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="/forgot-password" className="text-primary-600 hover:underline text-sm">
                Forgot Password?
              </a>
            </div>

            {/* ✅ Login Button */}
            <Button type="submit" className='bg-primary-600 border-none shadow-md py-1 text-pay'>
              Login
            </Button>

            {/* ✅ Don’t have an account? Sign up */}
            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don’t have an account?  
                <a href="/register" className="text-primary-600 font-semibold hover:underline ml-1">
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

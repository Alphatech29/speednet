import React, { useState } from 'react';
import { Button, Label, Spinner } from 'flowbite-react';
import { NavLink } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../cssFile/login.css';

import { adminLoginApi } from '../../../components/backendApis/admin/auth';
import { useAdminAuth } from '../../../components/control/adminContext'; 

const AdminLogin = () => {
  const { signInAdmin } = useAdminAuth(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields', { position: 'top-right' });
      return;
    }

    setLoading(true);

    try {
      const response = await adminLoginApi({ username, password });

      if (response?.success && response?.token && response?.user) {
        const admin = response.user;

        // Store in context
        signInAdmin({
          token: response.token,
          user: admin,
        });

        if (rememberMe) {
          localStorage.setItem('adminToken', response.token);
          localStorage.setItem('admin', JSON.stringify(admin));
        }

        toast.success(response.message || 'Login successful', { position: 'top-right' });

      } else {
        toast.error(response.message || 'Login failed', { position: 'top-right' });
      }
    } catch (error) {
      console.error(' API Call Error:', error);

      const apiMessage = error?.response?.data?.message;
      toast.error(apiMessage || 'An unexpected error occurred', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wrapper px-4 sm:px-20 py-5">
      <ToastContainer />
      <div className="pc:w-[400px] mobile:w-full px-10 flex flex-col justify-center items-center pc:border pc:border-dashed rounded-md p-3">
        <div className="mb-16">
          <a href="/">
            <img src="/image/user-logo.png" alt="Logo" className="h-14 flex" />
          </a>
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-pay">Welcome Back!</h1>
            <p className="text-slate-300 text-sm">Sign in to your account and continue</p>
          </div>

          <form className="flex w-full flex-col gap-6 text-pay" onSubmit={handleLogin}>
            <div className="relative w-full">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="peer w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 focus:border-primary-600 focus:ring-primary-600"
              />
              <Label
                htmlFor="username"
                className={`absolute left-3 transition-all ${
                  username ? 'top-1 text-sm text-primary-600' : 'top-3 text-base text-gray-400'
                }`}
              >
                Username
              </Label>
            </div>

            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 focus:border-primary-600 focus:ring-primary-600"
              />
              <Label
                htmlFor="password"
                className={`absolute left-3 transition-all ${
                  password ? 'top-1 text-sm text-primary-600' : 'top-3 text-base text-gray-400'
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
             
            </div>

            <Button
              type="submit"
              className="bg-primary-600 border-none shadow-md py-1 text-pay flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" /> Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

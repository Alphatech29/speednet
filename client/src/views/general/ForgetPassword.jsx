import React, { useState } from "react";
import { Button, Label } from "flowbite-react";
import { forgotPassword } from "../../components/backendApis/auth/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      toast.success(result.message || "Reset link sent successfully!");
      setEmail("");
    } else {
      toast.error(result.message || "Failed to send reset link.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-700 flex justify-center items-center px-4 py-10 pc:px-20">
      <div className="w-full max-w-xl bg-slate-800 border border-gray-600 rounded-lg px-6 py-10 shadow-lg">
        {/* Toast Container */}
        <ToastContainer position="top-right" />

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <a href="/">
            <img src="/image/user-logo.png" alt="Logo" className="h-14" />
          </a>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl pc:text-3xl font-bold text-pay">Forgot Password?</h1>
          <p className="text-slate-300 text-sm pc:text-base mt-1">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-pay">
          {/* Email Field */}
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
              className="absolute left-3 transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary-600 top-3 text-sm text-gray-400"
            >
              Email Address
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary-600 border-none shadow-md text-pay flex items-center justify-center"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Remembered your password?
              <a
                href="/auth/login"
                className="text-primary-600 font-semibold hover:underline ml-1"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;

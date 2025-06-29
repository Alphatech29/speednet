import React, { useState } from "react";
import { Button, Label } from "flowbite-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../../components/backendApis/auth/auth";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = await resetPassword(password, token);

    if (result.success) {
      toast.success(result.message || "Password reset successfully!");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/auth/login"), 2500);
    } else {
      toast.error(result.message || "Failed to reset password.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-700 flex justify-center items-center px-4 py-10 pc:px-20">
      <div className="w-full max-w-xl bg-slate-800 border border-gray-600 rounded-lg px-6 py-10 shadow-lg">
        <ToastContainer position="top-right" />

        <div className="mb-8 flex justify-center">
          <a href="/">
            <img src="/image/user-logo.png" alt="Logo" className="h-14" />
          </a>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl pc:text-3xl font-bold text-pay">Reset Password</h1>
          <p className="text-slate-300 text-sm pc:text-base mt-1">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleReset} className="flex flex-col gap-6 text-pay">
          <div className="relative w-full">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer text-base w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 focus:border-primary-600 focus:ring-primary-600"
            />
            <Label
              htmlFor="password"
              className="absolute left-3 transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary-600 top-3 text-sm text-gray-400"
            >
              New Password
            </Label>
          </div>

          <div className="relative w-full">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer text-base w-full border border-gray-500 bg-gray-800 text-white rounded-md p-3 focus:border-primary-600 focus:ring-primary-600"
            />
            <Label
              htmlFor="confirmPassword"
              className="absolute left-3 transition-all peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary-600 top-3 text-sm text-gray-400"
            >
              Confirm Password
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-primary-600 border-none shadow-md text-pay flex items-center justify-center"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

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

export default ResetPassword;

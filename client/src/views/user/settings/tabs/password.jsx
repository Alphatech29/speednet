import React, { useState } from 'react';
import { Label } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changePassword } from "../../../../components/backendApis/user/user";

const PasswordTab = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required.");
    }

    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New password and confirm password must match.");
    }

    setLoading(true);
    try {
      const response = await changePassword({ oldPassword, newPassword });

      if (response?.success) {
        toast.success(response.message || "Password updated successfully");
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.message || "Failed to change password");

        if (response.error && typeof response.error === 'object') {
          Object.entries(response.error).forEach(([key, val]) => {
            toast.error(`${key}: ${val}`);
          });
        } else if (typeof response.error === 'string') {
          toast.error(response.error);
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(`Server: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Client: ${error.message}`);
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 min-h-[300px] mobile:p-4 tab:p-6 pc:p-10 text-gray-100">
      <ToastContainer />
      <div className="mx-auto w-full mobile:max-w-sm tab:max-w-md pc:max-w-lg border border-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl text-center font-semibold text-white mb-4">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="oldPassword" value="Old Password" />
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md text-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="newPassword" value="New Password" />
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md text-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" value="Confirm New Password" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md mt-2 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordTab;

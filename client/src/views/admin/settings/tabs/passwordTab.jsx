import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminUpdatePasswordApi } from '../../../../components/backendApis/admin/auth';
import { useAdminAuth } from '../../../../components/control/adminContext';

const PasswordTab = () => {
  const { adminToken } = useAdminAuth();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: '',
    }));
  };

  const validate = () => {
    const { newPassword, confirmNewPassword } = formData;
    const newErrors = {};

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      if (!adminToken) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const response = await adminUpdatePasswordApi(
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        adminToken
      );

      if (response.success) {
        toast.success('Password updated successfully.');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } else {
       
        if (response.errorFields) {
          setErrors(response.errorFields);
        }

        toast.error(response.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="flex max-w-md flex-col gap-4 text-gray-700">
        <div>
          <label htmlFor="oldPassword" className="mb-2 block text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            id="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Enter old password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className="mb-2 block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white py-2 px-4 rounded-md ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Updating...' : 'Change Password'}
        </button>
        </div>
      </div>
    </form>
  );
};

export default PasswordTab;

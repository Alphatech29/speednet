import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { createNotice } from '../../../components/backendApis/admin/apis/notice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    message: '',
    role: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.message || !form.role) {
      toast.error('All fields are required');
      return;
    }

    try {
      const res = await createNotice(form);
      if (res?.success) {
        toast.success(res.message || 'Notice created successfully');
        setTimeout(() => navigate('/admin/announcement'), 1500);
      } else {
        toast.error(res.message || 'Failed to create notice');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleReset = () => {
    setForm({ title: '', message: '', role: '' });
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="mx-auto bg-white rounded-xl shadow-lg p-6 tab:p-10 border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Create Notice</h1>
          <NavLink
            to="/admin/announcement"
            className="text-sm text-gray-700 hover:text-blue-600 underline"
          >
            ← Back to Notice Board
          </NavLink>
        </div>

        <div className="grid grid-cols-1 tab:grid-cols-2 gap-6">
          {/* Title */}
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-1 text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter notice title"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label htmlFor="role" className="mb-1 text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>

          {/* Message */}
          <div className="flex flex-col col-span-1 tab:col-span-2">
            <label htmlFor="message" className="mb-1 text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write your notice message here..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition"
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-md transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;

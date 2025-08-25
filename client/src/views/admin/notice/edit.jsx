import React, { useState } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { updateNoticeById } from '../../../components/backendApis/admin/apis/notice';
import 'react-toastify/dist/ReactToastify.css';

const EditNotice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notice = location.state;

  const [form, setForm] = useState({ ...notice });
  const [initialForm] = useState({ ...notice });
  const [isEditing, setIsEditing] = useState(false);

  if (!notice) {
    return (
      <div className="p-6">
        <p className="text-red-500">No notice data received.</p>
        <NavLink to="/admin/announcement">
          <span className="text-blue-600 underline">← Go back</span>
        </NavLink>
      </div>
    );
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    setForm(initialForm);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.message || !form.role) {
      toast.error('All fields are required');
      return;
    }

    const changedFields = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== initialForm[key]) {
        changedFields[key] = form[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      const res = await updateNoticeById(notice.id, changedFields);
      if (res.success) {
        toast.success(res.message || 'Notice updated successfully!');
        setIsEditing(false);
        setTimeout(() => navigate('/admin/announcement'), 1500);
      } else {
        toast.error(res.message || 'Failed to update notice');
      }
    } catch (error) {
      toast.error('Unexpected error occurred while updating notice');
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="mx-auto bg-white rounded-xl shadow-lg p-6 tab:p-10 border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Notice</h1>
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
              className={`px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
              placeholder="Enter notice title"
              readOnly={!isEditing}
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
              className={`px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isEditing}
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
              className={`px-4 py-2 border border-gray-300 rounded-lg resize-none ${
                isEditing ? 'bg-white' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
              placeholder="Write your notice message here..."
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-md transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditNotice;

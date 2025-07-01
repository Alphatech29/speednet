import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { getUserById, updateUser } from "../../../../components/backendApis/admin/apis/users";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [initialForm, setInitialForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getUserById(uid);
      if (res?.success) {
        setUser(res.data);
        setForm(res.data);
        setInitialForm(res.data);
      } else {
        toast.error("Failed to fetch user");
      }
    })();
  }, [uid]);

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
    const changedFields = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== initialForm[key]) {
        changedFields[key] = form[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      const res = await updateUser(uid, changedFields);
      if (res?.success) {
        toast.success(res.data.message || "User updated successfully");
        setInitialForm(form);
        setIsEditing(false);
      } else {
        toast.error(res.message || "Failed to update user");
      }
    } catch (error) {
      toast.error("Unexpected error occurred while updating user");
      console.error(error);
    }
  };

  if (!user) return <div className="p-4">Loading user...</div>;

  return (
    <div className="w-full">
      <ToastContainer />

      <div className="mx-auto bg-white rounded-xl shadow-lg p-6 tab:p-10 border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit User</h1>
          <NavLink
            to="/admin/users"
            className="text-sm text-gray-700 hover:text-blue-600 underline"
          >
            ← Back to Users
          </NavLink>
        </div>

        <div className="grid grid-cols-1 mobile:grid-cols-2 pc:grid-cols-3 gap-6">
          {[
            { id: "full_name", label: "Full Name" },
            { id: "email", label: "Email", type: "email" },
            { id: "username", label: "Username", type: "text" },
            { id: "phone_number", label: "Phone Number", type: "number" },
            { id: "country", label: "Country" },
            { id: "account_balance", label: "Account Balance", type: "number" },
            { id: "merchant_balance", label: "Merchant Balance", type: "number" },
            { id: "referral_balance", label: "Referral Balance", type: "number" },
            { id: "escrow_balance", label: "Escrow Balance", type: "number" },
          ].map(({ id, label, type = "text" }) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={form[id] ?? ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}

          {/* Locked Password Field */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password ?? ""}
              readOnly
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
            />
          </div>

          {/* Locked Transaction Pin Field */}
          <div className="flex flex-col">
            <label htmlFor="pin" className="mb-1 text-sm font-medium text-gray-700">
              Transaction Pin
            </label>
            <input
              id="pin"
              type="password"
              value={form.pin ?? "Not Set"}
              readOnly
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
            />
          </div>

          {/* Role Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="role" className="mb-1 text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={form.role || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={form.status || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Status</option>
              <option value="1">Active</option>
              <option value="0">Suspended</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-end">
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

export default EditUser;

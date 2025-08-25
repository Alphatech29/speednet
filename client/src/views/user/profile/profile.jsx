import React, { useEffect, useState, useContext } from 'react';
import { Label } from 'flowbite-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getCurrentUser, updateUser } from "../../../components/backendApis/user/user";
import { AuthContext } from '../../../components/control/authContext';

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchUser = async () => {
    if (!authUser?.uid) return;

    try {
      const response = await getCurrentUser(authUser.uid);
      if (response?.success && response.data) {
        setUser(response.data);
      } else {
        toast.error("Failed to load user profile.");
      }
    } catch (error) {
      toast.error("Error fetching user.");
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!avatarFile) return toast.error("Please select an image first.");

    const formData = new FormData();
    formData.append("image", avatarFile);

    setUpdating(true);
    try {
      const response = await updateUser(formData);

      if (response?.success) {
        toast.success(response.message || "Avatar updated successfully!");
        setPreviewAvatar(null);
        setAvatarFile(null);
        fetchUser();
      } else {
        toast.error(response?.message || "Failed to update avatar.");
      }
    } catch (err) {
      toast.error("An error occurred while updating avatar.");
      console.error("Avatar upload error:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className='text-[24px] mb-3 font-medium text-gray-300'>Profile</div>
      <div className="bg-gray-800 p-4 rounded-md text-gray-100">
      <ToastContainer />
      {!user ? (
        <p className="text-gray-400">User data not available.</p>
      ) : (
        <div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <label
                htmlFor="avatarUpload"
                className="w-28 h-28 rounded-full overflow-hidden border border-gray-600 cursor-pointer block"
              >
                <img
                  src={previewAvatar || user.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>

              {avatarFile && (
                <button
                  onClick={handleUpload}
                  disabled={updating}
                  className="mt-2 bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-1 rounded"
                >
                  {updating ? "Uploading..." : "Upload Avatar"}
                </button>
              )}
            </div>

            <div>
              <h2 className="mt-3 text-xl font-semibold">{user.full_name}</h2>
              <p className="text-sm text-gray-400">Username: {user.username}</p>
              <p className="text-sm text-gray-400">Level: {user.role}</p>
            </div>
          </div>

          <div className="mt-4 w-full text-left space-y-2">
            <div>
              <Label htmlFor="email" value="Email" />
              <input
                id="email"
                name="email"
                type="text"
                value={user.email}
                className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md placeholder:text-gray-600"
                readOnly
              />
            </div>

            <div>
              <Label htmlFor="phone" value="Phone Number" />
              <input
                id="phone"
                name="phone"
                type="text"
                value={user.phone_number}
                className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md placeholder:text-gray-600"
                readOnly
              />
            </div>

            <div>
              <Label htmlFor="country" value="Country" />
              <input
                id="country"
                name="country"
                type="text"
                value={user.country}
                className="w-full bg-transparent border border-gray-600 text-sm px-3 py-2 rounded-md placeholder:text-gray-600"
                readOnly
              />
            </div>

            <p className="text-sm mt-3">
              <strong>Note:</strong> To update more details, contact support at{" "}
              <span className="text-blue-400">support@speednet.com</span>.
            </p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Profile;

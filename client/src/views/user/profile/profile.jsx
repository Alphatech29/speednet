import { useEffect, useState, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser, updateUser } from "../../../components/backendApis/user/user";
import { AuthContext } from "../../../components/control/authContext";
import { FaCamera, FaUser, FaEnvelope, FaPhone, FaGlobe, FaShieldAlt } from "react-icons/fa";
import { MdOutlineVerified, MdBadge } from "react-icons/md";
import { HiCheckCircle } from "react-icons/hi";
import { RiEditLine } from "react-icons/ri";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary-600/20 transition-all group">
    <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/20 transition-colors">
      <span className="text-primary-600">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{value || "—"}</p>
    </div>
    <HiCheckCircle size={16} className="text-green-400 flex-shrink-0 opacity-60" />
  </div>
);

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const fetchUser = async () => {
    if (!authUser?.uid) return;
    try {
      const response = await getCurrentUser(authUser.uid);
      if (response?.success && response.data) {
        setUser(response.data);
      } else {
        toast.error("Failed to load profile.");
      }
    } catch {
      toast.error("Error fetching profile.");
    }
  };

  useEffect(() => { fetchUser(); }, [authUser]);

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
        toast.success("Avatar updated successfully!");
        setPreviewAvatar(null);
        setAvatarFile(null);
        fetchUser();
      } else {
        toast.error(response?.message || "Failed to update avatar.");
      }
    } catch {
      toast.error("Error updating avatar.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <ToastContainer position="top-right" theme="light" />

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">View and manage your account details</p>
      </div>

      {!user ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-12 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-700 animate-pulse" />
          <p className="text-sm text-gray-400 dark:text-slate-500">Loading profile...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Avatar + name card */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex flex-col tab:flex-row items-center tab:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary-600/20 shadow-lg">
                  <img
                    src={previewAvatar || user.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 hover:bg-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30 transition-all"
                >
                  <FaCamera size={12} className="text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name + role */}
              <div className="flex-1 text-center tab:text-left">
                <div className="flex items-center gap-2 justify-center tab:justify-start mb-1">
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{user.full_name}</h2>
                  <MdOutlineVerified size={18} className="text-primary-600" />
                </div>
                <p className="text-sm text-gray-400 dark:text-slate-500 mb-1">@{user.username}</p>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full capitalize ${
                  user.role === "merchant"
                    ? "bg-primary-600/10 text-primary-600 border border-primary-600/20"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700"
                }`}>
                  <MdBadge size={12} />{user.role}
                </span>

                {avatarFile && (
                  <div className="mt-4 flex gap-2 justify-center tab:justify-start">
                    <button
                      onClick={handleUpload}
                      disabled={updating}
                      className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-primary-600/25 transition-all"
                    >
                      {updating ? (
                        <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Uploading...</>
                      ) : (
                        <><RiEditLine size={14} />Save Photo</>
                      )}
                    </button>
                    <button onClick={() => { setAvatarFile(null); setPreviewAvatar(null); }} className="text-sm font-semibold text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex tab:flex-col gap-4 tab:gap-3 flex-shrink-0">
                <div className="text-center tab:text-right">
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">Member Since</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-slate-300">{new Date(user.created_at || Date.now()).getFullYear()}</p>
                </div>
                <div className="text-center tab:text-right">
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">Account Level</p>
                  <p className="text-xs font-bold text-primary-600 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info fields */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm"
          >
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-4">Account Information</p>
            <div className="grid grid-cols-1 tab:grid-cols-2 gap-3">
              <InfoField icon={<FaUser size={14} />} label="Full Name" value={user.full_name} />
              <InfoField icon={<FaUser size={13} />} label="Username" value={`@${user.username}`} />
              <InfoField icon={<FaEnvelope size={13} />} label="Email Address" value={user.email} />
              <InfoField icon={<FaPhone size={13} />} label="Phone Number" value={user.phone_number} />
              <InfoField icon={<FaGlobe size={13} />} label="Country" value={user.country} />
              <InfoField icon={<MdBadge size={16} />} label="Account Role" value={user.role} />
            </div>
          </motion.div>

          {/* Notice */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-start gap-4 bg-primary-600/8 border border-primary-600/20 rounded-2xl px-5 py-4"
          >
            <FaShieldAlt size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              To update your account details, please contact support at{" "}
              <a href="mailto:support@speednet.com" className="text-primary-600 font-semibold hover:underline">
                support@speednet.com
              </a>
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;

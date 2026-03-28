import { useState } from "react";
import { toast } from "react-toastify";
import { addPlatform } from "../../../../components/backendApis/admin/apis/platform";
import { HiPhotograph, HiCheck, HiX } from "react-icons/hi";

const PLATFORM_TYPES = [
  "Social Media", "Email & Messaging", "VPN & Proxys", "Website",
  "E-Commerce Platform", "Gaming", "Account & Subscription", "Other",
];

const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all";

const Add = ({ onClose }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile]       = useState(null);
  const [platformName, setPlatformName] = useState("");
  const [platformType, setPlatformType] = useState("");
  const [submitting, setSubmitting]     = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG and JPEG files are allowed"); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be 2MB or less"); return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!platformName || !platformType || !imageFile) {
      toast.error("Please fill all fields"); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", platformName);
      fd.append("type", platformType);
      fd.append("image", imageFile);
      const res = await addPlatform(fd);
      if (res?.success || res?.platformId) {
        toast.success(res?.message || "Platform added successfully");
        onClose?.();
      } else toast.error(res?.message || "Failed to add platform");
    } catch { toast.error("Error adding platform"); }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500">Platform Name</label>
        <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)}
          placeholder="Enter platform name" className={inputCls} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500">Platform Type</label>
        <select value={platformType} onChange={(e) => setPlatformType(e.target.value)}
          className={inputCls} required>
          <option value="">Select type</option>
          {PLATFORM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500">Platform Image <span className="font-normal text-gray-400">(PNG/JPEG · Max 2MB)</span></label>
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
          <HiPhotograph size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">{imageFile ? imageFile.name : "Click to upload image"}</span>
          <input type="file" accept=".png,.jpeg,.jpg" onChange={handleImageChange} className="hidden" required={!imageFile} />
        </label>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-gray-100 mt-1" />
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all">
          <HiX size={12} /> Cancel
        </button>
        <button type="submit" disabled={submitting}
          className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all">
          <HiCheck size={12} /> {submitting ? "Adding..." : "Add Platform"}
        </button>
      </div>
    </form>
  );
};

export default Add;

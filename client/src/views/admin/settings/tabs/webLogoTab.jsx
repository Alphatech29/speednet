import { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { HiUpload, HiPhotograph, HiCheckCircle } from "react-icons/hi";
import { GlobalContext } from "../../../../components/control/globalContext";
import { updateWebSettings } from "../../../../components/backendApis/admin/apis/settings";
import { AccentLine, TabHeader } from "./_shared";

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Upload card ──────────────────────────────────────────────── */
const UploadCard = ({ title, desc, rec, size, previewSrc, fallback, onFileChange, onUpload, uploading, hasFile, rounded, index }) => {
  const [imgErr, setImgErr] = useState(false);
  const displaySrc = previewSrc || (!imgErr && fallback ? fallback : null);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <AccentLine />

      <div className="p-5 flex flex-col tab:flex-row items-center tab:items-start gap-6">

        {/* ── Drop zone ── */}
        <label className={`relative cursor-pointer flex-shrink-0 group border-2 border-dashed
          ${rounded ? "rounded-full" : "rounded-2xl"}
          ${hasFile ? "border-primary-600/40 bg-primary-600/5" : "border-gray-200 hover:border-primary-600/40 bg-gray-50 hover:bg-primary-600/5"}
          transition-all overflow-hidden`}
          style={{ width: size, height: size }}>

          {displaySrc
            ? <img src={displaySrc} alt={title}
                onError={() => setImgErr(true)}
                className={`w-full h-full object-cover ${rounded ? "rounded-full" : "rounded-xl"}`} />
            : <div className="w-full h-full flex items-center justify-center">
                <HiPhotograph size={Math.max(size / 3, 20)} className="text-gray-200" />
              </div>
          }

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
            <HiUpload size={18} className="text-white" />
            <span className="text-white text-[10px] font-bold">Change</span>
          </div>

          {/* New file indicator */}
          {hasFile && (
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center shadow">
              <HiCheckCircle size={12} className="text-white" />
            </div>
          )}

          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>

        {/* ── Info ── */}
        <div className="flex flex-col gap-3 text-center tab:text-left flex-1">
          <div>
            <p className="font-extrabold text-gray-900 text-sm">{title}</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
            {rec && (
              <p className="text-[10px] font-semibold text-gray-300 mt-1 uppercase tracking-wide">{rec}</p>
            )}
          </div>

          {hasFile
            ? <button onClick={onUpload} disabled={uploading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all w-full tab:w-auto tab:self-start shadow-sm">
                {uploading
                  ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Uploading…</>
                  : <><HiUpload size={13} /> Upload {title}</>
                }
              </button>
            : <p className="text-[11px] text-gray-400 italic">Click the preview to select a new file</p>
          }
        </div>
      </div>
    </motion.div>
  );
};

/* ── Component ─────────────────────────────────────────────────── */
const WebLogoTab = () => {
  const { webSettings } = useContext(GlobalContext);

  const [previewLogo,      setPreviewLogo]      = useState(null);
  const [logoFile,         setLogoFile]         = useState(null);
  const [uploadingLogo,    setUploadingLogo]    = useState(false);

  const [previewFavicon,   setPreviewFavicon]   = useState(null);
  const [faviconFile,      setFaviconFile]      = useState(null);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const handleChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (file, fieldName, setUploading, setFile, setPreview) => {
    if (!file) return toast.error("Please select an image first.");
    setUploading(true);
    try {
      const res = await updateWebSettings({ [fieldName]: file });
      if (res?.success) {
        toast.success(`${fieldName === "favicon" ? "Favicon" : "Logo"} updated!`);
        setFile(null);
        setPreview(null);
      } else toast.error(res?.message || "Upload failed");
    } catch { toast.error("Upload error"); }
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <TabHeader title="Logo & Branding" subtitle="Upload your site logo and favicon. Click the preview to pick a new file." />

      <UploadCard
        index={1}
        title="Site Logo"
        rounded
        size={100}
        desc="Your main brand logo shown in the header and navigation."
        rec="Recommended: PNG · min 200×200 px"
        previewSrc={previewLogo}
        fallback={webSettings?.logo}
        onFileChange={(e) => handleChange(e, setLogoFile, setPreviewLogo)}
        onUpload={() => handleUpload(logoFile, "logo", setUploadingLogo, setLogoFile, setPreviewLogo)}
        uploading={uploadingLogo}
        hasFile={!!logoFile}
      />

      <UploadCard
        index={2}
        title="Favicon"
        size={64}
        desc="Small icon displayed in browser tabs and bookmarks."
        rec="Recommended: ICO or PNG · 32×32 px or 64×64 px"
        previewSrc={previewFavicon}
        fallback={webSettings?.favicon}
        onFileChange={(e) => handleChange(e, setFaviconFile, setPreviewFavicon)}
        onUpload={() => handleUpload(faviconFile, "favicon", setUploadingFavicon, setFaviconFile, setPreviewFavicon)}
        uploading={uploadingFavicon}
        hasFile={!!faviconFile}
      />
    </div>
  );
};

export default WebLogoTab;

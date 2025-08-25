import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { GlobalContext } from '../../../../components/control/globalContext';
import { updateWebSettings } from '../../../../components/backendApis/admin/apis/settings';

const WebLogoTab = () => {
  const { webSettings } = useContext(GlobalContext);

  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [previewFavicon, setPreviewFavicon] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const handleChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

 const handleUpload = async (file, setUploading, resetFile, resetPreview, fieldName) => {
  if (!file) return toast.error("Please select an image first.");

  const payload = {
    [fieldName]: file,
  };

  setUploading(true);
  try {
    const response = await updateWebSettings(payload);

    if (response?.success) {
      toast.success(`${fieldName === "favicon" ? "Favicon" : "Logo"} updated successfully!`);
      resetFile(null);
      resetPreview(null);
    } else {
      toast.error(response?.message || `Failed to update ${fieldName}.`);
    }
  } catch (error) {
    toast.error(`An error occurred while uploading ${fieldName}.`);
    console.error(`${fieldName} upload error:`, error);
  } finally {
    setUploading(false);
  }
};


  return (
    <div className=" p-4 tab:p-6 pc:p-8 rounded-md text-gray-700 w-full mobile:max-w-full tab:max-w-2xl pc:max-w-3xl mx-auto">
  {/* Logo Section */}
      <div className="mb-10">
        <h3 className="text-base tab:text-lg font-medium mb-3 text-center tab:text-left">Logo</h3>
        <div className="flex flex-col tab:flex-row tab:items-center tab:gap-6 items-center gap-3">
          <label
            htmlFor="logoUpload"
            className="w-24 h-24 tab:w-28 tab:h-28 pc:w-32 pc:h-32 rounded-full shadow-lg overflow-hidden border border-gray-600 cursor-pointer block"
          >
            <img
              src={previewLogo || webSettings?.logo}
              alt="Website Logo"
              className="w-full h-full object-cover"
            />
            <input
              id="logoUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleChange(e, setLogoFile, setPreviewLogo)}
            />
          </label>

          {logoFile && (
            <button
              onClick={() => handleUpload(logoFile, setUploadingLogo, setLogoFile, setPreviewLogo, "logo")}
              disabled={uploadingLogo}
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-4 py-2 rounded w-full tab:w-auto"
            >
              {uploadingLogo ? "Uploading..." : "Upload Logo"}
            </button>
          )}
        </div>
      </div>

      {/* Favicon Section */}
      <div>
        <h3 className="text-base tab:text-lg font-medium mb-3 text-center tab:text-left">Favicon</h3>
        <div className="flex flex-col tab:flex-row tab:items-center tab:gap-6 items-center gap-3">
          <label
            htmlFor="faviconUpload"
            className="w-10 h-10 tab:w-12 tab:h-12 pc:w-16 pc:h-16 overflow-hidden border border-gray-600 cursor-pointer block rounded"
          >
            <img
              src={previewFavicon || webSettings?.favicon}
              alt="Favicon"
              className="w-full h-full object-cover"
            />
            <input
              id="faviconUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleChange(e, setFaviconFile, setPreviewFavicon)}
            />
          </label>

          {faviconFile && (
            <button
              onClick={() => handleUpload(faviconFile, setUploadingFavicon, setFaviconFile, setPreviewFavicon, "favicon")}
              disabled={uploadingFavicon}
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-4 py-2 rounded w-full tab:w-auto"
            >
              {uploadingFavicon ? "Uploading..." : "Upload Favicon"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebLogoTab;

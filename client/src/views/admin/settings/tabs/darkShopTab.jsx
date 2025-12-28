import React, { useEffect, useState } from 'react';
import { getWebSettings, updateWebSettings } from '../../../../components/backendApis/admin/apis/settings';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DarkShopTab = () => {
  const [settings, setSettings] = useState({
    dark_base_url: '',
    dark_access_key: '',
    dark_api_key: '',
  });

  const [initialSettings, setInitialSettings] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getWebSettings();
        if (res?.success && res.data) {
          const data = res.data;
          const populated = {
            dark_base_url: data.dark_base_url || '',
            dark_access_key: data.dark_access_key || '',
            dark_api_key: data.dark_api_key || '',
          };
          setSettings(populated);
          setInitialSettings(populated);
        } else {
          toast.error('VTpass settings not found');
        }
      } catch (error) {
        console.error("❌ Error fetching settings:", error);
        toast.error(error?.response?.data?.message || 'Failed to fetch settings');
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = async () => {
    const changedFields = {};

    Object.keys(settings).forEach((key) => {
      if (settings[key] !== initialSettings[key]) {
        changedFields[key] = settings[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes to update');
      return;
    }

    try {
      const res = await updateWebSettings(changedFields);
      toast.success(res?.data?.message || 'VTpass settings updated successfully');
      setInitialSettings(settings);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Update error:", error);
      toast.error(error?.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setIsEditing(false);
  };

  return (
    <div className="flex max-w-md flex-col p-4 border rounded-lg">
      <ToastContainer />

      <h1 className="text-[20px] font-semibold">Darkshop Settings</h1>
      <p className="text-[16px] mb-4">
        Manage your Darkshop API credentials for integration.
      </p>

      <div className="flex flex-col gap-4 text-gray-700">
        {[
          { id: 'dark_base_url', label: 'Dark Shop Base URL' },
          { id: 'dark_access_key', label: 'Dark Shop Access Key' },
          { id: 'dark_api_key', label: 'Dark Shop API Key' },
        ].map(({ id, label }) => (
          <div key={id}>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={id}
              type="text"
              value={
                !isEditing &&
                ['dark_access_key', 'dark_api_key'].includes(id)
                  ? '*******'
                  : settings[id]
              }
              onChange={handleChange}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              readOnly={!isEditing}
            />
          </div>
        ))}

        {!isEditing ? (
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white py-2 px-4 rounded-md"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DarkShopTab;

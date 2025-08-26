import React, { useEffect, useState } from 'react';
import { getWebSettings, updateWebSettings } from '../../../../components/backendApis/admin/apis/settings';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SmsTab = () => {
  const [settings, setSettings] = useState({
    onlinesim_api_url: '',
    onlinesim_api_key: '',
    onlinesim_rate: '', 
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
            onlinesim_api_url: data.onlinesim_api_url || '',
            onlinesim_api_key: data.onlinesim_api_key || '',
            onlinesim_rate: data.onlinesim_rate || '',
          };
          setSettings(populated);
          setInitialSettings(populated);
        } else {
          toast.error('Smspool settings not found');
        }
      } catch (error) {
        console.error(" Error fetching settings:", error);
        toast.error(error?.response?.data?.message || 'Failed to fetch settings');
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async () => {
    const changedFields = {};
    Object.keys(settings).forEach((key) => {
      if (settings[key] !== initialSettings[key]) changedFields[key] = settings[key];
    });

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes to update');
      return;
    }

    try {
      const res = await updateWebSettings(changedFields);
      toast.success(res?.data?.message || 'Smspool settings updated successfully');
      setInitialSettings(settings);
      setIsEditing(false);
    } catch (error) {
      console.error(" Update error:", error);
      toast.error(error?.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setIsEditing(false);
  };

  const fields = [
    { id: 'onlinesim_api_url', label: 'Smspool URL' },
    { id: 'onlinesim_api_key', label: 'Smspool API Key' },
    { id: 'onlinesim_rate', label: 'Smspool Rate (%)' },
  ];

  return (
    <div className="flex max-w-md flex-col p-4 border rounded-lg">
      <ToastContainer />
      <h1 className="text-[20px] font-semibold">Smspool Settings</h1>
      <p className="text-[16px] mb-4">Manage your Smspool API credentials and pricing rate.</p>

      <div className="flex flex-col gap-4 text-gray-700">
        {fields.map(({ id, label }) => (
          <div key={id}>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
            <input
              id={id}
              type={id === 'onlinesim_rate' ? 'number' : 'text'}
              step="0.01"
              value={
                !isEditing && id === 'onlinesim_api_key'
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
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md mt-2"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-4 mt-2">
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

export default SmsTab;

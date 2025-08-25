import React, { useEffect, useState } from 'react';
import { getWebSettings, updateWebSettings } from '../../../../components/backendApis/admin/apis/settings';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SmtpserverTab = () => {
  const [settings, setSettings] = useState({
    smtp_service: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
  });

  const [initialSettings, setInitialSettings] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getWebSettings();
        if (res?.success && res.data) {
          const data = res.data;
          const smtpSettings = {
            smtp_service: data.smtp_service || '',
            smtp_port: data.smtp_port || '',
            smtp_user: data.smtp_user || '',
            smtp_pass: data.smtp_pass || '',
          };
          setSettings(smtpSettings);
          setInitialSettings(smtpSettings);
        } else {
          toast.error('No SMTP settings found');
        }
      } catch (error) {
        console.error("❌ Error fetching SMTP settings:", error);
        toast.error(error?.response?.data?.message || 'Failed to fetch SMTP settings');
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
      toast.success(res?.data?.message || 'SMTP settings updated successfully');
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
    <div className="mx-auto bg-white rounded-xl shadow-lg p-6 pc:pt-2 tab:p-10 border">
      <ToastContainer />

      <div className="flex flex-col mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">SMTP Server Settings</h1>
          <p className="text-gray-600 mb-6 text-base">
            Manage your SMTP configuration for sending transactional emails.
          </p>
        </div>

        <div className="grid grid-cols-1 mobile:grid-cols-2 pc:grid-cols-2 gap-6">
          {[
            { id: 'smtp_service', label: 'SMTP Service' },
            { id: 'smtp_port', label: 'SMTP Port', type: 'number' },
            { id: 'smtp_user', label: 'SMTP User (Mail)', type: 'email' },
            { id: 'smtp_pass', label: 'SMTP Password', type: 'password' },
          ].map(({ id, label, type = 'text' }) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={settings[id]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                readOnly={!isEditing}
              />
            </div>
          ))}
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
                onClick={handleUpdate}
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

export default SmtpserverTab;

import React, { useEffect, useState } from 'react';
import { getWebSettings, updateWebSettings } from '../../../../components/backendApis/admin/apis/settings';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WebSettingsTab = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    tagline: '',
    web_description: '',
    support_email: '',
    vat: '',
    merchant_activation_fee: '',
    currency: '',
    xaf_rate: '',
    contact_number: '',
    address: '',
    web_url: '', 
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
            site_name: data.site_name || '',
            tagline: data.tagline || '',
            web_description: data.web_description || '',
            support_email: data.support_email || '',
            vat: data.vat || '',
            merchant_activation_fee: data.merchant_activation_fee || '',
            currency: data.currency || '',
            xaf_rate: data.xaf_rate || '',
            contact_number: data.contact_number || '',
            address: data.address || '',
            web_url: data.web_url || '', // ✅ Added web_url
          };
          setSettings(populated);
          setInitialSettings(populated);
        } else {
          toast.error('No web settings found');
        }
      } catch (error) {
        console.error("❌ Error fetching web settings:", error);
        toast.error(error?.response?.data?.message || 'Failed to fetch web settings');
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
      toast.success(res?.data?.message || 'Web settings updated successfully');
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
    <div className="flex max-w-md flex-col p-4 border rounded-lg web-settings">
      <ToastContainer />

      <div>
        <h1 className="text-[20px] font-semibold">Web Settings</h1>
        <p className="text-[16px]">
          Customize your website’s configuration including site details, display preferences,
          security options, and real-time interaction settings to ensure smooth and secure platform performance.
        </p>
      </div>

      <div className="flex max-w-md flex-col gap-4 text-gray-700 mt-3">
        {[
          { id: 'site_name', label: 'Site Name' },
          { id: 'tagline', label: 'Tagline' },
          { id: 'web_description', label: 'Description' },
          { id: 'support_email', label: 'Support Email', type: 'email' },
          { id: 'vat', label: 'VAT (%)', type: 'number' },
          { id: 'merchant_activation_fee', label: 'Merchant Activation Fee', type: 'number' },
          { id: 'currency', label: 'Currency' },
          { id: 'xaf_rate', label: 'XAF Rate', type: 'number' },
           { id: 'web_url', label: 'Website URL', type: 'url' },
          { id: 'contact_number', label: 'Contact Number', type: 'tel' },
          { id: 'address', label: 'Address' },
         
        ].map(({ id, label, type = 'text' }) => (
          <div key={id}>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={id}
              type={type}
              value={settings[id]}
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

export default WebSettingsTab;

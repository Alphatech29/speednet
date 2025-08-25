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
    admin_alert_email: '',
    vat: '',
    commission: '',
    merchant_activation_fee: '',
    currency: '',
    xaf_rate: '',
    naira_rate: '',
    referral_commission: '',
    escrow_time: '',
    contact_number: '',
    address: '',
    web_url: '',
    telegram_url: '',
    twitter_url: '',
    instagram_url: '',
    tiktok_url: '',
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
            admin_alert_email: data.admin_alert_email || '',
            vat: data.vat || '',
            commission: data.commission || '',
            merchant_activation_fee: data.merchant_activation_fee || '',
            currency: data.currency || '',
            xaf_rate: data.xaf_rate || '',
            naira_rate: data.naira_rate || '',
            referral_commission: data.referral_commission || '',
            escrow_time: data.escrow_time || '',
            contact_number: data.contact_number || '',
            address: data.address || '',
            web_url: data.web_url || '',
            telegram_url: data.telegram_url || '',
            twitter_url: data.twitter_url || '',
            instagram_url: data.instagram_url || '',
            tiktok_url: data.tiktok_url || '',
          };
          setSettings(populated);
          setInitialSettings(populated);
        } else {
          toast.error('No web settings found');
        }
      } catch (error) {
        console.error("Error fetching web settings:", error);
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
      console.error("Update error:", error);
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Web Settings</h1>
          <p className="text-gray-600 mb-6 text-base">
            Customize your website’s configuration including site details, financial rates, and social links.
          </p>
        </div>
        <div className="grid grid-cols-1 mobile:grid-cols-2 pc:grid-cols-3 gap-6">
          {[
            { id: 'site_name', label: 'Site Name' },
            { id: 'tagline', label: 'Tagline' },
            { id: 'web_description', label: 'Description' },
            { id: 'support_email', label: 'Support Email', type: 'email' },
            { id: 'admin_alert_email', label: 'Notification Email', type: 'email' },
            { id: 'vat', label: 'VAT (%)', type: 'number' },
            { id: 'commission', label: 'Escrow Commission (%)', type: 'number' },
            { id: 'merchant_activation_fee', label: 'Merchant Activation Fee', type: 'number' },
            { id: 'currency', label: 'Currency' },
            { id: 'xaf_rate', label: 'XAF Rate', type: 'number' },
            { id: 'naira_rate', label: 'Naira Rate', type: 'number' },
            { id: 'referral_commission', label: 'Referral Commission ($)', type: 'number' },
            { id: 'web_url', label: 'Website URL', type: 'url' },
            { id: 'escrow_time', label: 'Escrow Time (minutes)', type: 'text' },
            { id: 'contact_number', label: 'Contact Number', type: 'tel' },
            { id: 'address', label: 'Address' },
            { id: 'telegram_url', label: 'Telegram URL', type: 'url' },
            { id: 'twitter_url', label: 'Twitter URL', type: 'url' },
            { id: 'instagram_url', label: 'Instagram URL', type: 'url' },
            { id: 'tiktok_url', label: 'TikTok URL', type: 'url' },
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

export default WebSettingsTab;

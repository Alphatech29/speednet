import React, { useEffect, useState } from 'react';
import { getWebSettings, updateWebSettings } from '../../../../components/backendApis/admin/apis/settings';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentTab = () => {
  const [settings, setSettings] = useState({
    fapshi_url: '',
    fapshi_user: '',
    fapshi_key: '',
    cryptomus_url: '',
    cryptomus_merchant_uuid: '',
    cryptomus_api_key: '',
  });
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState({ fapshi: false, cryptomus: false });
  const [formData, setFormData] = useState({
    fapshi: {
      fapshi_url: '',
      fapshi_user: '',
      fapshi_key: '',
    },
    cryptomus: {
      cryptomus_url: '',
      cryptomus_merchant_uuid: '',
      cryptomus_api_key: '',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getWebSettings();
        if (response.success) {
          const result = Array.isArray(response.data) ? response.data[0] : response.data;
          if (result) {
            setSettings({
              fapshi_url: result.fapshi_url || '',
              fapshi_user: result.fapshi_user || '',
              fapshi_key: result.fapshi_key || '',
              cryptomus_url: result.cryptomus_url || '',
              cryptomus_merchant_uuid: result.cryptomus_merchant_uuid || '',
              cryptomus_api_key: result.cryptomus_api_key || '',
            });
            setFormData({
              fapshi: {
                fapshi_url: result.fapshi_url || '',
                fapshi_user: result.fapshi_user || '',
                fapshi_key: result.fapshi_key || '',
              },
              cryptomus: {
                cryptomus_url: result.cryptomus_url || '',
                cryptomus_merchant_uuid: result.cryptomus_merchant_uuid || '',
                cryptomus_api_key: result.cryptomus_api_key || '',
              },
            });
          }
        } else {
          const errorMsg = response.message || 'Failed to load settings';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (error) {
        const errorMsg = error.message || 'An error occurred while fetching settings';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    };

    fetchSettings();
  }, []);

  const handleEditToggle = (provider) => {
    setEditing((prev) => ({ ...prev, [provider]: !prev[provider] }));
    if (editing[provider]) {
      setFormData((prev) => ({
        ...prev,
        [provider]: {
          [`${provider}_url`]: settings[`${provider}_url`],
          ...(provider === 'fapshi'
            ? {
                [`${provider}_user`]: settings[`${provider}_user`],
                [`${provider}_key`]: settings[`${provider}_key`],
              }
            : {
                [`${provider}_merchant_uuid`]: settings[`${provider}_merchant_uuid`],
                [`${provider}_api_key`]: settings[`${provider}_api_key`],
              }),
        },
      }));
    }
  };

  const handleChange = (e, provider) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [name]: value,
      },
    }));
  };

 const handleSubmit = async (provider) => {
  try {
    const providerData = formData[provider];
    const payload = {};
    let hasChanges = false;

    if (providerData[`${provider}_url`] !== settings[`${provider}_url`]) {
      payload[`${provider}_url`] = providerData[`${provider}_url`];
      hasChanges = true;
    }

    if (provider === 'fapshi') {
      if (providerData.fapshi_user !== settings.fapshi_user) {
        payload.fapshi_user = providerData.fapshi_user;
        hasChanges = true;
      }
      if (providerData.fapshi_key !== settings.fapshi_key) {
        payload.fapshi_key = providerData.fapshi_key;
        hasChanges = true;
      }
    } else if (provider === 'cryptomus') {
      if (providerData.cryptomus_merchant_uuid !== settings.cryptomus_merchant_uuid) {
        payload.cryptomus_merchant_uuid = providerData.cryptomus_merchant_uuid;
        hasChanges = true;
      }
      if (providerData.cryptomus_api_key !== settings.cryptomus_api_key) {
        payload.cryptomus_api_key = providerData.cryptomus_api_key;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      toast.info('No changes detected');
      setEditing((prev) => ({ ...prev, [provider]: false }));
      return;
    }

    const response = await updateWebSettings(payload); // Only changed fields are sent
    if (response.success) {
      setSettings((prev) => ({ ...prev, ...payload }));
      setEditing((prev) => ({ ...prev, [provider]: false }));
      toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} settings updated successfully`);
    } else {
      const errorMsg = response.message || 'Failed to update settings';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  } catch (error) {
    const errorMsg = error.message || 'An error occurred while updating settings';
    setError(errorMsg);
    toast.error(errorMsg);
  }
};


  if (error) {
    return (
      <>
        <ToastContainer />
        <div className="p-4 text-center text-red-500">{error}</div>
      </>
    );
  }

  const renderInput = (label, id, name, value, onChange, readOnly, type = 'text') => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        readOnly={readOnly}
      />
    </div>
  );

  const renderSection = (provider, fields, description) => (
    <div className="flex max-w-md flex-col gap-4 p-4 border rounded-lg">
      <div>
        <h1 className="text-xl font-semibold">{provider.charAt(0).toUpperCase() + provider.slice(1)} Payment APIs</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex flex-col gap-4">
        {fields.map(({ label, id, name, type }) =>
          renderInput(
            label,
            id,
            name,
            editing[provider] ? formData[provider][name] : settings[name],
            (e) => handleChange(e, provider),
            !editing[provider],
            type || 'text'
          )
        )}
        <div className="flex gap-2">
          {!editing[provider] ? (
            <button
              onClick={() => handleEditToggle(provider)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => handleSubmit(provider)}
                className="bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => handleEditToggle(provider)}
                className="bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-8">
        {renderSection('fapshi', [
          { label: 'Fapshi URL', id: 'fapshiUrl', name: 'fapshi_url' },
          { label: 'Fapshi User', id: 'fapshiUser', name: 'fapshi_user' },
          { label: 'Fapshi Key', id: 'fapshiKey', name: 'fapshi_key', type: editing.fapshi ? 'text' : 'password' },
        ],
          'Fapshi Payment APIs enable secure transactions using your public and secret keys.'
        )}

        {renderSection('cryptomus', [
          { label: 'Cryptomus URL', id: 'cryptomusUrl', name: 'cryptomus_url' },
          { label: 'Merchant UUID', id: 'cryptomusMerchantUuid', name: 'cryptomus_merchant_uuid' },
          { label: 'API Key', id: 'cryptomusApiKey', name: 'cryptomus_api_key', type: editing.cryptomus ? 'text' : 'password' },
        ],
          'Cryptomus Payment APIs enable secure crypto transactions.'
        )}
      </div>
    </>
  );
};

export default PaymentTab;

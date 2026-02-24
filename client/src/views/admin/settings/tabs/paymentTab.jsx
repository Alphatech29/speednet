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

    // MONNIFY
    monnify_baseUrl: '',
    monnify_apiKey: '',
    monnify_secretKey: '',
    monnify_contractCode: '',
  });

  const [error, setError] = useState(null);

  const [editing, setEditing] = useState({
    fapshi: false,
    cryptomus: false,
    monnify: false,
  });

  const [formData, setFormData] = useState({
    fapshi: { fapshi_url: '', fapshi_user: '', fapshi_key: '' },
    cryptomus: { cryptomus_url: '', cryptomus_merchant_uuid: '', cryptomus_api_key: '' },
    monnify: {
      monnify_baseUrl: '',
      monnify_apiKey: '',
      monnify_secretKey: '',
      monnify_contractCode: '',
    },
  });

  /* ---------------- FETCH SETTINGS ---------------- */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getWebSettings();
        if (!response.success) throw new Error(response.message);

        const result = Array.isArray(response.data) ? response.data[0] : response.data;

        setSettings({
          fapshi_url: result.fapshi_url || '',
          fapshi_user: result.fapshi_user || '',
          fapshi_key: result.fapshi_key || '',
          cryptomus_url: result.cryptomus_url || '',
          cryptomus_merchant_uuid: result.cryptomus_merchant_uuid || '',
          cryptomus_api_key: result.cryptomus_api_key || '',

          monnify_baseUrl: result.monnify_baseUrl || '',
          monnify_apiKey: result.monnify_apiKey || '',
          monnify_secretKey: result.monnify_secretKey || '',
          monnify_contractCode: result.monnify_contractCode || '',
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
          monnify: {
            monnify_baseUrl: result.monnify_baseUrl || '',
            monnify_apiKey: result.monnify_apiKey || '',
            monnify_secretKey: result.monnify_secretKey || '',
            monnify_contractCode: result.monnify_contractCode || '',
          },
        });

      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    };

    fetchSettings();
  }, []);

  /* ---------------- EDIT TOGGLE ---------------- */
  const handleEditToggle = (provider) => {
    setEditing(prev => ({ ...prev, [provider]: !prev[provider] }));

    if (editing[provider]) {
      setFormData(prev => ({
        ...prev,
        [provider]: Object.fromEntries(
          Object.keys(prev[provider]).map(key => [key, settings[key]])
        ),
      }));
    }
  };

  /* ---------------- INPUT CHANGE ---------------- */
  const handleChange = (e, provider) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [provider]: { ...prev[provider], [name]: value },
    }));
  };

  /* ---------------- SAVE SETTINGS ---------------- */
  const handleSubmit = async (provider) => {
    try {
      const providerData = formData[provider];
      const payload = {};
      let hasChanges = false;

      Object.keys(providerData).forEach(key => {
        if (providerData[key] !== settings[key]) {
          payload[key] = providerData[key];
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        toast.info('No changes detected');
        setEditing(prev => ({ ...prev, [provider]: false }));
        return;
      }

      const response = await updateWebSettings(payload);

      if (!response.success) throw new Error(response.message);

      setSettings(prev => ({ ...prev, ...payload }));
      setEditing(prev => ({ ...prev, [provider]: false }));
      toast.success(`${provider.toUpperCase()} settings updated successfully`);

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  /* ---------------- UI HELPERS ---------------- */
  const renderInput = (label, id, name, value, onChange, readOnly, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  );

  const renderSection = (provider, fields, description) => (
    <div className="flex w-full flex-col gap-4 p-4 border rounded-lg">
      <div>
        <h1 className="text-xl font-semibold capitalize">{provider} Payment APIs</h1>
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
            <button onClick={() => handleEditToggle(provider)} className="bg-blue-600 text-white py-2 px-4 rounded-md">
              Edit
            </button>
          ) : (
            <>
              <button onClick={() => handleSubmit(provider)} className="bg-green-600 text-white py-2 px-4 rounded-md">
                Save
              </button>
              <button onClick={() => handleEditToggle(provider)} className="bg-gray-600 text-white py-2 px-4 rounded-md">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  /* ---------------- RENDER ---------------- */
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="flex gap-4">

        {renderSection('fapshi', [
          { label: 'Fapshi URL', id: 'fapshiUrl', name: 'fapshi_url' },
          { label: 'Fapshi User', id: 'fapshiUser', name: 'fapshi_user' },
          { label: 'Fapshi Key', id: 'fapshiKey', name: 'fapshi_key', type: editing.fapshi ? 'text' : 'password' },
        ], 'Fapshi Payment APIs enable secure transactions.')}

        {renderSection('cryptomus', [
          { label: 'Cryptomus URL', id: 'cryptomusUrl', name: 'cryptomus_url' },
          { label: 'Merchant UUID', id: 'cryptomusMerchantUuid', name: 'cryptomus_merchant_uuid' },
          { label: 'API Key', id: 'cryptomusApiKey', name: 'cryptomus_api_key', type: editing.cryptomus ? 'text' : 'password' },
        ], 'Cryptomus enables crypto payments.')}

        {renderSection('monnify', [
          { label: 'Base URL', id: 'monnifyBaseUrl', name: 'monnify_baseUrl' },
          { label: 'API Key', id: 'monnifyApiKey', name: 'monnify_apiKey', type: editing.monnify ? 'text' : 'password' },
          { label: 'Secret Key', id: 'monnifySecretKey', name: 'monnify_secretKey', type: editing.monnify ? 'text' : 'password' },
          { label: 'Contract Code', id: 'monnifyContractCode', name: 'monnify_contractCode' },
        ], 'Monnify enables bank transfer and card payments.')}

      </div>
    </>
  );
};

export default PaymentTab;
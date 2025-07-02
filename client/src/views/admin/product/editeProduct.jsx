import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { getProductById, updateProductById } from '../../../components/backendApis/admin/apis/products';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [initialForm, setInitialForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const isSold = form.status === 'sold';

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        if (res?.success) {
          setProduct(res.data);
          setForm(res.data);
          setInitialForm(res.data);
        } else {
          toast.error('Failed to fetch product details');
        }
      } catch (error) {
        toast.error('Error fetching product');
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    setForm(initialForm);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const changedFields = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== initialForm[key]) {
        changedFields[key] = form[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      const res = await updateProductById(id, changedFields);
      if (res?.success) {
        toast.success(res.message || 'Product updated successfully');
        setInitialForm(form);
        setIsEditing(false);
      } else {
        toast.error(res.message || 'Failed to update product');
      }
    } catch (error) {
      toast.error('Unexpected error occurred while updating product');
    }
  };

  if (!product) return <div className="p-4">Loading product...</div>;

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="mx-auto bg-white rounded-xl shadow-lg p-6 tab:p-10 border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
          <NavLink
            to="/admin/products"
            className="text-sm text-gray-700 hover:text-blue-600 underline"
          >
            ← Back to Products
          </NavLink>
        </div>

        <div className="grid grid-cols-1 mobile:grid-cols-2 pc:grid-cols-3 gap-6">
          {[
            { id: 'platform', label: 'Platform' },
            { id: 'title', label: 'Title' },
            { id: 'email', label: 'Email' },
            { id: 'username', label: 'Username' },
            { id: 'password', label: 'Password' },
            { id: 'recovery_email', label: 'Recovery Email' },
            { id: 'recoveryEmailpassword', label: 'Recovery Email Password' },
            { id: 'additionalEmail', label: 'Additional Email' },
            { id: 'additionalPassword', label: 'Additional Password' },
            { id: 'previewLink', label: 'Preview Link' },
            { id: 'price', label: 'Price' },
            { id: 'description', label: 'Description' },
            { id: 'subscription_status', label: 'Subscription Status' },
            { id: 'expiry_date', label: 'Expiry Date' },
            { id: 'two_factor_enable', label: '2AF Enable' },
            { id: 'two_factor_description', label: '2AF Enable Instruction' },
          ].map(({ id, label }) => {
            if (id === 'two_factor_enable') {
              const isEnabled = form[id] === '1' || form[id] === 1;
              return (
                <div key={id} className="flex flex-col">
                  <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    value={isEnabled ? 'Enabled' : 'Disabled'}
                    readOnly
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              );
            }

            if (id === 'description' || id === 'two_factor_description') {
              return (
                <div key={id} className="flex flex-col">
                  <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <textarea
                    id={id}
                    rows="3"
                    value={form[id] ?? ''}
                    onChange={handleChange}
                    readOnly
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed resize-none"
                  />
                </div>
              );
            }

            if (id === 'price') {
              return (
                <div key={id} className="flex flex-col">
                  <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                      $
                    </span>
                    <input
                      id={id}
                      type="text"
                      value={form[id] ?? ''}
                      onChange={handleChange}
                      readOnly
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-r-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              );
            }

            return (
              <div key={id} className="flex flex-col">
                <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  id={id}
                  type="text"
                  value={form[id] ?? ''}
                  onChange={handleChange}
                  readOnly
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            );
          })}

          {/* Status dropdown (only editable on edit) */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={form.status || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                !isEditing && 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
            >
              <option value="">Select Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-end">
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
                onClick={handleSave}
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

export default EditProduct;

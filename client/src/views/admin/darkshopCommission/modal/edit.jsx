import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateCategoryCommissionAPI, getDarkCategories } from '../../../../components/backendApis/admin/apis/darkshop';

const EditCommission = ({ onClose, existingData }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [commissionRate, setCommissionRate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories to resolve the name
  const fetchCategories = async () => {
    try {
      const response = await getDarkCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Pre-fill form with existing data
  useEffect(() => {
    console.log("Existing data received:", existingData);

    if (existingData) {
      // Support both camelCase and snake_case
      const catId = existingData.categoryId ?? existingData.category_id;
      const commission = existingData.commissionRate ?? existingData.commission;

      setSelectedCategory(catId || null);
      setCommissionRate(commission?.toString() || '');
    }
  }, [existingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commissionRate.toString().trim()) {
      toast.error('Please enter a commission rate');
      return;
    }

    setIsSubmitting(true);

    // Prepare payload
    const payload = {
      categoryId: selectedCategory,
      commissionRate: parseFloat(commissionRate),
    };

    // Log payload to see what is being sent
    console.log("Submitting payload:", payload);

    try {
      const response = await updateCategoryCommissionAPI(payload);

      // Log API response for debugging
      console.log("API response:", response);

      if (response.success) {
        toast.success(response.message || 'Commission updated successfully');
        if (onClose) onClose();
      } else {
        toast.error(response.message || 'Failed to update commission');
      }
    } catch (error) {
      console.error('Error updating commission:', error);
      toast.error('Error updating commission');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resolve category name from category ID
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || '';

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Category Input (Read-Only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            value={selectedCategoryName}
            disabled
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Commission Rate */}
        <div>
          <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700">
            Commission Rate (%)
          </label>
          <input
            type="number"
            id="commissionRate"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            min="0"
            step="0.01"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded ${
              isSubmitting ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Commission'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCommission;

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addCategoryCommissionAPI, getDarkCategories } from '../../../../components/backendApis/admin/apis/darkshop';

const AddCommission = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // store as number
  const [commissionRate, setCommissionRate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getDarkCategories();
      if (response.success) {
        setCategories(response.data);
        console.log('Fetched categories:', response.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || commissionRate.toString().trim() === '') {
      toast.error('Please select a category and enter a commission rate');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      categoryId: selectedCategory, // send as number
      commissionRate: parseFloat(commissionRate)
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await addCategoryCommissionAPI(payload);

      if (response.success) {
        toast.success(response.message || 'Commission added successfully');
        setSelectedCategory(null);
        setCommissionRate('');
        if (onClose) onClose();
      } else {
        toast.error(response.message || 'Failed to add commission');
      }
    } catch (error) {
      console.error('Error adding category commission:', error);
      toast.error('Error adding commission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
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
            {isSubmitting ? 'Submitting...' : 'Add Commission'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommission;

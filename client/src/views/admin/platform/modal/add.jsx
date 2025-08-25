import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addPlatform } from '../../../../components/backendApis/admin/apis/platform';

const Add = ({ onClose }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [platformName, setPlatformName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG and JPEG files are allowed');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Image size must be 2MB or less');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!platformName || !imageFile) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', platformName);
      formData.append('image', imageFile);

      const response = await addPlatform(formData);

      if (response.success || response.platformId) {
        toast.success(response.message || 'Platform added successfully');
        setPlatformName('');
        setImageFile(null);
        setImagePreview(null);
        if (onClose) onClose();
      } else {
        toast.error(response.message || 'Failed to add platform');
      }
    } catch (err) {
      toast.error('Error adding platform');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="platformName" className="block text-sm font-medium text-gray-700">
            Platform Name
          </label>
          <input
            type="text"
            id="platformName"
            name="platformName"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="platformImage" className="block text-sm font-medium text-gray-700">
            Platform Image (.png, .jpeg | Max: 2MB)
          </label>
          <input
            type="file"
            id="platformImage"
            name="image"
            accept=".png, .jpeg, .jpg"
            onChange={handleImageChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md text-sm"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-24 w-auto rounded border border-gray-300"
            />
          )}
        </div>
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
            {isSubmitting ? 'Submitting...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;

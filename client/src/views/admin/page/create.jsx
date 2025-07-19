import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPage } from '../../../components/backendApis/admin/apis/page';
import { Button } from 'flowbite-react';

const CreatePage = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const result = await createPage({ title, slug, content });

      if (result.success) {
        toast.success(result.message || 'Page created successfully!');
        setTitle('');
        setSlug('');
        setContent('');
      } else {
        // Handle validation or API errors
        if (result.errors) {
          setErrors(result.errors);
          Object.values(result.errors).forEach((msgs) => {
            msgs.forEach((msg) => toast.error(msg));
          });
        } else {
          toast.error(result.message || 'Failed to create page.');
        }
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl px-8 py-6 w-full">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-start text-gray-700">Create New Page</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter title"
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.title ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'
            }`}
            required
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            readOnly
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            placeholder="Enter description"
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.content ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'
            }`}
            required
          ></textarea>
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">{errors.content[0]}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-1 rounded-xl transition"
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;

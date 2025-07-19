import React, { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { updatePageById } from '../../../components/backendApis/admin/apis/page';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const page = location.state?.pageData;

  const [title, setTitle] = useState(page?.title || '');
  const [newSlug, setNewSlug] = useState(page?.slug || '');
  const [content, setContent] = useState(page?.content || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updatePageById(page.id, {
        title,
        slug: newSlug,
        content,
      });

      if (result.success) {
        toast.success('Page updated successfully!');
        setTimeout(() => navigate('/admin/page'), 1500);
      } else {
        toast.error(result.message || 'Update failed.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-xl px-8 py-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Page</h1>
        <NavLink to="/admin/page" className="text-gray-500 hover:underline text-sm">
          ← Back to Pages List
        </NavLink>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1 text-sm">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-sm">Slug</label>
          <input
            type="text"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-sm">Content</label>
          <textarea
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter page content..."
          ></textarea>
        </div>

        <div className="flex justify-end items-center">
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
            Update Page
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Edit;

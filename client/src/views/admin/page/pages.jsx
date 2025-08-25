// src/pages/admin/page/Pages.jsx

import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAllPages, deletePageById } from '../../../components/backendApis/admin/apis/page';
import { formatDateTime } from '../../../components/utils/formatTimeDate';
import { Button } from 'flowbite-react';
import Swal from 'sweetalert2';

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPages = async () => {
    const result = await getAllPages();
    if (result.success) {
      setPages(result.data);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await deletePageById(id);
      if (response.success) {
        setPages(pages.filter((page) => page.id !== id));
        Swal.fire('Deleted!', 'Page has been deleted.', 'success');
      } else {
        Swal.fire('Error!', response.message || 'Failed to delete.', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      Swal.fire('Error!', 'An error occurred while deleting the page.', 'error');
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl px-8 py-6 min-h-[450px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Pages</h1>
        <NavLink
          to="/admin/page/create"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          + Create Page
        </NavLink>
      </div>

      {loading && <p className="text-gray-600">Loading pages...</p>}

      {error && (
        <div className="text-red-500 border border-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && pages.length === 0 && (
        <p className="text-gray-500">No pages found.</p>
      )}

      <div className="space-y-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="border border-gray-300 rounded-md p-4 flex justify-between items-center hover:shadow transition"
          >
            <div>
              <h2 className="text-xl font-semibold">{page.title}</h2>
              <p className="text-sm text-gray-500 mb-1">{page.slug}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDateTime(page.created_at)}</p>
            </div>

            <div className="flex gap-2">
              <NavLink
                to={`/admin/page/edit`}
                state={{ pageData: page }}
              >
                <Button size="sm" className="bg-blue-700 hover:bg-blue-600 py-2">
                  Edit
                </Button>
              </NavLink>

              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-500 py-2"
                onClick={() => handleDelete(page.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pages;

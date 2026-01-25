import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  fetchDarkShopProductById,
  updateDarkShopProductAPI,
} from "../../../components/backendApis/admin/apis/darkshop";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    miniature: "",
    description: "",
  });

  const [editable, setEditable] = useState({
    name: "",
    description: "",
  });

  /* ===== FETCH PRODUCT ===== */
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchDarkShopProductById(id);

        if (!res?.success) {
          throw new Error(res?.message || "Product not found");
        }

        const data = {
          name: res.data.name || "",
          price: res.data.price || "",
          miniature: res.data.miniature || "",
          description: res.data.description || "",
        };

        setProduct(data);
        setEditable({
          name: data.name,
          description: data.description,
        });

        const text = data.description.trim();
        setWordCount(text ? text.split(/\s+/).length : 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ===== TEXTAREA CHANGE ===== */
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setEditable((prev) => ({ ...prev, description: value }));

    const text = value.trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  };

  const handleSave = async () => {
    if (!editable.name || !editable.description) {
      toast.error("Name and description are required");
      return;
    }

    setSaving(true);
    try {
      const res = await updateDarkShopProductAPI({
        id,
        name: editable.name,
        description: editable.description,
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to update product");
      }

      toast.success("Product updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="w-full bg-white rounded-lg shadow-md border p-6">
        {/* IMAGE */}
        {product.miniature ? (
          <img
            src={product.miniature}
            alt={product.name}
            className="w-full h-64 object-cover rounded-md mb-6 border"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md mb-6 border">
            No Image Available
          </div>
        )}

        {/* NAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={editable.name}
            onChange={(e) =>
              setEditable((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-2 border rounded font-medium focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* PRICE (READ ONLY) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Price
          </label>
          <p className="p-2 border rounded font-medium">${product.price}</p>
        </div>

        {/* DESCRIPTION — TEXTAREA */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>

          <textarea
            value={editable.description}
            onChange={handleDescriptionChange}
            placeholder="Write product description..."
            rows={10}
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-400"
          />

          <p className="text-xs text-gray-500 mt-2">
            Word count: <span className="font-semibold">{wordCount}</span>
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
          >
            Back
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;

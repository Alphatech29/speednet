import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import {
  fetchDarkShopProductById,
  updateDarkShopProductAPI,
} from "../../../components/backendApis/admin/apis/darkshop";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Quill editor toolbar configuration
 */
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) throw new Error("Product ID is missing");

        const res = await fetchDarkShopProductById(id);

        if (!res || !res.success) {
          throw new Error(res?.message || "Failed to load product");
        }

        const productData = {
          name: res.data.name || "",
          price: res.data.price || "",
          miniature: res.data.miniature || "",
          description: res.data.description || "",
        };

        setProduct(productData);
        setEditable({
          name: productData.name,
          description: productData.description,
        });
      } catch (err) {
        setError(err.message || "Something went wrong while loading the product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (field, value) => {
    setEditable((prev) => ({
      ...prev,
      [field]: value,
    }));
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

      setProduct((prev) => ({
        ...prev,
        name: editable.name,
        description: editable.description,
      }));

      toast.success("Product updated successfully");
    } catch (err) {
      toast.error(err.message || "Error updating product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="w-full shadow-lg bg-white rounded-lg border border-gray-200 p-6">
        {/* Product Image */}
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

        {/* Editable Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={editable.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-2 border rounded font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Price (Read-only) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Price
          </label>
          <p className="p-2 border rounded font-medium">${product.price}</p>
        </div>

        {/* ReactQuill Description Editor */}
        <div className="mb-10">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <ReactQuill
            theme="snow"
            value={editable.description}
            onChange={(value) => handleChange("description", value)}
            modules={modules}
            placeholder="Write product description..."
            className="h-[400px]"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-md border"
            disabled={saving}
          >
            Back
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded-md"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;

import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import Swal from "sweetalert2";
import {
  getDarkCategories,
  deleteCategoryAPI,
  deleteGroupAPI,
} from "../../../components/backendApis/admin/apis/darkshop";

export default function ShoppingCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const catRes = await getDarkCategories();
      if (!catRes.success) throw new Error(catRes.message);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (err) {
      setError(err.message || "Error fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category and all its sub-categories!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(categoryId);
        const res = await deleteCategoryAPI(categoryId);
        if (res.success) {
          setCategories(categories.filter((c) => c.id !== categoryId));
          Swal.fire("Deleted!", "Category has been deleted.", "success");
        } else {
          Swal.fire("Error!", res.message || "Failed to delete category.", "error");
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteGroup = async (groupId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the sub-category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(groupId);
        const res = await deleteGroupAPI(groupId);
        if (res.success) {
          setCategories(
            categories.map((cat) => ({
              ...cat,
              groups: cat.groups?.filter((g) => g.id !== groupId),
            }))
          );
          Swal.fire("Deleted!", "Sub-category has been deleted.", "success");
        } else {
          Swal.fire("Error!", res.message || "Failed to delete sub-category.", "error");
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="p-2 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Shopping Categories</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={category.id} className="bg-white shadow rounded-lg p-4 flex flex-col gap-4">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">{index + 1}.</span>
                  {category.icon && (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-8 h-8 object-contain rounded"
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")}
                    />
                  )}
                  <span className="text-lg font-semibold text-gray-800">{category.name}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-zinc-500 text-white py-1 px-2"
                    onClick={() =>
                      setOpenCategoryId(openCategoryId === category.id ? null : category.id)
                    }
                  >
                    {openCategoryId === category.id ? "Hide Groups" : "Show Groups"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 text-white py-1 px-2"
                    disabled={deletingId === category.id}
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    {deletingId === category.id ? <Spinner size="sm" /> : "Delete"}
                  </Button>
                </div>
              </div>

              {/* Groups */}
              {openCategoryId === category.id && (
                <div className="mt-2 space-y-2">
                  {category.groups && category.groups.length > 0 ? (
                    category.groups.map((group, gIndex) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded shadow-sm"
                      >
                        <span className="text-gray-700 font-medium">
                          {gIndex + 1}. {group.name}
                        </span>
                        <Button
                          size="xs"
                          className="bg-red-600 text-white py-1 px-2"
                          disabled={deletingId === group.id}
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          {deletingId === group.id ? <Spinner size="xs" /> : "Delete"}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No groups under this category.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

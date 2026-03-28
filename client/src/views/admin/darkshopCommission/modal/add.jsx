import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addCategoryCommissionAPI, getDarkCategories } from "../../../../components/backendApis/admin/apis/darkshop";
import { HiCheck, HiX } from "react-icons/hi";

const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all";

const AddCommission = ({ onClose }) => {
  const [categories, setCategories]           = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [commissionRate, setCommissionRate]   = useState("");
  const [submitting, setSubmitting]           = useState(false);

  useEffect(() => {
    getDarkCategories()
      .then((res) => { if (res?.success) setCategories(res.data); else toast.error(res?.message || "Failed to fetch categories"); })
      .catch(() => toast.error("Error fetching categories"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || commissionRate.toString().trim() === "") {
      toast.error("Please select a category and enter a commission rate"); return;
    }
    setSubmitting(true);
    try {
      const res = await addCategoryCommissionAPI({
        categoryId: Number(selectedCategory),
        commissionRate: parseFloat(commissionRate),
      });
      if (res?.success) {
        toast.success(res.message || "Commission added successfully");
        onClose?.();
      } else toast.error(res?.message || "Failed to add commission");
    } catch { toast.error("Error adding commission"); }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500">Category</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputCls} required>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500">Commission Rate (%)</label>
        <input type="number" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)}
          min="0" step="0.01" placeholder="e.g. 5.00" className={inputCls} required />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all">
          <HiX size={12} /> Cancel
        </button>
        <button type="submit" disabled={submitting}
          className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all">
          <HiCheck size={12} /> {submitting ? "Adding..." : "Add Commission"}
        </button>
      </div>
    </form>
  );
};

export default AddCommission;

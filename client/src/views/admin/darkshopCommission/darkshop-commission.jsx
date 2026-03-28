import { useEffect, useState } from "react";
import { getCategoryCommissionsAPI } from "../../../components/backendApis/admin/apis/darkshop";
import { AnimatePresence, motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiPlus, HiPencil, HiTrash, HiX } from "react-icons/hi";
import AddCommission from "./modal/add";
import EditCommission from "./modal/edit";

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{children}</th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3.5 text-sm text-gray-700 ${className}`}>{children}</td>
);

const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[1,2,3,4].map((i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-3 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${40 + (i * 15) % 45}%` }} />
      </td>
    ))}
  </tr>
);

const CategoryCommission = () => {
  const [commissions, setCommissions]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState(null);
  const [searchTerm, setSearchTerm]     = useState("");

  const fetchCommissions = () => {
    setLoading(true);
    getCategoryCommissionsAPI()
      .then((res) => { if (res?.success) setCommissions(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCommissions(); }, []);

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete commission for "${name}"? This action cannot be undone.`)) return;
    setCommissions((prev) => prev.filter((c) => c.category_id !== id));
    toast.success(`Commission for "${name}" deleted.`);
  };

  const filtered = commissions.filter((c) =>
    c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-800">Dark Shop Commissions</p>
          <p className="text-xs text-gray-400 mt-0.5">Set commission rates per dark shop category</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all">
          <HiPlus size={13} /> Add Commission
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <input type="search" placeholder="Search category..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-600/10 outline-none transition-all" />
        </div>

        <div className="overflow-x-auto admin-table-wrap">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-gray-50/60">
              <tr>
                <Th>#</Th><Th>Category Name</Th><Th>Commission Rate</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.length > 0
                  ? filtered.map((c, i) => (
                    <tr key={c.category_id} className="hover:bg-gray-50/60 transition-colors">
                      <Td className="text-gray-400 font-medium">{i + 1}</Td>
                      <Td className="font-semibold text-gray-800">{c.category_name}</Td>
                      <Td>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary-600/10 text-primary-600">
                          {c.commission}%
                        </span>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditing(c); setModalOpen(true); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary-600/10 hover:bg-primary-600/20 text-primary-600 text-xs font-bold rounded-lg transition-all">
                            <HiPencil size={11} /> Edit
                          </button>
                          <button onClick={() => handleDelete(c.category_id, c.category_name)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all">
                            <HiTrash size={11} /> Delete
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                  : (
                    <tr>
                      <td colSpan={4} className="px-4 py-16 text-center text-sm text-gray-400">
                        No commissions found.
                      </td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold text-gray-800">{editing ? "Edit Commission" : "Add Commission"}</p>
                <button onClick={() => setModalOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all">
                  <HiX size={13} />
                </button>
              </div>
              {editing
                ? <EditCommission existingData={editing} onClose={() => { setModalOpen(false); fetchCommissions(); }} />
                : <AddCommission onClose={() => { setModalOpen(false); fetchCommissions(); }} />
              }
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryCommission;

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFile } from "react-icons/fa";
import { HiPlus, HiEye } from "react-icons/hi";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { getAccountsByUserUid } from "../../../components/backendApis/accounts/accounts";
import { AuthContext } from "../../../components/control/authContext";
import CustomPagination from "../partials/CustomPagination";
import ProductDetails from "./modal/productDetails";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const statusConfig = {
  "under reviewing": {
    label: "Reviewing",
    className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50",
  },
  sold: {
    label: "Sold",
    className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  },
};

const Myproduct = () => {
  const navigate = useNavigate();
  const { user, webSettings } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const itemsPerPage = 15;

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    getAccountsByUserUid(user.uid)
      .then((result) => {
        if (result.success) {
          const sorted = result.data.sort(
            (a, b) => new Date(b.create_at) - new Date(a.create_at)
          );
          setAccounts(sorted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const paginatedAccounts = accounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currency = webSettings?.currency || "$";

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">My Products</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">
            {accounts.length} product{accounts.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <button
          onClick={() => navigate("/user/add-product")}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all"
        >
          <HiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Table card */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 dark:bg-slate-700 rounded-lg w-1/3" />
                  <div className="h-3 bg-gray-50 dark:bg-slate-800 rounded-lg w-1/4" />
                </div>
                <div className="h-6 w-16 bg-gray-100 dark:bg-slate-700 rounded-full" />
                <div className="h-8 w-14 bg-gray-100 dark:bg-slate-700 rounded-xl" />
              </div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 px-6">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
              <FaFile className="text-2xl text-gray-300 dark:text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-500 dark:text-slate-400">No products listed</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                Start selling by adding your first product
              </p>
            </div>
            <button
              onClick={() => navigate("/user/add-product")}
              className="mt-1 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-primary-600/25 transition-all"
            >
              Add Product
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-white/5">
                    {["#", "Image", "Platform", "Title", "Price", "Status", "Date", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {paginatedAccounts.map((account, index) => {
                    const s = statusConfig[account.status] || {
                      label: account.status,
                      className:
                        "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600",
                    };
                    return (
                      <motion.tr
                        key={account.id}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.25, delay: index * 0.04 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-5 py-4 text-xs text-gray-400 dark:text-slate-500 font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-5 py-4">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 flex-shrink-0">
                            <img
                              src={account.logo_url}
                              alt={account.platform}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-slate-200 whitespace-nowrap">
                          {account.platform}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-slate-300 max-w-[180px] truncate">
                          {account.title}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                          {currency}{account.price}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                          {formatDateTime(account.create_at)}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedAccount(account)}
                            className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 dark:bg-slate-700 hover:bg-primary-600 dark:hover:bg-primary-600 text-gray-600 dark:text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition-all"
                          >
                            <HiEye size={13} /> View
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {accounts.length > itemsPerPage && (
              <div className="border-t border-gray-100 dark:border-white/5 px-5 py-4">
                <CustomPagination
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Product Details Modal */}
      {selectedAccount && (
        <ProductDetails
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  );
};

export default Myproduct;

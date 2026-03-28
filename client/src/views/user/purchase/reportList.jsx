import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFile } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { getReports } from "../../../components/backendApis/purchase/collectOrder";
import { AuthContext } from "../../../components/control/authContext";
import { formatDateTime } from "../../../components/utils/formatTimeDate";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50",
  },
};

const ReportList = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    getReports()
      .then((res) => { if (res.success) setReports(res.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">My Reports</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">
          Track the status of disputes you've submitted
        </p>
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-lg w-1/3" />
                  <div className="h-2.5 bg-gray-50 dark:bg-slate-800 rounded-lg w-2/3" />
                </div>
                <div className="h-6 w-16 bg-gray-100 dark:bg-slate-700 rounded-full" />
                <div className="h-3 w-24 bg-gray-100 dark:bg-slate-700 rounded-lg" />
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 px-6">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
              <FaFile className="text-2xl text-gray-300 dark:text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-500 dark:text-slate-400">No reports found</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                Disputes you open on orders will appear here
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden tab:grid grid-cols-[40px_140px_1fr_120px_140px] gap-4 px-6 py-3.5 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-white/5">
              {["#", "Order ID", "Complaint", "Status", "Date"].map((h) => (
                <span key={h} className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {reports.map((report, index) => {
                const s = statusConfig[report.status?.toLowerCase()] || {
                  label: report.status || "Unknown",
                  className: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600",
                };
                return (
                  <motion.div
                    key={report.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="px-6 py-4"
                  >
                    {/* Desktop row */}
                    <div className="hidden tab:grid grid-cols-[40px_140px_1fr_120px_140px] gap-4 items-center">
                      <span className="text-xs font-bold text-gray-400 dark:text-slate-500">{index + 1}</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-200 truncate">
                        #{report.target_id}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-slate-400 truncate" title={report.message}>
                        {report.message}
                      </p>
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize w-fit ${s.className}`}>
                        {s.label}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                        {formatDateTime(report.created_at)}
                      </span>
                    </div>

                    {/* Mobile card */}
                    <div className="tab:hidden flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <MdReport size={15} className="text-red-500 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-800 dark:text-slate-100">
                            Order #{report.target_id}
                          </span>
                          <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${s.className}`}>
                            {s.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2">
                          {report.message}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-1">
                          {formatDateTime(report.created_at)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ReportList;

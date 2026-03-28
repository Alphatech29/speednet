import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiX } from "react-icons/hi";
import { MdReport } from "react-icons/md";
import { report } from "../../../../components/backendApis/purchase/collectOrder";

const Report = ({ defendantId, orderId, onClose }) => {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await report({
        defendant_id: defendantId,
        target_id: orderId,
        message,
      });
      if (response.success) {
        toast.success(response.message || "Report submitted successfully!");
        setTimeout(() => { setMessage(""); onClose(); }, 1000);
      } else {
        toast.error(response.message || "Failed to submit report.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <MdReport size={16} className="text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Report a Problem</h2>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Order #{orderId}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 transition-all"
              >
                <HiX size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">
                Describe the issue with this order. Our team will review your report and respond as soon as possible.
              </p>

              <div className="relative">
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 pt-6 pb-3 text-sm text-gray-800 dark:text-slate-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all resize-none"
                />
                <label className="absolute left-4 top-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wide peer-focus:text-primary-600">
                  Describe the issue
                </label>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl px-4 py-3">
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  <strong>Note:</strong> False reports may result in account suspension. Please ensure your complaint is valid.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50">
              <button
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-sm font-bold rounded-2xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !message.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-2xl shadow-md shadow-red-500/25 hover:-translate-y-0.5 transition-all"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <MdReport size={15} /> Submit Report
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Report;

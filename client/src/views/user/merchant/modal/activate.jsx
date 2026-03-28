import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiShieldCheck, HiX } from "react-icons/hi";
import { FaRocket, FaStore } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { activateAccount } from "../../../../components/backendApis/activation/merchant";
import { AuthContext } from "../../../../components/control/authContext";

const Activate = ({ onClose }) => {
  const { user, webSettings } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const currency = webSettings?.currency || "$";
  const fee = webSettings?.merchant_activation_fee || "0.00";

  const handleContinue = async () => {
    if (!user?.uid) { toast.error("User authentication failed."); return; }
    setLoading(true);
    try {
      const response = await activateAccount(user.uid);
      if (response.success) {
        toast.success(response.message);
        setTimeout(() => { window.location.href = "/user/dashboard"; }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <ToastContainer position="top-right" theme="light" />
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-secondary via-primary-100 to-slate-900 px-6 pt-8 pb-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
            >
              <HiX size={16} />
            </button>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center flex-shrink-0">
                <FaStore size={22} className="text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Become a Merchant</h3>
                <p className="text-xs text-slate-400">One-time activation to unlock seller access</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Fee highlight */}
            <div className="flex items-center justify-between bg-primary-600/5 border border-primary-600/15 rounded-2xl px-5 py-4">
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Activation Fee</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">{currency}{fee}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary-600/10 flex items-center justify-center">
                <MdVerified size={20} className="text-primary-600" />
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              This one-time payment activates your merchant account, granting full access to list and sell digital products on the Speednet marketplace with escrow protection.
            </p>

            {/* What you get */}
            <div className="flex flex-col gap-2">
              {["Full marketplace seller access", "Unlimited product listings", "Escrow protection on all sales", "Dedicated merchant dashboard"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-slate-300">
                  <HiShieldCheck size={14} className="text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5">
              <strong className="text-yellow-700">Note:</strong> {currency}{fee} will be deducted from your wallet balance.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 font-semibold text-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm"
            >
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Processing...</>
              ) : (
                <><FaRocket size={13} />Pay {currency}{fee}</>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Activate;

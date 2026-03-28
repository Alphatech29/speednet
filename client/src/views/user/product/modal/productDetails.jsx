import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiShieldCheck, HiLockClosed } from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { formatDateTime } from "../../../../components/utils/formatTimeDate";

const statusConfig = {
  "under reviewing": { label: "Reviewing", className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50" },
  approved: { label: "Approved", className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50" },
  sold: { label: "Sold", className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50" },
  rejected: { label: "Rejected", className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50" },
};

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4">
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={14} className="text-primary-600 flex-shrink-0" />}
      <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
    </div>
    {children}
  </div>
);

const DetailRow = ({ label, value, masked }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5 last:border-0">
    <span className="text-xs text-gray-400 dark:text-slate-500">{label}</span>
    <span className={`text-xs font-semibold ${masked ? "font-mono tracking-widest" : ""} text-gray-800 dark:text-slate-200`}>
      {value && value !== "N/A" ? (masked ? "••••••••" : value) : <span className="text-gray-300 dark:text-slate-600">N/A</span>}
    </span>
  </div>
);

const formatText = (text) =>
  (text || "No description available")
    .split(/\n+/)
    .map((p) => `<p style="margin-bottom:0.75rem;">${p}</p>`)
    .join("");

const ProductDetails = ({ account = null, onClose }) => {
  if (!account) return null;

  const status = statusConfig[account?.status] || {
    label: account?.status || "Unknown",
    className: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600",
  };

  return (
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
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              {account.logo_url && (
                <img
                  src={account.logo_url}
                  alt={account.platform}
                  className="w-9 h-9 rounded-2xl object-cover flex-shrink-0 border border-gray-100 dark:border-white/5"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-gray-900 dark:text-white truncate capitalize">
                  {account?.title || "N/A"}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 dark:text-slate-500">{account?.platform}</span>
                  <MdVerified size={11} className="text-blue-400" />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 transition-all flex-shrink-0 ml-3"
            >
              <HiX size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 max-h-[65vh] overflow-y-auto space-y-3">
            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800/50 rounded-2xl px-4 py-2.5">
              <span>ID: <span className="font-semibold text-gray-700 dark:text-slate-300">#{account?.id || "N/A"}</span></span>
              <span>{account?.create_at ? formatDateTime(account.create_at) : "N/A"}</span>
            </div>

            {/* Login Details */}
            <SectionCard title="Login Details" icon={HiLockClosed}>
              <DetailRow label="Email" value={account?.email} />
              <DetailRow label="Username" value={account?.username} />
              <DetailRow label="Password" value={account?.password} masked />
            </SectionCard>

            {/* Recovery Details */}
            <SectionCard title="Recovery Details" icon={HiShieldCheck}>
              <DetailRow label="Recovery Email" value={account?.recovery_email} />
              <DetailRow label="Recovery Password" value={account?.recoveryEmailpassword} masked />
            </SectionCard>

            {/* Additional Details */}
            {(account?.additionalEmail || account?.additionalPassword) && (
              <SectionCard title="Additional Details" icon={HiShieldCheck}>
                <DetailRow label="Email" value={account?.additionalEmail} />
                <DetailRow label="Password" value={account?.additionalPassword} masked />
              </SectionCard>
            )}

            {/* Description */}
            <SectionCard title="Account Description">
              <div
                className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatText(account?.description) }}
              />
            </SectionCard>

            {/* Subscription */}
            {account?.subscription_status !== undefined && (
              <SectionCard title="Subscription">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-slate-500">Status</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      account.subscription_status === "active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50"
                    }`}
                  >
                    {account.subscription_status === "active" ? "Active" : "Expired"}
                  </span>
                </div>
                {account.subscription_status === "expired" && account?.expiry_date && (
                  <DetailRow label="Expiry Date" value={account.expiry_date} />
                )}
              </SectionCard>
            )}

            {/* 2FA */}
            {account?.two_factor_enabled !== undefined && (
              <SectionCard title="Two-Factor Authentication" icon={HiShieldCheck}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 dark:text-slate-500">2FA Status</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      account.two_factor_enabled
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50"
                    }`}
                  >
                    {account.two_factor_enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                {account.two_factor_enabled && account?.two_factor_description && (
                  <div
                    className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-2 mt-1"
                    dangerouslySetInnerHTML={{ __html: formatText(account.two_factor_description) }}
                  />
                )}
              </SectionCard>
            )}

            {/* Rejection Reason */}
            {account?.status === "rejected" && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">
                  Rejection Reason
                </p>
                <div
                  className="text-xs text-red-600 dark:text-red-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatText(account?.remark) }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-sm font-bold rounded-2xl transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetails;

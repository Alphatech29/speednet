import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiLockClosed, HiShieldCheck, HiDownload } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import { formatDateTime } from "../../../../components/utils/formatTimeDate";

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4">
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={14} className="text-primary-600 flex-shrink-0" />}
      <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
    </div>
    {children}
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-1.5 border-b border-gray-100 dark:border-white/5 last:border-0">
    <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">{label}</span>
    <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 text-right break-all">
      {value || <span className="text-gray-300 dark:text-slate-600">N/A</span>}
    </span>
  </div>
);

const formatText = (text) =>
  (text || "No description available")
    .split(/\n+/)
    .map((p) => `<p style="margin-bottom:0.75rem;">${p}</p>`)
    .join("");

const OrderDetails = ({ order, onClose }) => {
  if (!order) return null;

  const handleDownload = () => {
    if (!order.darkshop_content) return;
    const blob = new Blob([order.darkshop_content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${order.order_no || "darkshop_order"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white  capitalize">
                {order?.title || "Order"} Details
              </h2>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                Order #{order?.order_no || "N/A"} · ID {order?.id || "N/A"}
              </p>
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
              <span className="font-semibold text-gray-700 dark:text-slate-300">
                {order?.order_no ? `#${order.order_no}` : "N/A"}
              </span>
              <span>{order?.create_at ? formatDateTime(order.create_at) : "N/A"}</span>
            </div>

            {/* Darkshop order */}
            {order.isDarkshop && order.darkshop_content && (
              <SectionCard title="Product Content" icon={MdDescription}>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 w-full justify-center bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-primary-600/25 transition-all mb-3"
                >
                  <HiDownload size={14} /> Download TXT File
                </button>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">
                    Content Preview
                  </p>
                  <div
                    className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed break-all bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl p-3 max-h-40 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: formatText(order.darkshop_content) }}
                  />
                </div>
              </SectionCard>
            )}

            {/* Normal order */}
            {!order.isDarkshop && (
              <>
                <SectionCard title="Login Details" icon={HiLockClosed}>
                  <DetailRow label="Email" value={order?.email} />
                  <DetailRow label="Username" value={order?.username} />
                  <DetailRow label="Password" value={order?.password} />
                </SectionCard>

                <SectionCard title="Recovery Details" icon={HiShieldCheck}>
                  <DetailRow label="Email / Username / Phone" value={order?.recovery_info} />
                  <DetailRow label="Recovery Password" value={order?.recovery_password} />
                </SectionCard>

                <SectionCard title="Account Description" icon={MdDescription}>
                  <div
                    className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(order?.description) }}
                  />
                </SectionCard>

                <SectionCard title="2FA Description" icon={HiShieldCheck}>
                  <div
                    className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(order?.factor_description) }}
                  />
                </SectionCard>
              </>
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

export default OrderDetails;

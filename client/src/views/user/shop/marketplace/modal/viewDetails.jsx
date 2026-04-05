import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiExternalLink } from "react-icons/hi";
import { HiLightningBolt } from "react-icons/hi";
import { BiPackage } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import { formatHtmlToPlainText } from "../../../../../components/utils/formatHtmlToReadableText";

const ViewDetails = ({ product, onClose }) => {
  if (!product) return null;

  const descriptionHTML = product?.description?.trim() || "<p>No description available.</p>";
  const readableDescription = formatHtmlToPlainText(descriptionHTML);

  const rawLink = product?.previewLink?.trim();
  const normalizedPreviewLink = rawLink &&
    (rawLink.startsWith("http://") || rawLink.startsWith("https://") ? rawLink : `https://${rawLink}`);

  const isDarkshop = product.store === "darkshop";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              {product.icon && (
                <img src={product.icon} alt="" className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.style.display = "none"; }} />
              )}
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white capitalize">{product.name}</h2>
                <p className="text-xs text-gray-400 dark:text-slate-500">{product.platform}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-all flex-shrink-0 ml-3"
            >
              <HiX size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            {/* Image */}
            {product.image && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800/50">
                <img src={product.image} alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.parentElement.style.display = "none"; }} />
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.instant_delivery && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full">
                  <HiLightningBolt size={11} /> Instant Delivery
                </span>
              )}
              {isDarkshop && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  Advanced
                </span>
              )}
              {product.stock_quantity != null && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-3 py-1 rounded-full">
                  <BiPackage size={11} /> {product.stock_quantity} in stock
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Description</p>
              <pre className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                {readableDescription}
              </pre>
            </div>

            {/* Preview link */}
            {normalizedPreviewLink && (
              <a href={normalizedPreviewLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors">
                <HiExternalLink size={15} /> Preview Product
              </a>
            )}

            {/* Seller */}
            {product.seller && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-white/5">
                {product.avatar && (
                  <img src={product.avatar} alt={product.seller}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                    onError={(e) => { e.target.style.display = "none"; }} />
                )}
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Seller</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{product.seller}</p>
                    <MdVerified size={13} className="text-blue-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50">
            <span className="text-xl font-extrabold text-gray-900 dark:text-white">${product.price}</span>
            <button onClick={onClose}
              className="px-5 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-sm font-semibold rounded-2xl transition-all">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewDetails;

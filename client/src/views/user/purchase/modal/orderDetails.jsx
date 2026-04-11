import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX, HiLockClosed, HiShieldCheck, HiDownload, HiClipboardCopy, HiCheck, HiClock,
} from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import { formatDateTime } from "../../../../components/utils/formatTimeDate";

/* ── tiny copy-button ─────────────────────────────────────── */
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <button
      onClick={handle}
      title="Copy"
      className="ml-2 flex-shrink-0 text-gray-400 hover:text-primary-600 transition-colors"
    >
      {copied ? <HiCheck size={13} className="text-green-500" /> : <HiClipboardCopy size={13} />}
    </button>
  );
};

/* ── section wrapper ─────────────────────────────────────── */
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4">
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={14} className="text-primary-600 flex-shrink-0" />}
      <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
    </div>
    {children}
  </div>
);

/* ── plain detail row (normal orders) ───────────────────── */
const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-1.5 border-b border-gray-100 dark:border-white/5 last:border-0">
    <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">{label}</span>
    <div className="flex items-center min-w-0">
      <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 text-right break-all">
        {value || <span className="text-gray-300 dark:text-slate-600">N/A</span>}
      </span>
      {value && <CopyBtn text={value} />}
    </div>
  </div>
);

/* ── parse darkshop content ──────────────────────────────── */
// Handles two formats:
//   1. "key: value" labeled lines  → e.g. "Login: foo@bar.com"
//   2. "a:b:c:d" combo lines       → login:password:email:email_password
const COMBO_LABELS = ["Login", "Password", "Email", "Email Password"];

const parseContent = (text) => {
  if (!text) return { isParsed: false, pairs: [], raw: "" };
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const pairs = [];

  for (const line of lines) {
    // Format 1: labeled "key: value"
    const labeled = line.match(/^([^:]+):\s+(.+)$/);
    if (labeled) {
      pairs.push({ key: labeled[1].trim(), value: labeled[2].trim() });
      continue;
    }

    // Format 2: bare colon-separated combo (no spaces around colons)
    const parts = line.split(":");
    if (parts.length >= 2) {
      parts.forEach((part, i) => {
        pairs.push({ key: COMBO_LABELS[i] ?? `Field ${i + 1}`, value: part.trim() });
      });
      continue;
    }

    // Plain line — no label
    pairs.push({ key: null, value: line });
  }

  const isParsed = pairs.length > 0 && pairs.every((p) => p.key !== null);
  return { isParsed, pairs, raw: text };
};

/* ── darkshop content block ──────────────────────────────── */
const DarkshopContent = ({ order }) => {
  const { isParsed, pairs, raw } = parseContent(order.darkshop_content);

  const handleDownload = () => {
    const blob = new Blob([raw], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.order_no || "order"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // No content yet
  if (!order.darkshop_content) {
    return (
      <SectionCard title="Product Content" icon={MdDescription}>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <HiClock size={18} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-slate-300">Content Pending</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
              Your order is being processed. Check back shortly.
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Product Content" icon={MdDescription}>
      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 flex-1 justify-center bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm shadow-primary-600/25 transition-all"
        >
          <HiDownload size={14} /> Download .txt
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(raw)}
          className="flex items-center gap-2 px-4 justify-center bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all"
          title="Copy all"
        >
          <HiClipboardCopy size={14} /> Copy All
        </button>
      </div>

      {/* Parsed key:value view */}
      {isParsed ? (
        <div className="divide-y divide-gray-100 dark:divide-white/5 rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          {pairs.map(({ key, value }, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white dark:bg-slate-800/80 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 w-28 flex-shrink-0 truncate">
                {key}
              </span>
              <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
                <span className="text-xs font-semibold text-gray-800 dark:text-slate-100 break-all text-right">
                  {value || <span className="text-gray-300 dark:text-slate-600">—</span>}
                </span>
                {value && <CopyBtn text={value} />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Raw text fallback */
        <pre className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-all bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl p-3 max-h-52 overflow-y-auto font-mono">
          {raw}
        </pre>
      )}
    </SectionCard>
  );
};

/* ── main modal ──────────────────────────────────────────── */
const OrderDetails = ({ order, onClose }) => {
  if (!order) return null;

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
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white capitalize">
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
            {/* Meta strip */}
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800/50 rounded-2xl px-4 py-2.5">
              <span className="font-semibold text-gray-700 dark:text-slate-300">
                {order?.order_no ? `#${order.order_no}` : "N/A"}
              </span>
              <span>{order?.create_at ? formatDateTime(order.create_at) : "N/A"}</span>
            </div>

            {/* Darkshop order */}
            {order.isDarkshop && <DarkshopContent order={order} />}

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

                {order?.description && (
                  <SectionCard title="Account Description" icon={MdDescription}>
                    <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {order.description}
                    </p>
                  </SectionCard>
                )}

                {order?.factor_description && (
                  <SectionCard title="2FA Details" icon={HiShieldCheck}>
                    <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {order.factor_description}
                    </p>
                  </SectionCard>
                )}
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

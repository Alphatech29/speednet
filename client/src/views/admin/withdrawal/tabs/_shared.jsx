import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { HiBuildingLibrary, HiDevicePhoneMobile } from "react-icons/hi2";
import { FaBitcoin } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";

/* ── Fade-up variant ──────────────────────────────────────────── */
export const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Avatar ───────────────────────────────────────────────────── */
const COLORS = [
  "bg-violet-100 text-violet-600", "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600", "bg-orange-100 text-orange-600",
  "bg-rose-100 text-rose-600", "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600", "bg-indigo-100 text-indigo-600",
];
export const Avatar = ({ name = "", size = "md" }) => {
  const color = COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  const dim   = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${dim} ${color} rounded-full flex items-center justify-center font-extrabold flex-shrink-0`}>
      {name.charAt(0).toUpperCase() || "?"}
    </div>
  );
};

/* ── Method badge ─────────────────────────────────────────────── */
const METHOD_MAP = {
  Bank:   { color: "bg-blue-50 text-blue-700 border-blue-100",       icon: HiBuildingLibrary   },
  Crypto: { color: "bg-purple-50 text-purple-700 border-purple-100", icon: FaBitcoin           },
  MOMO:   { color: "bg-sky-50 text-sky-700 border-sky-100",          icon: HiDevicePhoneMobile },
};
export const MethodBadge = ({ method }) => {
  const cfg  = METHOD_MAP[method] || { color: "bg-gray-100 text-gray-600 border-gray-200", icon: HiBuildingLibrary };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold ${cfg.color}`}>
      <Icon size={9} /> {method || "—"}
    </span>
  );
};

/* ── Status badge ─────────────────────────────────────────────── */
const STATUS_MAP = {
  pending:   { color: "bg-amber-50 text-amber-700 border-amber-100",       icon: MdOutlinePendingActions },
  completed: { color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: HiCheckCircle           },
  rejected:  { color: "bg-red-50 text-red-700 border-red-100",             icon: HiXCircle               },
};
export const StatusBadge = ({ status }) => {
  const cfg  = STATUS_MAP[status] || STATUS_MAP.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold capitalize ${cfg.color}`}>
      <Icon size={9} /> {status}
    </span>
  );
};

/* ── Detail row ───────────────────────────────────────────────── */
export const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-semibold text-gray-400 flex-shrink-0 w-28">{label}</span>
    <span className="text-xs font-bold text-gray-800 text-right break-all min-w-0">{value || "—"}</span>
  </div>
);

/* ── Withdrawal modal ─────────────────────────────────────────── */
export const WithdrawalModal = ({ withdrawal, onClose, onApprove, onReject, approvingId, rejectingId }) => {
  if (!withdrawal) return null;
  const { method }  = withdrawal;
  const isPending   = typeof onApprove === "function";
  const isApproving = approvingId === withdrawal.id;
  const isRejecting = rejectingId === withdrawal.id;
  const busy        = isApproving || isRejecting;

  /* Status color for amount */
  const amountColor = withdrawal.status === "completed" ? "text-emerald-600"
                    : withdrawal.status === "rejected"  ? "text-red-500"
                    : "text-amber-600";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end tab:items-center justify-center">

        {/* ── Backdrop ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* ── Sheet / Dialog ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 48 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 bg-white w-full tab:max-w-md tab:mx-4
                     rounded-t-3xl tab:rounded-2xl shadow-2xl
                     flex flex-col max-h-[92vh] tab:max-h-[88vh]"
        >
          {/* Gradient accent */}
          <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent flex-shrink-0" />

          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 tab:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* ── Fixed header ── */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={withdrawal.full_name} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-gray-900 truncate leading-tight">
                  {withdrawal.full_name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <StatusBadge status={withdrawal.status} />
                  <MethodBadge method={method} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all flex-shrink-0 ml-2"
            >
              <HiX size={15} />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain">

            {/* Amount hero */}
            <div className="px-5 pt-5 pb-4 text-center border-b border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Withdrawal Amount
              </p>
              <p className={`text-4xl font-extrabold leading-tight ${amountColor}`}>
                ${Number(withdrawal.amount).toLocaleString()}
              </p>
            </div>

            {/* Details card */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Payment Details
              </p>
              <div className="bg-gray-50 rounded-2xl px-4 py-1 border border-gray-100">
                <DetailRow label="Method" value={method} />

                {method === "Bank" && <>
                  <DetailRow label="Account Name"   value={withdrawal.account_name} />
                  <DetailRow label="Account Number" value={withdrawal.account_number} />
                  <DetailRow label="Bank Name"      value={withdrawal.bank_name} />
                </>}

                {method === "Crypto" && <>
                  <DetailRow label="Coin"           value={withdrawal.coin_name} />
                  <DetailRow label="Wallet Address" value={withdrawal.wallet_address} />
                  <DetailRow label="Network"        value={withdrawal.wallet_network} />
                </>}

                {method === "MOMO" && (
                  <DetailRow label="MOMO Number" value={withdrawal.momo_number} />
                )}
              </div>
            </div>

            {/* Timestamps */}
            {(withdrawal.created_at || withdrawal.updated_at) && (
              <div className="px-5 pb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Timeline
                </p>
                <div className="bg-gray-50 rounded-2xl px-4 py-1 border border-gray-100">
                  {withdrawal.created_at && (
                    <DetailRow
                      label="Requested"
                      value={new Date(withdrawal.created_at).toLocaleString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    />
                  )}
                  {withdrawal.updated_at && withdrawal.status !== "pending" && (
                    <DetailRow
                      label={withdrawal.status === "completed" ? "Approved" : "Rejected"}
                      value={new Date(withdrawal.updated_at).toLocaleString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Fixed footer: actions ── */}
          <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4">
            {isPending ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(withdrawal.id)} disabled={busy}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-emerald-600/20"
                  >
                    {isApproving
                      ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Approving…</>
                      : <><HiCheckCircle size={16} /> Approve</>
                    }
                  </button>
                  <button
                    onClick={() => onReject(withdrawal.id)} disabled={busy}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-red-500/20"
                  >
                    {isRejecting
                      ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Rejecting…</>
                      : <><HiXCircle size={16} /> Reject</>
                    }
                  </button>
                </div>
                <button
                  onClick={onClose} disabled={busy}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-600 text-sm font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all"
              >
                Close
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ── Empty state ──────────────────────────────────────────────── */
export const EmptyState = ({ message = "No withdrawals found.", icon: Icon = MdOutlinePendingActions }) => (
  <div className="flex flex-col items-center gap-3 py-16 px-4">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
      <Icon size={24} className="text-gray-300" />
    </div>
    <p className="text-sm text-gray-400 text-center">{message}</p>
  </div>
);

import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsBank2 } from "react-icons/bs";
import { RiBtcFill } from "react-icons/ri";
import { SiStarlingbank } from "react-icons/si";
import { BiSolidMobileVibration } from "react-icons/bi";
import { FiCopy } from "react-icons/fi";
import {
  HiX,
  HiCheck,
  HiChevronRight,
  HiExclamationCircle,
  HiInformationCircle,
} from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../../components/control/authContext";
import { payWithCryptomus } from "../../../../components/backendApis/cryptomus/cryptomus";

/* ── Payment method definitions ── */
const METHODS = [
  {
    id: "fapshi",
    label: "MOMO Deposit",
    desc: "Fund your wallet via Mobile Money.",
    Icon: BiSolidMobileVibration,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    id: "cryptomus",
    label: "Crypto Deposit",
    desc: "Fund securely with USDT or other crypto.",
    Icon: RiBtcFill,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    id: "monnify",
    label: "Bank / Card Payment",
    desc: "Pay via online bank transfer or debit card.",
    Icon: BsBank2,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: "online",
    label: "Manual Bank Transfer",
    desc: "Transfer manually and submit your receipt.",
    Icon: SiStarlingbank,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
];

/* ── Bank Transfer Popup ── */
const BankTransferPopup = ({ nairaAmount, onClose }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() =>
      toast.success("Account number copied!")
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <SiStarlingbank size={15} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 dark:text-white">Bank Transfer</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Manual deposit instructions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 transition-all"
          >
            <HiX size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Amount highlight */}
          <div className="bg-primary-600/8 dark:bg-primary-600/15 border border-primary-600/20 rounded-2xl px-4 py-3">
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Amount to transfer</p>
            <p className="text-xl font-extrabold text-primary-600">₦{Number(nairaAmount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
          </div>

          {/* Bank details */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Bank Details</p>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl divide-y divide-gray-100 dark:divide-white/5 overflow-hidden">
              {[
                { label: "Bank", value: "Jaiz Bank" },
                { label: "Account Name", value: "GABRIEL EJEH ITODO" },
                { label: "SWIFT Code", value: "JAIZNGLA" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-400 dark:text-slate-500">{label}</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{value}</span>
                </div>
              ))}
              {/* Account number with copy */}
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-400 dark:text-slate-500">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200">0020538891</span>
                  <button
                    onClick={() => handleCopy("0020538891")}
                    className="w-6 h-6 rounded-lg bg-primary-600/10 hover:bg-primary-600/20 flex items-center justify-center text-primary-600 transition-all"
                    title="Copy account number"
                  >
                    <FiCopy size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Important note */}
          <div className="bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-700/40 rounded-2xl px-4 py-3">
            <div className="flex gap-2">
              <HiExclamationCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Include your <span className="font-bold">Speednet username or email</span> in the transfer remark so we can confirm your payment quickly.
              </p>
            </div>
          </div>

          {/* Telegram note */}
          <div className="bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-700/40 rounded-2xl px-4 py-3">
            <div className="flex gap-2">
              <HiInformationCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                After transfer,{" "}
                <a
                  href="https://t.me/bobcarly888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-primary-600 hover:text-primary-700"
                >
                  submit your receipt on Telegram
                </a>{" "}
                for instant confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-600/25 transition-all"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Deposit Modal ── */
const Deposit = ({ onClose }) => {
  const { user, webSettings } = useContext(AuthContext);
  const [selected, setSelected]         = useState(null);
  const [amount, setAmount]             = useState("");
  const [loading, setLoading]           = useState(false);
  const [showBankPopup, setShowBankPopup] = useState(false);

  const nairaRate    = parseFloat(webSettings?.naira_rate || 0);
  const numericAmount = parseFloat(amount) || 0;
  const nairaAmount  = (numericAmount * nairaRate).toFixed(2);
  const hasAmount    = numericAmount > 0;
  const hasMethod    = !!selected;

  const handleContinue = async () => {
    if (!hasAmount) { toast.error("Please enter a valid amount."); return; }
    if (!hasMethod) { toast.error("Please select a payment method."); return; }
    if (numericAmount <= 0) { toast.error("Amount must be greater than 0."); return; }

    if (selected === "online") {
      setShowBankPopup(true);
      return;
    }

    if (!user?.uid) {
      toast.error("User authentication failed. Please log in again.");
      return;
    }

    const currency = selected === "cryptomus" ? "USDT" : "USD";
    const payload  = {
      user_id: String(user.uid),
      email: String(user.email),
      amount: numericAmount.toFixed(2),
      paymentMethod: selected,
      currency,
    };

    setLoading(true);
    try {
      const response = await payWithCryptomus(payload);
      if (response.success && response.data?.payment_url) {
        toast.success(response.message || "Redirecting to payment...");
        window.location.href = response.data.payment_url;
      } else {
        toast.error(response.message || "Failed to initiate payment.");
      }
    } catch {
      toast.error("An error occurred during payment processing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      {/* Main modal backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-600 to-orange-500 px-6 py-5 overflow-hidden flex-shrink-0">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                  Wallet Funding
                </p>
                <h2 className="text-lg font-extrabold text-white">Deposit Funds</h2>
                <p className="text-xs text-white/70 mt-0.5">
                  Choose a payment method to top up
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
              >
                <HiX size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Amount input */}
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">
                Amount (USD)
              </p>
              <div
                className={`flex items-center bg-gray-50 dark:bg-slate-800 border-2 rounded-2xl transition-all overflow-hidden ${
                  amount ? "border-primary-600" : "border-gray-200 dark:border-slate-700"
                } focus-within:border-primary-600`}
              >
                <span className="pl-4 pr-2 text-lg font-bold text-gray-400 dark:text-slate-500 select-none">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={loading}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent pr-4 py-3.5 text-base font-bold text-gray-800 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-600 focus:outline-none"
                />
              </div>
              {/* Naira equivalent */}
              <AnimatePresence>
                {hasAmount && nairaRate > 0 && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-primary-600 font-semibold mt-1.5 pl-1"
                  >
                    ≈ ₦{Number(nairaAmount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Payment methods */}
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">
                Payment Method
              </p>
              <div className="space-y-2.5">
                {METHODS.map(({ id, label, desc, Icon, color, bg }) => {
                  const isSelected = selected === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelected(id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary-600 bg-primary-600/5 dark:bg-primary-600/10 shadow-sm"
                          : "border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-primary-600/40"
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${isSelected ? "text-primary-600" : "text-gray-800 dark:text-slate-200"}`}>
                          {label}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                          {desc}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-primary-600 bg-primary-600"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <HiCheck size={11} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info note */}
            <div className="bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800/40 rounded-2xl px-4 py-3">
              <div className="flex gap-2">
                <HiInformationCircle size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                  Crypto deposits are in USDT. Bank and MOMO deposits are processed in USD equivalent.
                </p>
              </div>
            </div>
          </div>

          {/* Footer action */}
          <div className="flex-shrink-0 px-5 pb-5 pt-3 border-t border-gray-100 dark:border-white/5 flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-sm font-bold rounded-2xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={loading || !hasAmount || !hasMethod}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-600/25 transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>Continue <HiChevronRight size={15} /></>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Bank Transfer nested popup */}
      <AnimatePresence>
        {showBankPopup && (
          <BankTransferPopup
            nairaAmount={nairaAmount}
            onClose={() => setShowBankPopup(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Deposit;

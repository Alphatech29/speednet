import { useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../../../components/control/authContext";
import { purchaseAirtime } from "../../../../components/backendApis/vtu/vtuService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiLockClosed, HiX } from "react-icons/hi";
import { FaSquarePhone } from "react-icons/fa6";

const NETWORK_PREFIXES = {
  mtn:     ["0803","0806","0703","0706","0810","0813","0814","0816","0903","0906","0913","0916"],
  glo:     ["0805","0807","0705","0811","0815","0905"],
  airtel:  ["0802","0808","0708","0812","0902","0907","0901","0912"],
  "9mobile":["0809","0817","0818","0908","0909"],
};

const NETWORK_OPTIONS = [
  { name: "MTN",     value: "mtn",     logo: "/image/mtn.png" },
  { name: "GLO",     value: "glo",     logo: "/image/Globacom.jpg" },
  { name: "Airtel",  value: "airtel",  logo: "/image/airtel.jpeg" },
  { name: "9Mobile", value: "9mobile", logo: "/image/9Mobile.jpg" },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const detectNetwork = (number) => {
  const prefix = number?.substring(0, 4);
  for (const [net, prefixes] of Object.entries(NETWORK_PREFIXES)) {
    if (prefixes.includes(prefix)) return NETWORK_OPTIONS.find((n) => n.value === net);
  }
  return null;
};

/* ── Floating label input ── */
const FloatInput = ({ id, label, type = "text", value, onChange, placeholder = " ", rightSlot }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      className="peer w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 pt-5 pb-2.5 text-sm text-gray-800 dark:text-slate-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide pointer-events-none transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wide peer-focus:text-primary-600"
    >
      {label}
    </label>
    {rightSlot && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
    )}
  </div>
);

const AirtimeTab = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [network, setNetwork]   = useState(NETWORK_OPTIONS[0]);
  const [phone, setPhone]       = useState("");
  const [amount, setAmount]     = useState("");
  const [pin, setPin]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const firstPinRef = useRef(null);
  const successAudio = new Audio("/success.mp3");

  const dollarBalance = parseFloat(user?.account_balance || 0);
  const nairaRate     = parseFloat(webSettings?.naira_rate || 0);
  const nairaBalance  = (dollarBalance * nairaRate).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  /* auto-detect network from phone prefix */
  useEffect(() => {
    if (phone.length >= 4) {
      const detected = detectNetwork(phone);
      if (detected && detected.value !== network.value) setNetwork(detected);
    }
  }, [phone]);

  /* focus first pin box when modal opens */
  useEffect(() => {
    if (showPinModal) {
      setPin("");
      setTimeout(() => firstPinRef.current?.focus(), 120);
    }
  }, [showPinModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{11}$/.test(phone)) { toast.error("Phone number must be exactly 11 digits."); return; }
    if (Number(amount) < 100)    { toast.error("Minimum amount is ₦100"); return; }
    setShowPinModal(true);
  };

  const handleConfirmPurchase = async () => {
    setShowPinModal(false);
    setLoading(true);
    try {
      const res = await purchaseAirtime({ phone, amount: Number(amount), type: network.value, pin });
      if (res.success) {
        successAudio.play().catch(() => {});
        toast.success(res.message || "Airtime purchased successfully!");
        setPhone(""); setAmount("");
      } else {
        toast.error(res.message || "Airtime purchase failed.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setPin("");
    }
  };

  const isPinComplete = pin.length === 4 && /^\d{4}$/.test(pin);

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      {/* Full-screen loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl">
              <svg className="animate-spin w-10 h-10 text-primary-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-sm font-bold text-gray-700 dark:text-slate-200">Processing purchase...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Balance card */}
        <div className="bg-gradient-to-br from-primary-600 to-orange-500 rounded-3xl p-5 flex items-center gap-4">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30 flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <FaSquarePhone size={22} className="text-white" />
            </div>
          )}
          <div>
            <p className="text-xs text-white/70 font-medium">Available Balance</p>
            <p className="text-2xl font-extrabold text-white">₦{nairaBalance}</p>
            {user?.full_name && <p className="text-xs text-white/70 mt-0.5">{user.full_name}</p>}
          </div>
        </div>

        {/* Network selector */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-4">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">Select Network</p>
          <div className="grid grid-cols-4 gap-2">
            {NETWORK_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNetwork(opt)}
                className={`flex flex-col items-center gap-2 py-3 rounded-2xl border-2 transition-all ${
                  network.value === opt.value
                    ? "border-primary-600 bg-primary-600/10 dark:bg-primary-600/20 shadow-sm"
                    : "border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-primary-600/40"
                }`}
              >
                <img src={opt.logo} alt={opt.name} className="w-8 h-8 rounded-xl object-cover" />
                <span className={`text-[10px] font-bold ${
                  network.value === opt.value
                    ? "text-primary-600"
                    : "text-gray-500 dark:text-slate-400"
                }`}>{opt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form fields card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-4 space-y-4">
          {/* Phone */}
          <FloatInput
            id="phone"
            label="Phone Number *"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            rightSlot={
              phone.length >= 4 && detectNetwork(phone) ? (
                <img
                  src={detectNetwork(phone)?.logo}
                  alt=""
                  className="w-6 h-6 rounded-lg object-cover"
                />
              ) : null
            }
          />

          {/* Amount */}
          <FloatInput
            id="amount"
            label="Amount (₦) *"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Quick amounts */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Quick Top-Up</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    String(amount) === String(amt)
                      ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20"
                      : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary-600/40"
                  }`}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm"
        >
          <FaSquarePhone size={15} /> Buy Airtime
        </button>
      </form>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPinModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* PIN header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center">
                    <HiLockClosed size={15} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">Enter PIN</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Confirm ₦{Number(amount).toLocaleString()} to {network.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 transition-all"
                >
                  <HiX size={15} />
                </button>
              </div>

              {/* PIN inputs */}
              <div className="px-6 py-6">
                <div className="flex justify-center gap-3 mb-6">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`apin-${i}`}
                      type="password"
                      maxLength={1}
                      value={pin[i] || ""}
                      ref={i === 0 ? firstPinRef : null}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d?$/.test(val)) {
                          const arr = pin.split("");
                          arr[i] = val;
                          setPin(arr.join(""));
                          if (val) document.getElementById(`apin-${i + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !pin[i] && i > 0)
                          document.getElementById(`apin-${i - 1}`)?.focus();
                      }}
                      className="w-14 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-slate-800 border-2 rounded-2xl text-gray-900 dark:text-white transition-all focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
                      style={{ borderColor: pin[i] ? "#E46300" : undefined }}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPinModal(false)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-sm font-bold rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPurchase}
                    disabled={!isPinComplete}
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-600/25 transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AirtimeTab;

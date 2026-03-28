import { useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../../../components/control/authContext";
import { purchaseData, fetchDataVariations } from "../../../../components/backendApis/vtu/vtuService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiLockClosed, HiX, HiSearch, HiCheck, HiChevronDown } from "react-icons/hi";
import { FaWifi } from "react-icons/fa6";

const NETWORK_PREFIXES = {
  mtn:      ["0803","0806","0703","0706","0810","0813","0814","0816","0903","0906","0913","0916"],
  glo:      ["0805","0807","0705","0811","0815","0905"],
  airtel:   ["0802","0808","0708","0812","0902","0907","0901","0912"],
  "9mobile":["0809","0817","0818","0908","0909"],
};

const NETWORK_OPTIONS = [
  { name: "MTN",     value: "mtn-data",     logo: "/image/mtn.png" },
  { name: "GLO",     value: "glo-data",     logo: "/image/Globacom.jpg" },
  { name: "Airtel",  value: "airtel-data",  logo: "/image/airtel.jpeg" },
  { name: "9Mobile", value: "9mobile-data", logo: "/image/9Mobile.jpg" },
];

const detectNetwork = (number) => {
  const prefix = number?.substring(0, 4);
  for (const [net, prefixes] of Object.entries(NETWORK_PREFIXES)) {
    if (prefixes.includes(prefix)) return NETWORK_OPTIONS.find((n) => n.value.includes(net));
  }
  return null;
};

/* ── Floating label input ── */
const FloatInput = ({ id, label, type = "text", value, onChange, rightSlot }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
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

const DataTab = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [network, setNetwork]                   = useState(NETWORK_OPTIONS[0]);
  const [phone, setPhone]                       = useState("");
  const [amount, setAmount]                     = useState("");
  const [pin, setPin]                           = useState("");
  const [loading, setLoading]                   = useState(false);
  const [showPinModal, setShowPinModal]         = useState(false);
  const [dataVariations, setDataVariations]     = useState([]);
  const [variationsLoading, setVariationsLoading] = useState(false);
  const [selectedVariationCode, setSelectedVariationCode] = useState("");
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const [planSearch, setPlanSearch] = useState("");
  const firstPinRef = useRef(null);
  const planDropdownRef = useRef(null);
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

  /* fetch data plans when network changes */
  useEffect(() => {
    const load = async () => {
      setVariationsLoading(true);
      setDataVariations([]);
      setSelectedVariationCode("");
      setAmount("");
      try {
        const result = await fetchDataVariations(network.value);
        if (result.success) setDataVariations(result.data.variations || []);
        else toast.error(result.message || "Failed to load data plans");
      } catch {
        toast.error("Failed to load data plans");
      } finally {
        setVariationsLoading(false);
      }
    };
    load();
  }, [network]);

  /* sync amount from selected variation */
  useEffect(() => {
    const sel = dataVariations.find((v) => v.variation_code === selectedVariationCode);
    if (sel?.variation_amount) setAmount(String(sel.variation_amount));
  }, [selectedVariationCode, dataVariations]);

  /* focus first pin box when modal opens */
  useEffect(() => {
    if (showPinModal) {
      setPin("");
      setTimeout(() => firstPinRef.current?.focus(), 120);
    }
  }, [showPinModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{11}$/.test(phone))   { toast.error("Phone number must be exactly 11 digits."); return; }
    if (!selectedVariationCode)    { toast.error("Please select a data plan."); return; }
    setShowPinModal(true);
  };

  const handleConfirmPurchase = async () => {
    const selected = dataVariations.find((v) => v.variation_code === selectedVariationCode);
    if (!selected) { toast.error("Data plan not found."); return; }
    setShowPinModal(false);
    setLoading(true);
    try {
      const res = await purchaseData({
        phone,
        amount: Number(amount),
        serviceID: network.value,
        variation_code: selected.variation_code,
        pin,
      });
      if (res.success) {
        successAudio.play().catch(() => {});
        toast.success(res.message || "Data purchased successfully!");
        setPhone(""); setAmount(""); setSelectedVariationCode("");
      } else {
        toast.error(res.message || "Data purchase failed.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setPin("");
    }
  };

  /* close plan dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (planDropdownRef.current && !planDropdownRef.current.contains(e.target))
        setPlanDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isPinComplete = pin.length === 4 && /^\d{4}$/.test(pin);

  const selectedVariation = dataVariations.find((v) => v.variation_code === selectedVariationCode);

  const filteredVariations = dataVariations.filter((v) =>
    v.name.toLowerCase().includes(planSearch.toLowerCase())
  );

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
              <FaWifi size={22} className="text-white" />
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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            rightSlot={
              phone.length >= 4 && detectNetwork(phone) ? (
                <img src={detectNetwork(phone)?.logo} alt="" className="w-6 h-6 rounded-lg object-cover" />
              ) : null
            }
          />

          {/* Data plan custom dropdown */}
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide block mb-2">
              Data Plan *
            </label>

            {variationsLoading ? (
              <div className="flex items-center gap-2 h-11 px-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
                <svg className="animate-spin w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-xs text-gray-400 dark:text-slate-500">Loading plans...</span>
              </div>
            ) : (
              <div className="relative" ref={planDropdownRef}>
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setPlanDropdownOpen((v) => !v)}
                  className={`w-full flex items-center justify-between gap-3 bg-white dark:bg-slate-800 border rounded-xl px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary-600/30 ${
                    planDropdownOpen
                      ? "border-primary-600 ring-2 ring-primary-600/20"
                      : "border-gray-200 dark:border-slate-700 hover:border-primary-600/50"
                  }`}
                >
                  {selectedVariation ? (
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">
                        {selectedVariation.name}
                      </p>
                      <p className="text-xs font-bold text-primary-600 mt-0.5">
                        ₦{Number(selectedVariation.variation_amount).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-slate-500">Select a data plan</span>
                  )}
                  <HiChevronDown
                    size={16}
                    className={`text-gray-400 dark:text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                      planDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {planDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-30 mt-1.5 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col"
                      style={{ maxHeight: "280px" }}
                    >
                      {/* Search */}
                      <div className="p-2.5 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
                        <div className="relative">
                          <HiSearch
                            size={13}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
                          />
                          <input
                            type="text"
                            value={planSearch}
                            onChange={(e) => setPlanSearch(e.target.value)}
                            placeholder="Search plans..."
                            autoFocus
                            className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
                          />
                        </div>
                      </div>

                      {/* Options */}
                      <div className="overflow-y-auto">
                        {filteredVariations.length === 0 ? (
                          <p className="px-4 py-4 text-xs text-gray-400 dark:text-slate-500 text-center">
                            No plans match &ldquo;{planSearch}&rdquo;
                          </p>
                        ) : (
                          filteredVariations.map((v) => (
                            <button
                              key={v.variation_code}
                              type="button"
                              onClick={() => {
                                setSelectedVariationCode(v.variation_code);
                                setAmount(String(v.variation_amount));
                                setPlanDropdownOpen(false);
                                setPlanSearch("");
                              }}
                              className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                                selectedVariationCode === v.variation_code
                                  ? "bg-primary-600/10 dark:bg-primary-600/15"
                                  : "hover:bg-gray-50 dark:hover:bg-slate-700/50"
                              }`}
                            >
                              <span className="text-sm text-gray-800 dark:text-slate-200 truncate">
                                {v.name}
                              </span>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs font-bold text-primary-600">
                                  ₦{Number(v.variation_amount).toLocaleString()}
                                </span>
                                {selectedVariationCode === v.variation_code && (
                                  <HiCheck size={13} className="text-primary-600" />
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Amount (read-only, filled from selection) */}
          <FloatInput
            id="amount"
            label="Amount (₦)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Quick data plans */}
          {dataVariations.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Quick Select</p>
              <div className="flex flex-wrap gap-2">
                {dataVariations.slice(0, 8).map((v) => (
                  <button
                    key={v.variation_code}
                    type="button"
                    onClick={() => { setSelectedVariationCode(v.variation_code); setAmount(String(v.variation_amount)); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      selectedVariationCode === v.variation_code
                        ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20"
                        : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary-600/40"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm"
        >
          <FaWifi size={15} /> Buy Data
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
                    <p className="text-xs text-gray-400 dark:text-slate-500 truncate max-w-[180px]">
                      {selectedVariation?.name || "Data"} · {network.name} · {phone}
                    </p>
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
                      id={`dpin-${i}`}
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
                          if (val) document.getElementById(`dpin-${i + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !pin[i] && i > 0)
                          document.getElementById(`dpin-${i - 1}`)?.focus();
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

export default DataTab;

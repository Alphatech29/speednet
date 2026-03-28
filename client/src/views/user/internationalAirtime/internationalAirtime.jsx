import { useContext, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../../components/control/authContext";
import {
  fetchInternationalAirtimeCountries,
  fetchInternationalProductTypes,
  fetchInternationalOperators,
  fetchInternationalVariations,
  internationalPurchase,
} from "../../../components/backendApis/vtu/vtuService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiLockClosed, HiX, HiSearch, HiCheck, HiChevronDown } from "react-icons/hi";
import { MdPublic } from "react-icons/md";
import { FaGlobeAmericas } from "react-icons/fa";

/* ── Floating label input ── */
const FloatInput = ({ id, label, type = "text", value, onChange, disabled, placeholder = " " }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete="off"
      className="peer w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 pt-5 pb-2.5 text-sm text-gray-800 dark:text-slate-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide pointer-events-none transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wide peer-focus:text-primary-600"
    >
      {label}
    </label>
  </div>
);

/* ── Generic searchable dropdown ── */
const SearchableDropdown = ({
  label, placeholder = "Select…", value, onChange,
  options, getKey, getLabel, renderOption, renderSelected,
  loading, loadingText = "Loading…", emptyText = "No options available",
  searchable = true,
}) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = searchable
    ? options.filter((o) => getLabel(o).toLowerCase().includes(search.toLowerCase()))
    : options;

  const selected = options.find((o) => getKey(o) === value);

  return (
    <div className="w-full">
      <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => !loading && setOpen((v) => !v)}
          className={`w-full flex items-center justify-between gap-3 bg-white dark:bg-slate-800 border rounded-xl px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary-600/30 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          } ${
            open
              ? "border-primary-600 ring-2 ring-primary-600/20"
              : "border-gray-200 dark:border-slate-700 hover:border-primary-600/50"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-sm text-gray-400 dark:text-slate-500">{loadingText}</span>
            </div>
          ) : selected ? (
            <div className="flex-1 min-w-0">{renderSelected ? renderSelected(selected) : (
              <span className="text-sm text-gray-800 dark:text-slate-200 truncate">{getLabel(selected)}</span>
            )}</div>
          ) : (
            <span className="text-sm text-gray-400 dark:text-slate-500">{placeholder}</span>
          )}
          <HiChevronDown
            size={16}
            className={`text-gray-400 dark:text-slate-500 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-40 mt-1.5 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col"
              style={{ maxHeight: "280px" }}
            >
              {searchable && (
                <div className="p-2.5 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
                  <div className="relative">
                    <HiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search…"
                      autoFocus
                      className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
                    />
                  </div>
                </div>
              )}
              <div className="overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-4 py-4 text-xs text-gray-400 dark:text-slate-500 text-center">
                    {search ? `No results for "${search}"` : emptyText}
                  </p>
                ) : (
                  filtered.map((o) => (
                    <button
                      key={getKey(o)}
                      type="button"
                      onClick={() => { onChange(getKey(o)); setOpen(false); setSearch(""); }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                        value === getKey(o)
                          ? "bg-primary-600/10 dark:bg-primary-600/15"
                          : "hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        {renderOption ? renderOption(o) : (
                          <span className="text-sm text-gray-800 dark:text-slate-200 truncate">{getLabel(o)}</span>
                        )}
                      </div>
                      {value === getKey(o) && <HiCheck size={13} className="text-primary-600 flex-shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const InternationalAirtime = () => {
  const { user, webSettings } = useContext(AuthContext);

  const [countries, setCountries]               = useState([]);
  const [selectedCountry, setSelectedCountry]   = useState(null);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const [productTypes, setProductTypes]           = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [loadingProductTypes, setLoadingProductTypes] = useState(false);

  const [operators, setOperators]               = useState([]);
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [loadingOperators, setLoadingOperators] = useState(false);

  const [variations, setVariations]               = useState([]);
  const [selectedVariation, setSelectedVariation] = useState("");
  const [loadingVariations, setLoadingVariations] = useState(false);

  const [phone, setPhone]   = useState("");
  const [email, setEmail]   = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin]       = useState("");
  const [loading, setLoading]           = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const firstPinRef = useRef(null);
  const successAudio = new Audio("/success.mp3");

  const dollarBalance = parseFloat(user?.account_balance || 0);
  const nairaRate     = parseFloat(webSettings?.naira_rate || 0);
  const nairaBalance  = (dollarBalance * nairaRate).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  /* load countries */
  useEffect(() => {
    const load = async () => {
      setLoadingCountries(true);
      try {
        const result = await fetchInternationalAirtimeCountries();
        if (result.success) {
          setCountries(result.countries);
          setSelectedCountry(result.countries[0] || null);
        } else {
          toast.error(result.message || "Failed to fetch countries");
        }
      } catch {
        toast.error("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };
    load();
  }, []);

  /* load product types when country changes */
  useEffect(() => {
    if (!selectedCountry?.code) return;
    setProductTypes([]);
    setSelectedProductType("");
    setOperators([]);
    setSelectedOperatorId("");
    setVariations([]);
    setSelectedVariation("");

    const load = async () => {
      setLoadingProductTypes(true);
      try {
        const result = await fetchInternationalProductTypes(selectedCountry.code);
        if (result.success) {
          setProductTypes(result.productTypes);
          setSelectedProductType(result.productTypes[0]?.product_type_id || "");
        }
      } catch {
        /* silent */
      } finally {
        setLoadingProductTypes(false);
      }
    };
    load();
  }, [selectedCountry]);

  /* load operators when product type changes */
  useEffect(() => {
    if (!selectedProductType || !selectedCountry?.code) return;
    setOperators([]);
    setSelectedOperatorId("");
    setVariations([]);
    setSelectedVariation("");

    const load = async () => {
      setLoadingOperators(true);
      try {
        const result = await fetchInternationalOperators(selectedCountry.code, selectedProductType);
        if (result?.success) {
          const list = result.operators || [];
          setOperators(list);
          setSelectedOperatorId(list[0]?.operator_id || "");
        } else {
          toast.error(result?.message || "Failed to fetch operators");
        }
      } catch {
        /* silent */
      } finally {
        setLoadingOperators(false);
      }
    };
    load();
  }, [selectedProductType, selectedCountry?.code]);

  /* load variations when operator changes */
  useEffect(() => {
    if (!selectedOperatorId || !selectedProductType) return;
    setVariations([]);
    setSelectedVariation("");

    const load = async () => {
      setLoadingVariations(true);
      try {
        const result = await fetchInternationalVariations(selectedOperatorId, selectedProductType);
        if (result.success) {
          setVariations(result.variations);
          setSelectedVariation(result.variations[0]?.variation_code || "");
        }
      } catch {
        /* silent */
      } finally {
        setLoadingVariations(false);
      }
    };
    load();
  }, [selectedOperatorId, selectedProductType]);

  /* sync amount from fixed-price variation */
  useEffect(() => {
    const sel = variations.find((v) => v.variation_code === selectedVariation);
    if (sel?.fixedPrice === "Yes" && sel?.variation_amount) {
      setAmount(sel.variation_amount.toString());
    } else if (!sel) {
      setAmount("");
    }
  }, [selectedVariation, variations]);

  /* focus first pin box when modal opens */
  useEffect(() => {
    if (showPinModal) {
      setPin("");
      setTimeout(() => firstPinRef.current?.focus(), 120);
    }
  }, [showPinModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCountry)     return toast.error("Select a country");
    if (!selectedProductType) return toast.error("Select a product type");
    if (!selectedOperatorId)  return toast.error("Select an operator");
    if (!selectedVariation)   return toast.error("Select a variation");
    if (!phone)               return toast.error("Enter a phone number");
    if (!/^\d+$/.test(phone)) return toast.error("Phone number must contain only digits");
    if (!amount)              return toast.error("Enter an amount");
    if (!/^\d*\.?\d+$/.test(amount)) return toast.error("Amount must be a valid number");
    if (Number(amount) < 1)   return toast.error("Minimum amount is ₦1");
    setShowPinModal(true);
  };

  const handleConfirmPurchase = async () => {
    setShowPinModal(false);
    setLoading(true);
    try {
      const res = await internationalPurchase({
        phone:         Number(phone),
        amount:        Number(amount),
        countryCode:   selectedCountry.code,
        productTypeId: selectedProductType,
        variationCode: selectedVariation,
        operatorId:    selectedOperatorId,
        pin,
        email,
      });
      if (res.success) {
        successAudio.play().catch(() => {});
        toast.success(res.message || "Airtime sent successfully!");
        setPhone(""); setAmount(""); setEmail("");
      } else {
        toast.error(res.message || "Purchase failed.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during purchase");
    } finally {
      setLoading(false);
      setPin("");
    }
  };

  const isPinComplete  = pin.length === 4 && /^\d{4}$/.test(pin);
  const isFixedPrice   = variations.find((v) => v.variation_code === selectedVariation)?.fixedPrice === "Yes";
  const selectedVarObj = variations.find((v) => v.variation_code === selectedVariation);
  const selectedOp     = operators.find((o) => o.operator_id === selectedOperatorId);

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
              <p className="text-sm font-bold text-gray-700 dark:text-slate-200">Processing purchase…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">International Top-Up</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">
            Send airtime, data &amp; PINs worldwide
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Balance card */}
          <div className="bg-gradient-to-br from-primary-600 to-orange-500 rounded-3xl p-5 flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30 flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <FaGlobeAmericas size={22} className="text-white" />
              </div>
            )}
            <div>
              <p className="text-xs text-white/70 font-medium">Available Balance</p>
              <p className="text-2xl font-extrabold text-white">₦{nairaBalance}</p>
              {user?.full_name && <p className="text-xs text-white/70 mt-0.5">{user.full_name}</p>}
            </div>
          </div>

          {/* Selection card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-4 space-y-4">

            {/* Country */}
            <SearchableDropdown
              label="Country"
              placeholder="Select a country"
              value={selectedCountry?.code || ""}
              onChange={(code) => setSelectedCountry(countries.find((c) => c.code === code) || null)}
              options={countries}
              getKey={(c) => c.code}
              getLabel={(c) => c.name}
              loading={loadingCountries}
              loadingText="Loading countries…"
              emptyText="No countries available"
              renderSelected={(c) => (
                <div className="flex items-center gap-2">
                  <img src={c.flag} alt="" className="w-5 h-5 rounded-sm object-cover flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{c.name}</span>
                </div>
              )}
              renderOption={(c) => (
                <div className="flex items-center gap-2">
                  <img src={c.flag} alt="" className="w-5 h-5 rounded-sm object-cover flex-shrink-0" />
                  <span className="text-sm text-gray-800 dark:text-slate-200">{c.name}</span>
                </div>
              )}
            />

            {/* Product type — pill tabs (usually 2–4 options) */}
            {(loadingProductTypes || productTypes.length > 0) && (
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Product Type</p>
                {loadingProductTypes ? (
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-9 w-24 rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {productTypes.map((pt) => (
                      <button
                        key={pt.product_type_id}
                        type="button"
                        onClick={() => setSelectedProductType(pt.product_type_id)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                          selectedProductType === pt.product_type_id
                            ? "border-primary-600 bg-primary-600/10 dark:bg-primary-600/20 text-primary-600"
                            : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:border-primary-600/40"
                        }`}
                      >
                        {pt.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Operator */}
            {selectedProductType && (
              <SearchableDropdown
                label="Operator"
                placeholder="Select an operator"
                value={selectedOperatorId}
                onChange={setSelectedOperatorId}
                options={operators}
                getKey={(o) => o.operator_id}
                getLabel={(o) => o.name}
                loading={loadingOperators}
                loadingText="Loading operators…"
                emptyText="No operators available"
                renderSelected={(o) => (
                  <div className="flex items-center gap-2">
                    {o.logo && <img src={o.logo} alt="" className="w-6 h-6 rounded-lg object-cover flex-shrink-0" />}
                    <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{o.name}</span>
                  </div>
                )}
                renderOption={(o) => (
                  <div className="flex items-center gap-2">
                    {o.logo && <img src={o.logo} alt="" className="w-5 h-5 rounded-md object-cover flex-shrink-0" />}
                    <span className="text-sm text-gray-800 dark:text-slate-200">{o.name}</span>
                  </div>
                )}
              />
            )}

            {/* Variation */}
            {selectedOperatorId && (
              <SearchableDropdown
                label="Plan / Variation"
                placeholder="Select a plan"
                value={selectedVariation}
                onChange={setSelectedVariation}
                options={variations}
                getKey={(v) => v.variation_code}
                getLabel={(v) => v.name}
                loading={loadingVariations}
                loadingText="Loading plans…"
                emptyText="No plans available"
                renderSelected={(v) => (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{v.name}</p>
                    <p className="text-xs font-bold text-primary-600 mt-0.5">
                      ₦{Number(v.charged_amount || v.variation_amount || 0).toLocaleString()}
                    </p>
                  </div>
                )}
                renderOption={(v) => (
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="text-sm text-gray-800 dark:text-slate-200 truncate">{v.name}</span>
                    <span className="text-xs font-bold text-primary-600 flex-shrink-0">
                      ₦{Number(v.charged_amount || v.variation_amount || 0).toLocaleString()}
                    </span>
                  </div>
                )}
              />
            )}
          </div>

          {/* Recipient details card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-4 space-y-4">
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Recipient Details</p>

            <FloatInput
              id="phone"
              label="Phone Number (with country code) *"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />

            <FloatInput
              id="email"
              label="Email Address (optional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Amount */}
            <div className="relative">
              <FloatInput
                id="amount"
                label={isFixedPrice ? "Amount (₦) — Fixed" : "Amount (₦) *"}
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                disabled={isFixedPrice}
              />
              {isFixedPrice && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary-600 bg-primary-600/10 px-2 py-0.5 rounded-lg">
                  Fixed
                </span>
              )}
            </div>
          </div>

          {/* Order summary (shown once all selected) */}
          {selectedCountry && selectedVarObj && (
            <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3">
              <MdPublic size={16} className="text-primary-600 flex-shrink-0" />
              <div className="flex-1 min-w-0 text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-gray-700 dark:text-slate-300">{selectedCountry.name}</span>
                {selectedOp && <> · {selectedOp.name}</>}
                {" · "}{selectedVarObj.name}
              </div>
              <span className="text-sm font-extrabold text-primary-600 flex-shrink-0">
                ₦{Number(selectedVarObj.charged_amount || selectedVarObj.variation_amount || 0).toLocaleString()}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm"
          >
            <FaGlobeAmericas size={15} /> Send International Top-Up
          </button>
        </form>
      </div>

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
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center">
                    <HiLockClosed size={15} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">Enter PIN</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">
                      Confirm ₦{Number(amount).toLocaleString()} · {selectedCountry?.name}
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
                      id={`ipin-${i}`}
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
                          if (val) document.getElementById(`ipin-${i + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !pin[i] && i > 0)
                          document.getElementById(`ipin-${i - 1}`)?.focus();
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

export default InternationalAirtime;

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeft, HiSearch, HiX } from "react-icons/hi";
import { FaPhone } from "react-icons/fa";
import { useTheme } from "../../../components/control/themeContext";
import {
  getSmsPoolCountries,
  getSmsPoolServicesByCountry,
  buySmsPoolNumber,
} from "../../../components/backendApis/sms-service/sms-service";
import ServiceLogo from "./ServiceLogo";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const Spinner = ({ size = 4 }) => (
  <svg className={`animate-spin w-${size} h-${size}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const GetNumber = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [buyingServiceId, setBuyingServiceId] = useState(null);
  const [error, setError] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
      borderColor: state.isFocused ? "#E46300" : isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb",
      borderRadius: "0.75rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(228,99,0,0.2)" : "none",
      minHeight: "44px",
      "&:hover": { borderColor: "#E46300" },
    }),
    singleValue: (base) => ({ ...base, color: isDark ? "#e2e8f0" : "#111827" }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
      borderRadius: "0.75rem",
      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#E46300"
        : state.isFocused
        ? isDark ? "rgba(228,99,0,0.15)" : "#fff7ed"
        : "transparent",
      color: state.isSelected ? "#ffffff" : isDark ? "#e2e8f0" : "#111827",
      cursor: "pointer",
    }),
    placeholder: (base) => ({ ...base, color: isDark ? "#64748b" : "#9ca3af" }),
    dropdownIndicator: (base) => ({ ...base, color: "#E46300" }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb",
    }),
    input: (base) => ({ ...base, color: isDark ? "#e2e8f0" : "#111827" }),
  };

  const fetchCountries = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getSmsPoolCountries();
      if (result?.success && Array.isArray(result.data)) {
        const options = result.data
          .map((c) => ({
            value: String(c.ID),
            label: c.name,
            alphaCode: c.short_name ? String(c.short_name).toLowerCase() : null,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(options);
        const defaultCountry = options.find((c) => c.label === "USA") || options[0];
        setSelectedCountry(defaultCountry);
        if (defaultCountry) fetchServices(Number(defaultCountry.value));
      } else {
        throw new Error("No countries found");
      }
    } catch (err) {
      const errMsg = err.message || "Error fetching countries";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (countryId) => {
    setServiceLoading(true);
    setServiceSearch("");
    setError("");
    try {
      const result = await getSmsPoolServicesByCountry(Number(countryId));
      setServices(Array.isArray(result) ? result : []);
    } catch (err) {
      setServices([]);
      const errMsg = err.message || "Error fetching services";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => { fetchCountries(); }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    fetchServices(Number(country.value));
  };

  const handleBuyNumber = async (service) => {
    setBuyingServiceId(service.ID);
    try {
      const payload = {
        service: service.ID,               // string code e.g. "tg"
        country: Number(selectedCountry.value),
        price: Number(service.price),
      };
      const response = await buySmsPoolNumber(payload);
      if (response?.success) {
        toast.success(response.message || "Number purchased successfully");
        setTimeout(() => navigate("/user/sms-service"), 1000);
      } else {
        toast.error(response.message || "Failed to buy number");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBuyingServiceId(null);
    }
  };

  const POPULAR_ORDER = [
    "whatsapp", "telegram", "google", "facebook", "instagram",
    "twitter", "x", "tiktok", "snapchat", "discord", "uber", "lyft",
    "amazon", "netflix", "spotify", "microsoft", "yahoo", "outlook",
    "paypal", "linkedin", "viber", "signal", "reddit", "twitch",
  ];

  const getPopularityRank = (name) => {
    const key = name.toLowerCase().split(/[\s_\-(]/)[0];
    const idx = POPULAR_ORDER.indexOf(key);
    return idx === -1 ? Infinity : idx;
  };

  const filteredServices = services
    .filter((service) => service.name.toLowerCase().includes(serviceSearch.toLowerCase()))
    .sort((a, b) => {
      // When searching, don't reorder — keep API order
      if (serviceSearch) return 0;
      return getPopularityRank(a.name) - getPopularityRank(b.name);
    });

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-primary-600/20 text-primary-600 dark:text-primary-400 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <ToastContainer position="top-right" theme="colored" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <NavLink
          to="/user/sms-service"
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-600 dark:text-slate-300 transition-all"
        >
          <HiArrowLeft size={16} />
        </NavLink>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Get SMS Number</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">
            Receive a one-time SMS verification code
          </p>
        </div>
      </div>

      {/* Step indicators */}
      {!loading && !error && (
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
              1
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Choose Country</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700 max-w-[40px]" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              selectedCountry
                ? "bg-primary-600 text-white"
                : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500"
            }`}>
              2
            </div>
            <span className={`text-sm font-semibold transition-colors ${
              selectedCountry
                ? "text-gray-700 dark:text-slate-300"
                : "text-gray-400 dark:text-slate-500"
            }`}>
              Select Service
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm p-16 flex flex-col items-center gap-4">
          <Spinner size={8} />
          <p className="text-sm text-gray-400 dark:text-slate-500">Loading countries...</p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm p-16 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <FaPhone className="text-2xl text-red-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-700 dark:text-slate-300">Failed to load</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchCountries}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-primary-600/25 transition-all"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Sticky filter bar */}
          <div className="sticky top-0 z-10 bg-gray-50 dark:bg-slate-950 pb-3 pt-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm p-4"
            >
              <div className="flex flex-col tab:flex-row gap-3">
                {/* Country */}
                <div className="tab:w-56 flex-shrink-0">
                  <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Country
                  </label>
                  <Select
                    options={countries}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Select country..."
                    isSearchable
                    styles={selectStyles}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center gap-2">
                        {option.alphaCode && (
                          <img
                            src={`https://flagcdn.com/h40/${option.alphaCode}.png`}
                            alt={option.label}
                            className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <span className="text-sm">{option.label}</span>
                      </div>
                    )}
                  />
                </div>

                {/* Search */}
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Search Service
                  </label>
                  <div className="relative">
                    <HiSearch
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. WhatsApp, Google, Telegram..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="w-full h-11 pl-10 pr-9 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
                    />
                    <AnimatePresence>
                      {serviceSearch && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setServiceSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                        >
                          <HiX size={15} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Count badge */}
                {!serviceLoading && services.length > 0 && (
                  <div className="tab:self-end flex-shrink-0">
                    <div className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-300">
                        {filteredServices.length}
                        <span className="font-normal text-gray-400 dark:text-slate-500">
                          {serviceSearch ? ` of ${services.length}` : ""} service{filteredServices.length !== 1 ? "s" : ""}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Services grid */}
          {serviceLoading ? (
            <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl p-4 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-xl flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-3/4 mb-2" />
                      <div className="h-3 bg-gray-50 dark:bg-slate-800 rounded-lg w-1/2" />
                    </div>
                    <div className="h-6 w-16 bg-gray-100 dark:bg-slate-700 rounded-lg" />
                  </div>
                  <div className="h-9 bg-gray-100 dark:bg-slate-700 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-3">
              {filteredServices.map((service, i) => {
                const isPopular = !serviceSearch && getPopularityRank(service.name) !== Infinity;
                return (
                <motion.div
                  key={service.ID}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                  className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl p-4 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {/* Service info row */}
                  <div className="flex items-center gap-3 mb-4">
                    <ServiceLogo name={service.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-gray-800 dark:text-slate-100 capitalize truncate">
                          {highlightText(service.name, serviceSearch)}
                        </p>
                        {isPopular && (
                          <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary-600/10 text-primary-600 dark:text-primary-400">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {selectedCountry?.alphaCode && (
                          <img
                            src={`https://flagcdn.com/h20/${selectedCountry.alphaCode}.png`}
                            alt={selectedCountry.label}
                            className="w-4 h-3 rounded-sm object-cover"
                          />
                        )}
                        <span className="text-xs text-gray-400 dark:text-slate-500 truncate">
                          {selectedCountry?.label}
                        </span>
                        {service.count > 0 && (
                          <span className="text-[10px] text-gray-400 dark:text-slate-600">
                            · {service.count} left
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {service.price != null ? (
                        <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                          ${parseFloat(service.price).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">
                          N/A
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buy button */}
                  <button
                    onClick={() => handleBuyNumber(service)}
                    disabled={!!buyingServiceId || service.price == null}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 rounded-xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all"
                  >
                    {buyingServiceId === service.ID ? (
                      <>
                        <Spinner size={4} />
                        Purchasing...
                      </>
                    ) : (
                      <>
                        <FaPhone size={12} />
                        Get Number
                      </>
                    )}
                  </button>
                </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm p-16 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <HiSearch size={24} className="text-gray-300 dark:text-slate-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400">No services found</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  {serviceSearch
                    ? `No results for "${serviceSearch}" — try a different keyword`
                    : "No services available for this country"}
                </p>
              </div>
              {serviceSearch && (
                <button
                  onClick={() => setServiceSearch("")}
                  className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GetNumber;

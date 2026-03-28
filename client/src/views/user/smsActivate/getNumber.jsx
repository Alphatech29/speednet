import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeft, HiSearch } from "react-icons/hi";
import { FaPhone } from "react-icons/fa";
import { useTheme } from "../../../components/control/themeContext";
import {
  getSmsPoolCountries,
  getSmsPoolServicesByCountry,
  buySmsPoolNumber,
} from "../../../components/backendApis/sms-service/sms-service";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

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
            alphaCode: String(c.short_name).toLowerCase(),
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(options);
        const defaultCountry = options.find((c) => c.value === "1") || options[0];
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
        service: Number(service.ID),
        country: Number(selectedCountry.value),
        pool: service.pool,
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

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

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
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">Choose a country and service</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm p-16 flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
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
          {/* Filters */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm p-5 mb-5"
          >
            <div className="flex flex-col tab:flex-row gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2 block">
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
                      <img
                        src={`https://flagcdn.com/h40/${option.alphaCode}.png`}
                        alt={option.label}
                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2 block">
                  Search Service
                </label>
                <div className="relative">
                  <HiSearch
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="e.g. WhatsApp, Google..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Services grid */}
          {serviceLoading ? (
            <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-5 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-2xl" />
                    <div className="h-5 w-12 bg-gray-100 dark:bg-slate-700 rounded-lg" />
                  </div>
                  <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-3/4 mb-2" />
                  <div className="h-3 bg-gray-50 dark:bg-slate-800 rounded-lg w-1/2 mb-4" />
                  <div className="h-9 bg-gray-100 dark:bg-slate-700 rounded-2xl w-full" />
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-3">
              {filteredServices.map((service, i) => (
                <motion.div
                  key={service.ID}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-5 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-primary-600 text-sm" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                      ${parseFloat(service.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-800 dark:text-slate-100 capitalize flex-1">
                    {highlightText(service.name, serviceSearch)}
                  </p>

                  <div className="flex items-center gap-2 mt-2 mb-4">
                    {selectedCountry?.alphaCode && (
                      <img
                        src={`https://flagcdn.com/h20/${selectedCountry.alphaCode}.png`}
                        alt={selectedCountry.label}
                        className="w-4 h-3 rounded-sm object-cover"
                      />
                    )}
                    <span className="text-xs text-gray-400 dark:text-slate-500">{selectedCountry?.label}</span>
                    <span className="ml-auto text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">
                      Pool: {service.pool}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyNumber(service)}
                    disabled={!!buyingServiceId}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all"
                  >
                    {buyingServiceId === service.ID ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Buying...
                      </>
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm p-16 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <HiSearch size={24} className="text-gray-300 dark:text-slate-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400">No services found</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  Try a different search term or select another country
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GetNumber;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhone, FaRegClock, FaCopy } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { ImCancelCircle } from "react-icons/im";
import { HiPlus } from "react-icons/hi";
import { MdRefresh } from "react-icons/md";
import {
  getSmsServiceByUserId,
} from "../../../components/backendApis/sms-service/sms-service";
import ServiceLogo, { getCountryFlag } from "./ServiceLogo";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const statusConfig = {
  0: { label: "Pending", className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50" },
  1: { label: "Received", className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50" },
  2: { label: "Expired", className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50" },
};

const formatCountdown = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
};

const SmsActivate = () => {
  const navigate = useNavigate();
  const [smsMessages, setSmsMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countdowns, setCountdowns] = useState({});

  const fetchSmsMessages = async () => {
    setLoading(true);
    try {
      const res = await getSmsServiceByUserId();
      if (res.success && Array.isArray(res.data)) {
        setSmsMessages(res.data);
        localStorage.setItem("smsMessages", JSON.stringify(res.data));
      } else {
        setSmsMessages([]);
        localStorage.removeItem("smsMessages");
      }
    } catch (err) {
      console.error("Error fetching SMS messages:", err);
      toast.error(err.message || "Failed to fetch SMS messages");
      setSmsMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedSms = localStorage.getItem("smsMessages");
    if (cachedSms) setSmsMessages(JSON.parse(cachedSms));
    fetchSmsMessages();
    const interval = setInterval(fetchSmsMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sync countdowns to server time whenever messages update
  useEffect(() => {
    setCountdowns(() => {
      const updated = {};
      smsMessages.forEach((sms) => {
        if (sms.status === 0 && sms.time) {
          const now = Math.floor(Date.now() / 1000);
          const remaining = Number(sms.time) - now;
          updated[String(sms.orderid)] = remaining > 0 ? remaining : 0;
        }
      });
      return updated;
    });
  }, [smsMessages]);

  // Stable tick — never re-created, just decrements existing values
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = {};
        Object.entries(prev).forEach(([id, remaining]) => {
          updated[String(id)] = remaining > 0 ? remaining - 1 : 0;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text) => {
    if (!text) return toast.error("Nothing to copy");
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return isNaN(d) ? "N/A" : d.toLocaleString();
  };

  const formatUnix = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(Number(timestamp) * 1000).toLocaleTimeString(undefined, {
      hour: "2-digit", minute: "2-digit",
    });
  };


  const stats = [
    {
      label: "Active Numbers",
      value: smsMessages.filter((m) => m.status === 0).length,
      icon: FaPhone,
      iconBg: "bg-blue-500",
      cardBg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-100 dark:border-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Received",
      value: smsMessages.filter((m) => m.status === 1).length,
      icon: AiFillMessage,
      iconBg: "bg-emerald-500",
      cardBg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending",
      value: smsMessages.filter((m) => m.status === 0).length,
      icon: FaRegClock,
      iconBg: "bg-amber-500",
      cardBg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Expired",
      value: smsMessages.filter((m) => m.status === 2).length,
      icon: ImCancelCircle,
      iconBg: "bg-red-500",
      cardBg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-100 dark:border-red-500/20",
      text: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <ToastContainer position="top-right" theme="colored" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">SMS Activation</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">Manage your virtual numbers</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSmsMessages}
            disabled={loading}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-slate-400 transition-all disabled:opacity-50"
          >
            <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => navigate("/user/get-number")}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all"
          >
            <HiPlus size={16} /> Get Number
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 pc:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`${stat.cardBg} border ${stat.border} rounded-3xl px-4 py-4 flex items-center gap-3`}
          >
            <div className={`${stat.iconBg} w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <stat.icon className="text-white text-[16px]" />
            </div>
            <div className="min-w-0">
              <p className={`text-2xl font-extrabold ${stat.text}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Messages list */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, delay: 0.25 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Recent Numbers</p>
          {loading && (
            <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Refreshing...
            </span>
          )}
        </div>

        {smsMessages.length === 0 && !loading ? (
          <div className="flex flex-col items-center gap-4 py-16 px-6">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
              <FaPhone className="text-2xl text-gray-300 dark:text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-500 dark:text-slate-400">No active numbers</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                Purchase a number to receive SMS verifications
              </p>
            </div>
            <button
              onClick={() => navigate("/user/get-number")}
              className="mt-1 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-primary-600/25 transition-all"
            >
              Get a Number
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {smsMessages.map((sms, idx) => {
              const flagUrl = getCountryFlag(sms?.country);
              const countdown = countdowns[String(sms.orderid)];
              const isLocallyExpired = sms.status === 0 && countdown === 0 && sms.time;
              const effectiveStatus = isLocallyExpired ? 2 : sms.status;
              const statusCfg = statusConfig[effectiveStatus] ?? statusConfig[0];

              return (
                <motion.div
                  key={sms.id || idx}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="px-6 py-4"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <ServiceLogo name={sms?.service || "unknown"} />
                      <div>
                        <p className="text-base font-extrabold text-gray-900 dark:text-white tracking-wide">
                          +{sms?.number || "N/A"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {flagUrl && (
                            <img
                              src={flagUrl}
                              alt={sms?.country}
                              className="w-4 h-3 rounded-sm object-cover flex-shrink-0"
                            />
                          )}
                          <span className="text-xs text-gray-400 dark:text-slate-500 truncate">
                            {sms?.service || "Unknown"}
                          </span>
                          {sms?.country && (
                            <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">
                              · {sms.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Status content */}
                  {effectiveStatus === 1 ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl p-3">
                      <p className="text-xs text-green-700 dark:text-green-400 font-semibold mb-2">
                        SMS received! Your verification code is ready.
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-slate-400">Code:</span>
                          <code className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-xl tracking-widest">
                            {sms?.code || "N/A"}
                          </code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(sms?.code)}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/30 transition-all"
                        >
                          <FaCopy size={10} /> Copy Code
                        </button>
                      </div>
                    </div>
                  ) : effectiveStatus === 2 ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl p-3 flex items-center gap-3">
                      <ImCancelCircle className="text-red-500 text-lg flex-shrink-0" />
                      <p className="text-xs text-red-600 dark:text-red-400">
                        This number has expired and can no longer receive SMS.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <BsClockHistory className="text-amber-500 text-lg animate-pulse flex-shrink-0" />
                        <div>
                          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                            Waiting for SMS...
                          </p>
                          <p className="text-sm font-extrabold text-amber-600 dark:text-amber-300 tabular-nums mt-0.5">
                            {formatCountdown(countdown)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(sms?.number)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all"
                      >
                        <FaCopy size={10} /> Copy Number
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-gray-400 dark:text-slate-600">Ordered: {formatDate(sms?.created_at)}</p>
                    {sms?.time && <p className="text-[10px] text-gray-400 dark:text-slate-600">Expires: {formatUnix(sms.time)}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SmsActivate;

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhone, FaRegClock, FaCopy } from "react-icons/fa";
import { FcExpired } from "react-icons/fc";
import { ImCancelCircle } from "react-icons/im";
import { AiFillMessage } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import {
  getSmsServiceByUserId,
  getSmsPoolCountries,
} from "../../../components/backendApis/sms-service/sms-service";

const getStatusBadge = (status) => {
  switch (status) {
    case 1:
      return (
        <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded">
          Used
        </span>
      );
    case 0:
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs rounded">
          Pending
        </span>
      );
    case 2:
      return (
        <span className="bg-red-100 text-red-800 px-2 py-0.5 text-xs rounded">
          Expired
        </span>
      );
    default:
      return null;
  }
};

// format countdown seconds -> mm:ss
const formatCountdown = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const SmsActivate = () => {
  const [smsMessages, setSmsMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [countries, setCountries] = useState([]);

  const errorNotify = (msg) => toast.error(msg);

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
      errorNotify(err.message || "Failed to fetch SMS messages");
      setSmsMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      // load from cache if available
      const cached = localStorage.getItem("smsCountries");
      if (cached) {
        setCountries(JSON.parse(cached));
        return;
      }

      const res = await getSmsPoolCountries();
      if (res.success && Array.isArray(res.data)) {
        setCountries(res.data);
        localStorage.setItem("smsCountries", JSON.stringify(res.data));
      } else {
        setCountries([]);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
      errorNotify(err.message || "Failed to fetch countries");
      setCountries([]);
    }
  };

  useEffect(() => {
    const cachedSms = localStorage.getItem("smsMessages");
    if (cachedSms) setSmsMessages(JSON.parse(cachedSms));

    fetchSmsMessages();
    const interval = setInterval(fetchSmsMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchCountries();
  }, []);

  // countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(() => {
        const updated = {};
        smsMessages.forEach((sms) => {
          if (sms.status === 0 && sms.time) {
            const now = Math.floor(Date.now() / 1000);
            const expireAt = Number(sms.time);
            const remaining = expireAt - now;
            updated[sms.orderid] = remaining > 0 ? remaining : 0;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [smsMessages]);

  const copyToClipboard = (text) => {
    if (!text) return errorNotify("Nothing to copy");
    try {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Clipboard error:", err);
      errorNotify("Failed to copy text");
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleString() : "N/A";

  const getCountryShortName = (country) => {
    if (!country || countries.length === 0) return null;
    const match = countries.find(
      (c) =>
        c.name?.toLowerCase() === country?.toLowerCase() ||
        String(c.id) === String(country)
    );
    return match ? match.short_name : null;
  };

  const getFlagUrl = (shortName) =>
    shortName ? `https://flagcdn.com/w20/${shortName.toLowerCase()}.png` : null;

  return (
    <div className="text-secondary">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">SMS Activation Service</h2>

      {/* Analytics */}
      <div className="grid mobile:grid-cols-1 tab:grid-cols-3 pc:grid-cols-4 gap-3 mb-4">
        <div className="bg-blue-800/40 px-4 py-4 flex items-center gap-4 rounded-md border-b border-[#1e1d7c]">
          <span className="bg-blue-800 rounded-full p-3">
            <FaPhone className="text-[20px]" />
          </span>
          <div>
            <h2 className="font-semibold">
              {smsMessages.filter((m) => m.status === 0).length}
            </h2>
            <p>Active Numbers</p>
          </div>
        </div>

        <div className="bg-teal-600/40 px-4 py-4 flex items-center gap-4 rounded-md border-b border-[#1c7e21]">
          <span className="bg-teal-600 rounded-full p-3">
            <AiFillMessage className="text-[20px]" />
          </span>
          <div>
            <h2 className="font-semibold">
              {smsMessages.filter((m) => m.status === 1).length}
            </h2>
            <p>Messages Received</p>
          </div>
        </div>

        <div className="bg-yellow-300/40 px-4 py-4 flex items-center gap-4 rounded-md border-b border-[#ffe23b]">
          <span className="bg-yellow-300 rounded-full p-3">
            <FaRegClock className="text-[20px]" />
          </span>
          <div>
            <h2 className="text-[20px] font-semibold">
              {smsMessages.filter((m) => m.status === 0).length}
            </h2>
            <p>Pending</p>
          </div>
        </div>

        <div className="bg-red-300/40 px-4 py-4 flex items-center gap-4 rounded-md border-b border-red-400">
          <span className="bg-red-300 rounded-full p-3">
            <FcExpired className="text-[20px]" />
          </span>
          <div>
            <h2 className="text-[20px] font-semibold">
              {smsMessages.filter((m) => m.status === 2).length}
            </h2>
            <p>Expired</p>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <section className="w-full">
        <div className="bg-primary-50 rounded-lg border border-primary-600 p-4">
          {smsMessages.length === 0 && !loading && (
            <div className="text-center py-6 text-secondary">
              No messages found.
            </div>
          )}

          {smsMessages.map((sms, idx) => {
            const shortName = getCountryShortName(sms?.country);
            const flagUrl = getFlagUrl(shortName);

            return (
              <div
                key={sms.id || idx}
                className="mb-4 p-3 border border-primary-600 rounded hover:bg-primary-600/20"
              >
                <div className="flex flex-col justify-start items-start gap-1">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex items-center gap-2">
                      <p className="text-[16px] text-secondary">
                        +{sms?.number || "N/A"}
                      </p>
                      <button
                        onClick={() => copyToClipboard(sms?.number)}
                        className="bg-primary-600 text-white py-1 px-2 rounded flex items-center text-[11px]"
                      >
                        <FaCopy className="mr-1 text-[11px]" />
                        Copy
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {getStatusBadge(sms?.status)}
                      {sms.status === 0 && countdowns[sms.orderid] > 0 && (
                        <span className="text-yellow-300 text-[16px]">
                          {formatCountdown(countdowns[sms.orderid])}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between w-full mt-1 text-sm text-secondary/70">
                    <div className="flex items-center gap-2">
                      {flagUrl && (
                        <img
                          src={flagUrl}
                          alt={sms?.country}
                          className="w-5 h-4 rounded-sm"
                        />
                      )}
                      <p>{sms?.service || "N/A"}</p>
                    </div>
                    <p className="text-[10px]">{formatDate(sms?.created_at)}</p>
                  </div>
                </div>

                {sms.status === 1 ? (
                  <>
                    <div className="bg-primary-600/20 p-2 rounded my-2 text-sm text-green-500">
                      SMS received successfully! You can now use the code{" "}
                      {sms?.code || "N/A"}.
                    </div>

                    <div className="flex flex-col mobile:flex-row justify-between items-start mobile:items-center gap-2">
                      <span className="text-sm">
                        <strong>Code:</strong>{" "}
                        <code className="bg-primary-600 text-white px-2 py-1 rounded">
                          {sms?.code || "N/A"}
                        </code>
                      </span>
                      <button
                        onClick={() => copyToClipboard(sms?.code)}
                        className="bg-blue-900 text-blue-300 py-2 px-3 rounded-md flex items-center text-[11px]"
                      >
                        <FaCopy className="mr-1 text-[11px]" />
                        Copy Code
                      </button>
                    </div>
                  </>
                ) : sms.status === 2 ? (
                  <div className="text-center py-6 text-secondary">
                    <ImCancelCircle className="mx-auto text-2xl animate-pulse mb-1" />
                    <p>This number has expired and cannot receive SMS.</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-secondary">
                    <BsClockHistory className="mx-auto text-2xl animate-pulse mb-1" />
                    <p>Waiting for SMS.....</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SmsActivate;

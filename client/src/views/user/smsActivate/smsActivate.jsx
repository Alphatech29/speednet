import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhone, FaRegClock, FaCopy } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { HiOutlineRefresh } from "react-icons/hi";
import { BsClockHistory } from "react-icons/bs";
import { Button } from "flowbite-react";
import { NavLink } from "react-router-dom";

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "received":
      return (
        <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded">
          Received
        </span>
      );
    case "pending":
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs rounded">
          Pending
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 text-xs rounded">
          Unknown
        </span>
      );
  }
};

const SmsActivate = () => {
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [smsCode, setSmsCode] = useState(null);

  useEffect(() => {
    setCountries([
      { code: "us", name: "United States" },
      { code: "ng", name: "Nigeria" },
      { code: "gb", name: "United Kingdom" },
    ]);
    setServices([
      { code: "tg", name: "Telegram" },
      { code: "wa", name: "WhatsApp" },
      { code: "fb", name: "Facebook" },
    ]);
  }, []);

  const notify = (msg) => toast.success(msg);
  const errorNotify = (msg) => toast.error(msg);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getPhoneNumber = async () => {
    if (!selectedCountry || !selectedService) {
      return errorNotify("Please select both country and service.");
    }

    try {
      await fetch("https://dummyjson.com/users/1");
      setPhoneNumber("+12345678901");
      setSmsCode(null);
      notify("Phone number requested successfully");
    } catch {
      errorNotify("Failed to get number");
    }
  };

  const getSms = async () => {
    try {
      setSmsCode("4759");
      toast("SMS Received!");
    } catch {
      errorNotify("Failed to get SMS");
    }
  };

  const smsMessages = [
    {
      id: 1,
      country: "🇺🇸",
      service: "Telegram",
      number: "+1 (555) 123-4567",
      time: "2 min ago",
      status: "received",
      code: "12344",
      message: "Your SMS code for registration in the service is 12344.",
    },
    {
      id: 2,
      country: "🇳🇬",
      service: "WhatsApp",
      number: "+234 701 234 5678",
      time: "1 min ago",
      status: "pending",
    },
  ];

  return (
    <div className="text-gray-300">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">SMS Activation Service</h2>

      {/* Analytics */}
      <div className="grid mobile:grid-cols-1 tab:grid-cols-3 pc:grid-cols-3 gap-3">
        <div className="bg-blue-800/40 px-4 py-4 flex items-center gap-4 rounded-md border-b border-[#1e1d7c]">
          <span className="bg-blue-800 rounded-full p-3">
            <FaPhone className="text-[20px]" />
          </span>
          <div>
            <h2 className="font-semibold">2</h2>
            <p>Active Numbers</p>
          </div>
        </div>

        <div className="bg-teal-600/40 px-4 py-4 flex items-center gap-4 rounded-md border-b border-[#1c7e21]">
          <span className="bg-teal-600 rounded-full p-3">
            <AiFillMessage className="text-[20px]" />
          </span>
          <div>
            <h2 className="font-semibold">2</h2>
            <p>Messages Received</p>
          </div>
        </div>

        <div className="bg-yellow-300/40 px-4 py-4 flex items-center gap-4 rounded-md border-b border-[#ffe23b]">
          <span className="bg-yellow-300 rounded-full p-3">
            <FaRegClock className="text-[20px]" />
          </span>
          <div>
            <h2 className="text-[20px] font-semibold">2</h2>
            <p>Pending</p>
          </div>
        </div>
      </div>

      {/* Get Number Button */}
      <div className="mt-2 mb-3">
        <NavLink to="/user/get-number">
          <Button size="sm" className="py-2 bg-primary-600">
            Get Number
          </Button>
        </NavLink>
      </div>

      {/* Main Sections */}
      <div>
        {/* Recent Messages */}
        <section className="w-full">
          <div className="bg-gray-800 rounded-lg border border-gray-600 p-4 mb-6">
            <div className="flex flex-col mobile:flex-row justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>Recent SMS Messages</span>
              </div>
              <button
                className="flex items-center gap-2 px-3 py-1 border border-gray-500 text-sm rounded hover:bg-gray-700"
                onClick={() => toast.info("Refreshed")}
              >
                <HiOutlineRefresh />
                Refresh
              </button>
            </div>

            {smsMessages.map((sms) => (
              <div
                key={sms.id}
                className="mb-4 p-3 border border-gray-700 rounded hover:bg-gray-700/50"
              >
                <div className="flex flex-col mobile:flex-row justify-between items-start mobile:items-center mb-2 gap-2">
                  <div className="flex gap-3 items-start">
                    <span className="text-xl">{sms.country}</span>
                    <div>
                      <p className="font-medium">{sms.service}</p>
                      <p className="text-sm text-gray-400">{sms.number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {getStatusBadge(sms.status)}
                    <span>{sms.time}</span>
                  </div>
                </div>

                {sms.status === "received" ? (
                  <>
                    <div className="bg-gray-700 p-2 rounded mb-2 text-sm">
                      {sms.message}
                    </div>
                    <div className="flex flex-col mobile:flex-row justify-between items-start mobile:items-center gap-2">
                      <span className="text-sm">
                        <strong>Code:</strong>{" "}
                        <code className="bg-blue-900 text-blue-300 px-2 py-1 rounded">
                          {sms.code}
                        </code>
                      </span>
                      <button
                        onClick={() => copyToClipboard(sms.code)}
                        className="bg-blue-900 text-blue-300 py-2 px-3 rounded-md flex items-center text-[11px]"
                      >
                        <FaCopy className="mr-1 text-[11px]" />
                        Copy Code
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <BsClockHistory className="mx-auto text-2xl animate-pulse mb-1" />
                    Waiting for SMS...
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SmsActivate;

import { useState } from "react";
import { motion } from "framer-motion";
import { MdPassword, MdOutlineSettings } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { HiShieldCheck } from "react-icons/hi";
import PinTab from "./tabs/pinTab";
import PasswordTab from "./tabs/password";

const tabs = [
  { id: "password", label: "Password", icon: <RiLockPasswordFill size={16} />, desc: "Update your login password" },
  { id: "pin", label: "Transaction PIN", icon: <MdPassword size={16} />, desc: "Manage your 4-digit PIN" },
];

const Settings = () => {
  const [active, setActive] = useState("password");

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center">
            <MdOutlineSettings size={16} className="text-primary-600" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Account Settings</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500 ml-11">Manage your security preferences</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 border ${
              active === tab.id
                ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/25"
                : "bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-primary-600/30 hover:text-primary-600"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden"
      >
        {/* Tab header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 dark:border-white/5">
          <div className="w-10 h-10 rounded-2xl bg-primary-600/10 flex items-center justify-center">
            <span className="text-primary-600">
              {tabs.find((t) => t.id === active)?.icon}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{tabs.find((t) => t.id === active)?.label}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">{tabs.find((t) => t.id === active)?.desc}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600 font-semibold">
            <HiShieldCheck size={15} />
            Secured
          </div>
        </div>

        <div className="px-6 py-6">
          {active === "password" ? <PasswordTab /> : <PinTab />}
        </div>
      </motion.div>

      {/* Security note */}
      <div className="mt-4 flex items-start gap-3 bg-primary-600/5 border border-primary-600/15 rounded-2xl px-5 py-4">
        <HiShieldCheck size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
          For security, never share your password or PIN with anyone. Speednet support will never ask for your credentials.
        </p>
      </div>
    </div>
  );
};

export default Settings;

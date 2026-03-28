import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWifi, FaSquarePhone } from "react-icons/fa6";
import AirtimeTab from "./tabs/airtimeTab";
import DataTab from "./tabs/dataTab";

const tabs = [
  { id: "airtime", label: "Airtime", icon: FaSquarePhone },
  { id: "data", label: "Data Bundle", icon: FaWifi },
];

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const Vtu = () => {
  const [activeTab, setActiveTab] = useState("airtime");

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">VTU Services</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">
          Buy airtime &amp; data bundles instantly
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-2xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-900 text-primary-600 shadow-sm"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "airtime" ? <AirtimeTab /> : <DataTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Vtu;

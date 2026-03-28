import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlinePendingActions } from "react-icons/md";
import { HiCheckCircle, HiXCircle, HiChevronDown } from "react-icons/hi";
import PendingTab   from "./tabs/pendingTab";
import CompletedTab from "./tabs/completedTab";
import RejectedTab  from "./tabs/rejectedTab";

const TABS = [
  { label: "Pending",   icon: MdOutlinePendingActions, component: PendingTab,   color: "bg-amber-100 text-amber-600",   dot: "bg-amber-500",   active: "border-amber-500 text-gray-900"   },
  { label: "Completed", icon: HiCheckCircle,            component: CompletedTab, color: "bg-emerald-100 text-emerald-600", dot: "bg-emerald-500", active: "border-emerald-500 text-gray-900" },
  { label: "Rejected",  icon: HiXCircle,                component: RejectedTab,  color: "bg-red-100 text-red-600",        dot: "bg-red-500",     active: "border-red-500 text-gray-900"     },
];

const fadeTab = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.14 } },
};

const Withdrawal = () => {
  const [active,       setActive]       = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navRef     = useRef(null);
  const ActiveTab  = TABS[active].component;
  const activeTab  = TABS[active];

  const handleTab = (idx) => {
    setActive(idx);
    setDropdownOpen(false);
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.children[idx];
    if (btn) btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ── */}
      <div>
        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-xl font-extrabold text-gray-900">Withdrawals</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage and process user withdrawal requests</p>
      </div>

      {/* ── Shell ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

        {/* ════ MOBILE dropdown (<tab) ════ */}
        <div className="tab:hidden border-b border-gray-100 bg-gray-50/40 px-4 py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Filter</p>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 shadow-sm transition-all hover:border-gray-300"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${activeTab.color}`}>
                  <activeTab.icon size={13} />
                </span>
                <span className="truncate">{activeTab.label}</span>
              </div>
              <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <HiChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{    opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden py-1.5"
                >
                  {TABS.map((tab, idx) => {
                    const isActive = active === idx;
                    return (
                      <button key={idx} onClick={() => handleTab(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                          ${isActive ? "bg-primary-600/5 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"}`}>
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                          ${isActive ? tab.color : "bg-gray-100 text-gray-400"}`}>
                          <tab.icon size={13} />
                        </span>
                        <span className="flex-1 truncate">{tab.label}</span>
                        {isActive && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tab.dot}`} />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ════ DESKTOP tab bar (>=tab) ════ */}
        <div className="hidden tab:block border-b border-gray-100 bg-gray-50/40">
          <nav
            ref={navRef}
            className="flex overflow-x-auto px-3 pt-2 gap-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TABS.map((tab, idx) => {
              const isActive = active === idx;
              return (
                <button key={idx} onClick={() => handleTab(idx)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl whitespace-nowrap flex-shrink-0 transition-all border-b-2
                    ${isActive
                      ? `bg-white text-gray-900 shadow-sm ${tab.active}`
                      : "text-gray-400 border-transparent hover:text-gray-700 hover:bg-white/60"
                    }`}>
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all
                    ${isActive ? tab.color : "bg-gray-100 text-gray-400"}`}>
                    <tab.icon size={11} />
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Tab content ── */}
        <div className="p-4 tab:p-5 pc:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={active} variants={fadeTab} initial="hidden" animate="visible" exit="exit">
              <ActiveTab />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;

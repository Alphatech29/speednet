import { useState, useContext, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt2, HiLogout, HiKey, HiBell, HiChevronDown } from "react-icons/hi";
import { AdminAuthContext } from "../../../components/control/adminContext";
import { GlobalContext } from "../../../components/control/globalContext";

/* ── Admin avatar fallback ────────────────────────────────────── */
const AdminAvatar = ({ src }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
        A
      </div>
    );
  }
  return (
    <img
      src={src} alt="admin"
      className="w-8 h-8 rounded-xl object-cover border-2 border-primary-600/20 flex-shrink-0"
      onError={() => setErr(true)}
    />
  );
};

const Header = ({ onToggleSidebar }) => {
  const { logoutAdmin }  = useContext(AdminAuthContext);
  const { webSettings }  = useContext(GlobalContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoSrc = webSettings?.logo || webSettings?.favicon || "/image/user-logo.png";

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm shadow-gray-100/50">
      {/* Gradient accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

      <div className="flex items-center justify-between px-4 tab:px-5 py-2.5 gap-3">

        {/* ── Left ── */}
        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all flex-shrink-0"
          >
            <HiMenuAlt2 size={19} />
          </button>

          {/* Logo — all screens */}
          <div className="flex items-center gap-2.5 tab:hidden">
            <img
              src={logoSrc} alt="logo"
              className="h-7 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>

          {/* Subtitle — desktop only */}
          <div className="hidden pc:flex flex-col border-l border-gray-100 pl-3 ml-1">
            <p className="text-[11px] font-bold text-gray-900 leading-none">Administrative Panel</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Manage your platform</p>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-1.5">

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all"
            >
              <HiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full ring-2 ring-white" />
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{    opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                    <p className="text-xs font-extrabold text-gray-900 uppercase tracking-widest">Notifications</p>
                    <span className="text-[10px] px-2 py-0.5 bg-primary-600/10 text-primary-600 font-bold rounded-full">0 new</span>
                  </div>
                  {/* Empty */}
                  <div className="flex flex-col items-center gap-2 py-8 px-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <HiBell size={18} className="text-gray-300" />
                    </div>
                    <p className="text-xs text-gray-400">No new notifications</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-gray-100 transition-all"
            >
              <AdminAvatar src={webSettings?.favicon || "/image/user-logo.png"} />
              <span className="hidden tab:flex items-center gap-1 text-xs font-bold text-gray-700">
                Admin
                <HiChevronDown
                  size={12}
                  className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{    opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {/* Profile info */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
                    <AdminAvatar src={webSettings?.favicon || "/image/user-logo.png"} />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-gray-900 truncate">Administrator</p>
                      <p className="text-[10px] text-gray-400">Super Admin</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <NavLink
                      to="/admin/password"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-primary-600/8 hover:text-primary-600 transition-all"
                    >
                      <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <HiKey size={12} />
                      </div>
                      Change Password
                    </NavLink>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-gray-50 py-1.5">
                    <button
                      onClick={logoutAdmin}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <HiLogout size={12} />
                      </div>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

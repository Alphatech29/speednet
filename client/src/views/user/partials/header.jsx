import { useState, useContext, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdNotificationsNone, MdOutlineSettings } from "react-icons/md";
import { IoNotificationsOffSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaUsers, FaWallet } from "react-icons/fa6";
import { HiMenuAlt2, HiSun, HiMoon } from "react-icons/hi";
import { AuthContext } from "../../../components/control/authContext";
import { useTheme } from "../../../components/control/themeContext";
import Cart from "../shop/cart/cart";

const Header = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout, webSettings } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  const profileRef = useRef(null);
  const noticeRef = useRef(null);
  const cartRef = useRef(null);

  const closeAll = () => { setIsProfileOpen(false); setIsNoticeOpen(false); setIsCartOpen(false); };
  const toggleProfile = () => { const was = isProfileOpen; closeAll(); setIsProfileOpen(!was); };
  const toggleNotice  = () => { const was = isNoticeOpen;  closeAll(); setIsNoticeOpen(!was); };
  const toggleCart    = () => { const was = isCartOpen;    closeAll(); setIsCartOpen(!was); };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current && !profileRef.current.contains(e.target) &&
        noticeRef.current  && !noticeRef.current.contains(e.target) &&
        cartRef.current    && !cartRef.current.contains(e.target)
      ) closeAll();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iconBtn = "w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-primary-600/10 dark:hover:bg-primary-600/20 text-gray-500 dark:text-slate-400 hover:text-primary-600 transition-all";

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/5 px-4 pc:px-6 py-3 sticky top-0 z-30 shadow-sm dark:shadow-slate-950/50">
      <div className="flex items-center justify-between gap-4">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button className={`hidden pc:flex ${iconBtn}`} onClick={toggleSidebar}>
            <HiMenuAlt2 size={20} />
          </button>
          <a href="/" className="pc:hidden">
            <img src="/image/user-logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          </a>
        </div>

        {/* Center — greeting (desktop) */}
        <div className="hidden pc:flex flex-col">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Good day, <span className="text-primary-600">{user?.full_name?.split(" ")[0]}</span> 👋
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Welcome back to your dashboard</p>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Balance chip */}
          {webSettings && user && (
            <NavLink to="/user/wallet"
              className="hidden tab:flex items-center gap-2 bg-primary-600/8 dark:bg-primary-600/15 border border-primary-600/20 rounded-xl px-3 py-2 hover:bg-primary-600/15 dark:hover:bg-primary-600/25 transition-all">
              <FaWallet size={13} className="text-primary-600" />
              <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{webSettings.currency}{user?.account_balance}</span>
            </NavLink>
          )}

          {/* Theme toggle */}
          <button onClick={toggleTheme} className={iconBtn} title={theme === "dark" ? "Switch to light" : "Switch to dark"}>
            {theme === "dark" ? <HiSun size={18} className="text-yellow-400" /> : <HiMoon size={17} />}
          </button>

          {/* Notifications */}
          <span ref={noticeRef} className="relative">
            <button onClick={toggleNotice} className={`${iconBtn} relative`}>
              <MdNotificationsNone size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full" />
            </button>
            {isNoticeOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/8 py-4 px-4 z-50">
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Notifications</p>
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                    <IoNotificationsOffSharp className="text-gray-400" size={18} />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-slate-500 text-center">No new notifications</p>
                </div>
              </div>
            )}
          </span>

          {/* Cart */}
          <span ref={cartRef}>
            <Cart isCartOpen={isCartOpen} toggleCartDropdown={toggleCart} />
          </span>

          {/* Profile */}
          <span ref={profileRef} className="relative">
            <button onClick={toggleProfile}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group">
              <img
                src={user?.avatar} alt="Profile" loading="lazy"
                className="w-8 h-8 rounded-xl object-cover border-2 border-primary-600/20"
                onError={(e) => {
                  e.target.outerHTML = `<div class="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs font-bold">${user?.full_name?.[0] || "U"}</div>`;
                }}
              />
              <div className="hidden tab:block text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user?.full_name?.split(" ")[0]}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 capitalize">{user?.role}</p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/8 py-2 z-50 overflow-hidden">
                <div className="px-4 pb-3 pt-1 border-b border-gray-100 dark:border-white/8 mb-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.full_name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{user?.email}</p>
                </div>
                {[
                  { to: "/user/profile",  icon: <CgProfile size={14} />,       label: "My Profile" },
                  { to: "/user/referral", icon: <FaUsers size={13} />,          label: "Referral Program" },
                  { to: "/user/settings", icon: <MdOutlineSettings size={15} />, label: "Settings" },
                ].map(({ to, icon, label }) => (
                  <NavLink key={to} to={to} onClick={closeAll}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-primary-600/8 dark:hover:bg-primary-600/15 hover:text-primary-600 transition-all">
                    <span className="opacity-70">{icon}</span>{label}
                  </NavLink>
                ))}
                <div className="border-t border-gray-100 dark:border-white/8 mt-1 pt-1">
                  <button onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <RiLogoutCircleRLine size={14} />Logout
                  </button>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

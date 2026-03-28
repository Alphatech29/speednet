import { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosPersonAdd } from "react-icons/io";
import { LuLock } from "react-icons/lu";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { GrShieldSecurity } from "react-icons/gr";
import { TbSocial } from "react-icons/tb";
import { MdOutlinePhoneAndroid, MdOutlineClose } from "react-icons/md";
import { FaMoneyCheckAlt, FaBolt } from "react-icons/fa";
import { RiP2pFill, RiDashboardLine } from "react-icons/ri";
import { BiWallet } from "react-icons/bi";
import { AuthContext } from "../../../components/control/authContext";
import { GlobalContext } from "../../../components/control/globalContext";

/* ── Services for dropdown ──────────────────────── */
const services = [
  {
    icon: <TbSocial size={18} className="text-primary-600" />,
    label: "Accounts Marketplace",
    desc: "Verified social & digital accounts",
    to: "/services/marketplace",
  },
  {
    icon: <MdOutlinePhoneAndroid size={18} className="text-primary-600" />,
    label: "VTU Airtime & Data",
    desc: "Instant top-up, any network",
    to: "/services/vtu",
  },
  {
    icon: <GrShieldSecurity size={16} className="text-primary-600" />,
    label: "VPN & Secure Logs",
    desc: "Premium encrypted access",
    to: "/services/vpn",
  },
  {
    icon: <MdOutlinePhoneAndroid size={18} className="text-primary-600" />,
    label: "Virtual OTP Numbers",
    desc: "Global eSIM & virtual numbers",
    to: "/services/virtual-numbers",
  },
  {
    icon: <RiP2pFill size={18} className="text-primary-600" />,
    label: "P2P Escrow Trading",
    desc: "Safe peer-to-peer trading",
    to: "/services/p2p-trading",
  },
  {
    icon: <FaMoneyCheckAlt size={16} className="text-primary-600" />,
    label: "Multi-Gateway Payments",
    desc: "Bank, crypto, mobile money",
    to: "/services/payments",
  },
];

/* ── Nav link with animated underline ───────────── */
const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative text-sm font-semibold transition-colors pb-0.5 group ${
        isActive ? "text-primary-600" : "text-gray-700 hover:text-primary-600"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {children}
        <span
          className={`absolute -bottom-0.5 left-0 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </>
    )}
  </NavLink>
);

/* ── Main Component ─────────────────────────────── */
const Header = () => {
  const { user } = useContext(AuthContext);
  const { webSettings } = useContext(GlobalContext);
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const dropdownRef = useRef(null);

  /* Close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* Scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const getDashboardLink = () => {
    if (user?.role === "merchant") return "/user/dashboard";
    if (user?.role === "user") return "/user/marketplace";
    return "/";
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          ANNOUNCEMENT BAR
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-secondary overflow-hidden"
          >
            <div className="relative flex items-center justify-center px-10 py-2">
              {/* Scrolling text */}
              <div className="overflow-hidden flex-1 max-w-2xl mx-auto">
                <motion.div
                  className="flex gap-16 whitespace-nowrap"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                >
                  {[...Array(2)].map((_, r) => (
                    <span key={r} className="flex gap-16 flex-shrink-0">
                      {[
                        "🎉 New: International Airtime now available!",
                        "⚡ Instant VTU delivery — zero downtime",
                        "🔒 All trades protected by escrow",
                        "🌍 Serving 70+ countries globally",
                      ].map((t) => (
                        <span key={t} className="text-[11px] font-semibold text-gray-200">
                          {t}
                        </span>
                      ))}
                    </span>
                  ))}
                </motion.div>
              </div>
              {/* Dismiss */}
              <button
                onClick={() => setAnnouncementVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Dismiss announcement"
              >
                <MdOutlineClose size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          MAIN NAVBAR
      ═══════════════════════════════════════ */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          announcementVisible ? "top-7" : "top-0"
        } ${
          scrolled
            ? "bg-white/96 backdrop-blur-lg shadow-lg shadow-gray-200/60 border-b border-gray-100"
            : "bg-white/85 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-5 pc:px-20 h-16">

          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0 flex items-center gap-2.5">
            <img
              src={webSettings?.logo || "/image/user-logo.png"}
              alt={webSettings?.site_name || "Speednet"}
              className="h-9 pc:h-11 w-auto object-contain"
            />
          </NavLink>

          {/* ── Desktop Nav ── */}
          <nav className="hidden pc:flex items-center gap-7">
            <NavItem to="/">Home</NavItem>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen((p) => !p)}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors pb-0.5 group ${
                  servicesOpen ? "text-primary-600" : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Services
                <HiChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${servicesOpen ? "rotate-180 text-primary-600" : ""}`}
                />
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${
                    servicesOpen ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>

              {/* Mega dropdown */}
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[560px] bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 p-4 grid grid-cols-2 gap-2"
                  >
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />

                    {services.map(({ icon, label, desc, to }) => (
                      <NavLink
                        key={label}
                        to={to}
                        onClick={() => setServicesOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50/60 hover:border-primary-600/10 border border-transparent transition-all duration-150 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/20 transition-colors">
                          {icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                            {label}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </div>
                      </NavLink>
                    ))}

                    {/* Footer row */}
                    <div className="col-span-2 mt-1 pt-3 border-t border-gray-100 flex items-center justify-between px-1">
                      <p className="text-xs text-gray-400">
                        All services protected by escrow
                      </p>
                      <NavLink
                        to="/auth/register"
                        onClick={() => setServicesOpen(false)}
                        className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:underline"
                      >
                        Explore all →
                      </NavLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavItem to="/contact">Contact</NavItem>
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden pc:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Wallet indicator */}
                <div className="flex items-center gap-2 bg-primary-600/8 border border-primary-600/20 rounded-xl px-3 py-2">
                  <BiWallet size={15} className="text-primary-600" />
                  <span className="text-xs font-bold text-gray-700">My Wallet</span>
                </div>
                <NavLink to={getDashboardLink()}>
                  <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30">
                    <RiDashboardLine size={15} />
                    Dashboard
                  </button>
                </NavLink>
              </div>
            ) : (
              <>
                <NavLink to="/auth/login">
                  <button className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary-600 border border-gray-200 hover:border-primary-600 px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all duration-200">
                    <LuLock size={13} />
                    Sign In
                  </button>
                </NavLink>
                <NavLink to="/auth/register">
                  <button className="relative flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 overflow-hidden group">
                    {/* Shimmer effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <IoIosPersonAdd size={16} />
                    Get Started Free
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                  </button>
                </NavLink>
              </>
            )}
          </div>

          {/* ── Mobile / Tablet Toggle ── */}
          <button
            className="pc:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 hover:text-primary-600 hover:bg-orange-50 transition-all duration-200"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
              </motion.span>
            </AnimatePresence>
          </button>

        </div>

        {/* Progress bar on scroll */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/40 to-transparent" />
        )}
      </header>

      {/* ═══════════════════════════════════════
          MOBILE FULL-SCREEN MENU
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className={`fixed right-0 bottom-0 z-40 w-full tab:w-[360px] bg-white shadow-2xl flex flex-col overflow-y-auto ${
              announcementVisible ? "top-[calc(28px+64px)]" : "top-16"
            }`}
          >
            {/* Menu header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Navigation</p>
            </div>

            {/* Nav links */}
            <div className="px-5 py-4 flex flex-col gap-1 border-b border-gray-100">
              {[
                { to: "/", label: "Home", emoji: "🏠" },
                { to: "/contact", label: "Contact Us", emoji: "💬" },
              ].map(({ to, label, emoji }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-primary-600/10 text-primary-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    }`
                  }
                >
                  <span className="text-base">{emoji}</span>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Services list */}
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3 px-1">
                Our Services
              </p>
              <div className="grid grid-cols-1 gap-1">
                {services.map(({ icon, label, desc, to }) => (
                  <NavLink
                    key={label}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-orange-50 transition-all duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/20 transition-colors">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors leading-tight">
                        {label}
                      </p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Trust strip */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "🔒", text: "Escrow Protected" },
                  { icon: "✅", text: "Verified Sellers" },
                  { icon: "⚡", text: "Instant Delivery" },
                  { icon: "🌍", text: "Global Access" },
                ].map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg">
                    <span>{icon}</span>
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="px-5 py-5 flex flex-col gap-3 mt-auto">
              {user ? (
                <NavLink to={getDashboardLink()} onClick={() => setMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-md shadow-primary-600/20 text-sm">
                    <RiDashboardLine size={16} />
                    Go to Dashboard
                  </button>
                </NavLink>
              ) : (
                <>
                  <NavLink to="/auth/register" onClick={() => setMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-primary-600/20 transition-all text-sm">
                      <FaBolt size={13} />
                      Get Started Free
                    </button>
                  </NavLink>
                  <NavLink to="/auth/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-primary-600 hover:text-primary-600 transition-all text-sm">
                      <LuLock size={13} />
                      Sign In to Account
                    </button>
                  </NavLink>
                </>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm pc:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

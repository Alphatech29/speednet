import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../../components/control/authContext";
import { HiViewGrid, HiChevronDown } from "react-icons/hi";
import { FaShop, FaWallet, FaMobile } from "react-icons/fa6";
import { BiSolidPurchaseTag, BiWorld } from "react-icons/bi";
import { MdAddBusiness, MdOutlineStorefront } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { GiVirtualMarker } from "react-icons/gi";
import { BsBank2 } from "react-icons/bs";
import { TiFlashOutline } from "react-icons/ti";
import { IoListCircle } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";

const SidebarDropdown = ({ label, icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/8 hover:text-white transition-all duration-200 group"
      >
        <div className="flex items-center gap-3 text-sm font-medium">
          {icon && <span className="w-5 h-5 flex items-center justify-center opacity-70 group-hover:opacity-100">{icon}</span>}
          {label}
        </div>
        <HiChevronDown size={13} className={`text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="ml-4 mt-1 mb-1 flex flex-col gap-0.5 border-l border-white/10 pl-3">
          {children}
        </div>
      )}
    </div>
  );
};

const NavItem = ({ to, icon, children, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
        isActive
          ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
          : "text-slate-300 hover:bg-white/8 hover:text-white"
      }`}
    >
      <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
        {icon}
      </span>
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="text-[10px] font-bold bg-primary-600/20 text-primary-400 border border-primary-600/30 px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;
  const country = user?.country;

  return (
    <div className="w-[265px] h-screen bg-slate-900 text-slate-200 fixed top-0 left-0 z-50 flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/image/user-logo.png" alt="Logo" className="h-8 w-auto object-contain" />
        </NavLink>
        <div className="ml-auto">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${role === "merchant" ? "bg-primary-600/20 text-primary-500 border border-primary-600/30" : "bg-slate-700 text-slate-400"}`}>
            {role === "merchant" ? "Merchant" : "User"}
          </span>
        </div>
      </div>

      {/* Nav content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5 scrollbar-thin">

        {/* Section label */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-2">Main Menu</p>

        {role !== "merchant" && (
          <NavLink
            to="/user/become-a-marchant"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary-600/10 border border-primary-600/20 text-primary-500 hover:bg-primary-600/20 transition-all mb-2"
          >
            <MdAddBusiness size={18} className="flex-shrink-0" />
            Become a Merchant
          </NavLink>
        )}

        {role !== "user" && (
          <NavItem to="/user/dashboard" icon={<HiViewGrid size={16} />}>Dashboard</NavItem>
        )}

        <NavItem to="/user/marketplace" icon={<FaShop size={14} />}>Marketplace</NavItem>

        {role !== "user" && (
          <SidebarDropdown label="Products" icon={<MdOutlineStorefront size={16} />}>
            <NavLink to="/user/add-product" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/8 hover:text-white transition-all">Add Product</NavLink>
            <NavLink to="/user/my-products" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/8 hover:text-white transition-all">My Products</NavLink>
          </SidebarDropdown>
        )}

        <NavItem to="/user/order" icon={<BiSolidPurchaseTag size={15} />}>My Purchases</NavItem>
        <NavItem to="/user/report-list" icon={<IoListCircle size={16} />}>My Reports</NavItem>

        <a
          href="https://mrbeanpanel.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/8 hover:text-white transition-all"
        >
          <TiFlashOutline size={16} className="opacity-70 flex-shrink-0" />
          Boost Accounts
        </a>

        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mt-4 mb-2">Finance</p>

        <NavItem to="/user/wallet" icon={<FaWallet size={14} />}>My Wallet</NavItem>

        {role !== "user" && (
          <NavItem to="/user/withdraw" icon={<BsBank2 size={14} />}>Withdraw</NavItem>
        )}
        <NavItem to="/user/history" icon={<GoHistory size={14} />}>History</NavItem>

        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mt-4 mb-2">Services</p>

        <SidebarDropdown label="SMS / Virtual Phone" icon={<GiVirtualMarker size={16} />}>
          <NavLink to="/user/sms-service" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/8 hover:text-white transition-all">Portal</NavLink>
          <NavLink to="/user/get-number" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/8 hover:text-white transition-all">Get Number</NavLink>
        </SidebarDropdown>

        {country === "Nigeria" && (
          <NavItem to="/user/vtu" icon={<FaMobile size={14} />}>VTU Service</NavItem>
        )}

        <NavItem to="/user/international-airtime" icon={<BiWorld size={16} />}>International Airtime</NavItem>

      </div>

      {/* User info footer */}
      <div className="border-t border-white/5 px-4 py-3 flex items-center gap-3">
        <img
          src={user?.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-xl object-cover border border-white/10 flex-shrink-0"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
          <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
        </div>
        <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors p-1" title="Logout">
          <RiLogoutCircleRLine size={16} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

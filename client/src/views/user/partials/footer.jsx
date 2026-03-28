import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { RiHome3Fill } from "react-icons/ri";
import { FaShop, FaWallet } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import { AuthContext } from "../../../components/control/authContext";

const Footer = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const location = useLocation();

  const navItems = [
    {
      to: role === "merchant" ? "/user/dashboard" : "/user/wallet",
      icon: <RiHome3Fill size={20} />,
      label: role === "merchant" ? "Dashboard" : "Wallet",
      show: true,
    },
    {
      to: "/user/marketplace",
      icon: <FaShop size={18} />,
      label: "Marketplace",
      show: true,
    },
    {
      to: "/user/wallet",
      icon: <FaWallet size={17} />,
      label: "Wallet",
      show: role !== "user",
    },
    {
      to: "/user/order",
      icon: <FaBox size={17} />,
      label: "Orders",
      show: role !== "merchant",
    },
  ];

  const visibleItems = navItems.filter((i) => i.show);

  return (
    <nav className="w-full bg-white dark:bg-slate-900 pc:hidden border-t border-gray-100 dark:border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-slate-950/50 px-2 py-2 fixed bottom-0 z-50">
      <div className="flex items-center justify-around">
        {visibleItems.map(({ to, icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? "text-primary-600"
                  : "text-gray-400 dark:text-slate-500 hover:text-primary-600"
              }`}
            >
              <div className={`relative ${isActive ? "scale-110" : ""} transition-transform`}>
                {icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-600" />
                )}
              </div>
              <span className={`text-[10px] font-semibold ${isActive ? "text-primary-600" : "text-gray-400"}`}>
                {label}
              </span>
            </NavLink>
          );
        })}

        {/* Menu button */}
        <button
          onClick={toggleSidebar}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-gray-400 dark:text-slate-500 hover:text-primary-600 transition-all min-w-[56px]"
        >
          <BiMenu size={20} />
          <span className="text-[10px] font-semibold">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default Footer;

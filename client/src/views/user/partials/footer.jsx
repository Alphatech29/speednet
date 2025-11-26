import React, { useContext } from 'react';
import { BiMenu } from "react-icons/bi";
import { RiHome3Fill } from "react-icons/ri";
import { FaShop } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { GiWallet } from "react-icons/gi";
import { FaBox } from "react-icons/fa";
import { AuthContext } from "../../../components/control/authContext";

const Footer = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  return (
    <div className="w-full bg-slate-800 pc:hidden shadow-lg px-4 py-2 text-white fixed bottom-0 z-50">
      <div className="flex w-full justify-between items-center">

        {/* Conditional Dashboard/Wallet for first icon */}
        <NavLink
          to={role === 'merchant' ? "/user/dashboard" : "/user/wallet"}
          className="flex flex-col justify-center items-center"
        >
          <RiHome3Fill className="text-[26px]" />
          <span className="text-[10px]">
            {role === 'merchant' ? "Dashboard" : "Wallet"}
          </span>
        </NavLink>

        {/* Marketplace Link (Visible to all) */}
        <NavLink
          to="/user/marketplace"
          className="flex flex-col justify-center items-center"
        >
          <FaShop className="text-[26px]" />
          <span className="text-[10px]">Marketplace</span>
        </NavLink>

        {/* Wallet Link (Hide if user) */}
        {role !== 'user' && (
          <NavLink
            to="/user/wallet"
            className="flex flex-col justify-center items-center"
          >
            <GiWallet className="text-[26px]" />
            <span className="text-[10px]">Wallet</span>
          </NavLink>
        )}

        {/* Order Link (Hide if merchant) */}
        {role !== 'merchant' && (
          <NavLink
            to="/user/order"
            className="flex flex-col justify-center items-center"
          >
            <FaBox className="text-[26px]" />
            <span className="text-[10px]">My Order</span>
          </NavLink>
        )}

        {/* Menu Button - Toggles Sidebar */}
        <button
          onClick={toggleSidebar}
          className="flex flex-col justify-center items-center"
        >
          <BiMenu className="text-[26px]" />
          <span className="text-[10px]">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default Footer;

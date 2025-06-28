import React from "react";
import { BiMenu } from "react-icons/bi";
import { RiHome3Fill } from "react-icons/ri";
import { FaShop } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { GiWallet } from "react-icons/gi";


const Footer = ({ toggleSidebar }) => {
  return (
    <div className="w-full fixed bottom-0 z-50 pc:hidden bg-slate-800 px-4 py-2 shadow-inner">
      <div className="flex justify-between items-center">
        {/* Dashboard */}
        <NavLink
          to="/user/dashboard"
          className="flex flex-col items-center text-white"
        >
          <RiHome3Fill className="text-[24px]" />
          <span className="text-[10px]">Dashboard</span>
        </NavLink>

        {/* Marketplace */}
        <NavLink
          to="/user/marketplace"
          className="flex flex-col items-center text-white"
        >
          <FaShop className="text-[24px]" />
          <span className="text-[10px]">Marketplace</span>
        </NavLink>

        {/* Repeated Dashboard (you can change this route if needed) */}
        <NavLink
          to="/user/wallet"
          className="flex flex-col items-center text-white"
        >
          <GiWallet  className="text-[24px]" />
          <span className="text-[10px]">Wallet</span>
        </NavLink>

        {/* Menu */}
        <button
          onClick={toggleSidebar}
          className="flex flex-col items-center text-white"
        >
          <BiMenu className="text-[24px]" />
          <span className="text-[10px]">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default Footer;

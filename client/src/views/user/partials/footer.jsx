import React from "react";
import { BiMenu } from "react-icons/bi";
import { RiHome3Fill } from "react-icons/ri";
import { FaShop } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { GiWallet } from "react-icons/gi";


const Footer = ({ toggleSidebar }) => {
  return (
    <div className="w-full bg-slate-800 pc:hidden shadow-lg px-4 py-2 text-white fixed bottom-0 z-50">
      <div className="flex w-full justify-between items-center">
        {/* Dashboard Link */}
        <NavLink
          to="/user/dashboard"
          className="flex flex-col justify-center items-center"
        >
          <RiHome3Fill className="text-[26px]" />
          <span className="text-[10px]">Dashboard</span>
        </NavLink>

        {/* Marketplace Link */}
        <NavLink
          to="/user/marketplace"
          className="flex flex-col justify-center items-center"
        >
          <FaShop className="text-[26px]" />
          <span className="text-[10px]">Marketplace</span>
        </NavLink>

{/* Wallet Link */}
        <NavLink
          to="/user/wallet"
          className="flex flex-col justify-center items-center"
        >
          <GiWallet className="text-[26px]" />
          <span className="text-[10px]">Wallet</span>
        </NavLink>

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

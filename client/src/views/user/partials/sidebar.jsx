import React, { useContext } from "react";
import { HiViewGrid } from "react-icons/hi";
import { FaShop } from "react-icons/fa6";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaWallet } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../components/control/authContext';


const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className='w-64 h-screen bg-gray-800 !text-slate-200 p-4 '>
      {/* Logo Section */}
      <div className='pt-1 mb-4 '>
        <a href="/">
          <img src="/image/paysparq-logo.png" alt="Logo" className="h-12 border-b border-gray-700" />
        </a>
      </div>

      {/* Sidebar Navigation */}
      <div className='gap-4 flex flex-col'>
       {/* <NavLink
          to="/user/dashboard"
          className='flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay'
        >
          <HiViewGrid /> <span>Dashboard</span>
        </NavLink> */}

        <NavLink
          to="/user/marketplace"
          className='flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay'
        >
          <FaShop /> <span>Marketplace</span>
        </NavLink>

        <NavLink
          to="/user/order"
          className='flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay'
        >
          <BiSolidPurchaseTag />
          <span>My Purchase</span>
        </NavLink>
        <NavLink
          to="/user/wallet"
          className='flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay'
        >
          <FaWallet />
          <span>My wallet</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

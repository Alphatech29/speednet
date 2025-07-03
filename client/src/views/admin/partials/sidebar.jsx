import React, { useState } from 'react';
import '../cssFile/dashboard.css';
import { NavLink } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { HiViewGrid } from "react-icons/hi";
import { SiNordvpn } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { PiCubeTransparentFill } from "react-icons/pi";
import { MdOutlineAccountTree } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { CiViewList } from "react-icons/ci";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LiaFirstOrder } from "react-icons/lia";


const Sidebar = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className='side-wrapper flex flex-col justify-start items-start px-5 py-4'>
      <div className="top-header w-full border-b-[0.70px] border-gray-400 pb-1">
        <a href="/admin/dashboard">
          <img src="/image/user-logo.png" alt="Logo" className="h-10" />
        </a>
      </div>
      <div className='sidebar-menu mt-4 flex flex-col justify-start items-start w-full'>
        <NavLink to="/admin/dashboard" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <HiViewGrid /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/nord-admin" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <SiNordvpn /> <span>Nord Admin</span>
        </NavLink>

        <NavLink to="/admin/users" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <FaUsers /> <span>Users Management</span>
        </NavLink>

        <NavLink to="/admin/announcement" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <TfiAnnouncement /> <span>Announcement</span>
        </NavLink>

        <NavLink to="/admin/products" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <FaCartShopping /> <span>Products</span>
        </NavLink>

         <NavLink to="/admin/order" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <LiaFirstOrder /> <span>Purchase Order's</span>
        </NavLink>


        <NavLink to="/admin/withdrawal" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <PiCubeTransparentFill /> <span>Withdrawal</span>
        </NavLink>

        <NavLink to="/admin/platform" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <MdOutlineAccountTree /> <span>Platform</span>
        </NavLink>

        {/* History Dropdown Start */}
        <div className="w-full">
          <div
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CiViewList />
              <span>History</span>
            </div>
            {showHistory ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>

          {showHistory && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <NavLink to="/admin/histroy/transaction" className="text-[14px] text-pay hhover:bg-white/40 p-2 hover:p-2 hover:rounded-md">
                Transaction History
              </NavLink>
              <NavLink to="/admin/histroy/merchant" className="text-[14px] text-pay hover:bg-white/40 p-2 hover:p-2 hover:rounded-md">
                Merchant History
              </NavLink>
            </div>
          )}
        </div>
        {/* History Dropdown End */}

        <NavLink to="/admin/settings" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
          <IoMdSettings /> <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

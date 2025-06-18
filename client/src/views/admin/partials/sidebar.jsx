import React from 'react';
import '../cssFile/dashboard.css'
import { NavLink } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { HiViewGrid } from "react-icons/hi";
import { SiNordvpn } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { PiCubeTransparentFill } from "react-icons/pi";
import { MdOutlineAccountTree } from "react-icons/md";







const Sidebar = () => {
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
            <SiNordvpn  /> <span>Nord Admin</span>
          </NavLink>
           <NavLink to="/admin/users" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
            <FaUsers  /> <span>Users Management</span>
          </NavLink>
           <NavLink to="/admin/products" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
            <FaCartShopping  /> <span>Products</span>
          </NavLink>
           <NavLink to="/admin/withdrawal" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
            <PiCubeTransparentFill  /> <span>Withdrawal</span>
          </NavLink>
           <NavLink to="/admin/platform" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
            <MdOutlineAccountTree  /> <span>Platform</span>
          </NavLink>
           <NavLink to="/admin/settings" className="w-full flex items-center gap-2 text-[15px] hover:bg-white/40 p-2 hover:p-2 hover:rounded-md text-pay">
            <IoMdSettings  /> <span>Settings</span>
          </NavLink>
          
        
      </div>
    </div>
  );
}

export default Sidebar;

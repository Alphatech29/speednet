import React, { useState } from "react";
import "../cssFile/dashboard.css";
import { NavLink } from "react-router-dom";

// Icons
import { FaCartShopping } from "react-icons/fa6"; // FA6 icon
import { HiViewGrid } from "react-icons/hi";
import { SiNordvpn } from "react-icons/si";
import { FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa"; // only FA5 icons
import { IoMdSettings } from "react-icons/io";
import { PiUsersFourLight, PiCubeTransparentFill } from "react-icons/pi";
import { MdOutlineAccountTree } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { CiViewList, CiPercent } from "react-icons/ci";
import { LiaFirstOrder } from "react-icons/lia";
import { TbMessageReport } from "react-icons/tb";
import { BiTransfer } from "react-icons/bi";
import { GiBookPile } from "react-icons/gi";



const Sidebar = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showVendor, setShowVendor] = useState(false);
  const [showProduct, setShowProduct] = useState(false);

  return (
    <div className="side-wrapper h-screen flex flex-col">

      {/* ===== FIXED LOGO HEADER ===== */}
      <div className="top-header sticky top-0 z-50 border-b border-gray-400 px-5 py-3">
        <a href="/admin/dashboard">
          <img src="/image/user-logo.png" alt="Logo" className="h-10" />
        </a>
      </div>

      {/* ===== SCROLLABLE MENU ===== */}
      <div className="sidebar-menu flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1 text-gray-100">

        <NavLink to="/admin/dashboard" className="sidebar-link">
          <HiViewGrid /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/nord-admin" className="sidebar-link">
          <SiNordvpn /> <span>Nord Admin</span>
        </NavLink>

        <NavLink to="/admin/users" className="sidebar-link">
          <FaUsers /> <span>Users Management</span>
        </NavLink>

        <NavLink to="/admin/announcement" className="sidebar-link">
          <TfiAnnouncement /> <span>Announcement</span>
        </NavLink>

        <NavLink to="/admin/short-notice" className="sidebar-link">
          <TfiAnnouncement /> <span>Short Notice</span>
        </NavLink>

        <NavLink to="/admin/transfer" className="sidebar-link">
          <BiTransfer /> <span>Transfer</span>
        </NavLink>

        <NavLink to="/admin/darkshop-commission" className="sidebar-link">
          <CiPercent /> <span>Darkshop Commission</span>
        </NavLink>

        {/* ===== MERCHANT DROPDOWN ===== */}
        <div className="w-full">
          <div
            onClick={() => setShowVendor(!showVendor)}
            className="sidebar-link justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <PiUsersFourLight />
              <span>Merchants</span>
            </div>
            {showVendor ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>

          {showVendor && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <NavLink to="/admin/vendor" className="sidebar-sub-link">
                Merchant List
              </NavLink>
              <NavLink to="/admin/vendor/create" className="sidebar-sub-link">
                Create Merchant
              </NavLink>
            </div>
          )}
        </div>

        {/* ===== PRODUCT DROPDOWN ===== */}
        <div className="w-full">
          <div
            onClick={() => setShowProduct(!showProduct)}
            className="sidebar-link justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FaCartShopping />
              <span>Shopping Products</span>
            </div>
            {showProduct ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>

          {showProduct && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <NavLink to="/admin/shopping/product" className="sidebar-sub-link">
                Products
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/admin/page" className="sidebar-link">
          <GiBookPile /> <span>Pages</span>
        </NavLink>

        <NavLink to="/admin/products" className="sidebar-link">
          <FaCartShopping /> <span>Products</span>
        </NavLink>

        <NavLink to="/admin/report" className="sidebar-link">
          <TbMessageReport /> <span>Reports</span>
        </NavLink>

        <NavLink to="/admin/order" className="sidebar-link">
          <LiaFirstOrder /> <span>Purchase Orders</span>
        </NavLink>

        <NavLink to="/admin/withdrawal" className="sidebar-link">
          <PiCubeTransparentFill /> <span>Withdrawal</span>
        </NavLink>

        <NavLink to="/admin/platform" className="sidebar-link">
          <MdOutlineAccountTree /> <span>Platform</span>
        </NavLink>

        {/* ===== HISTORY DROPDOWN ===== */}
        <div className="w-full">
          <div
            onClick={() => setShowHistory(!showHistory)}
            className="sidebar-link justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CiViewList />
              <span>History</span>
            </div>
            {showHistory ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>

          {showHistory && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <NavLink to="/admin/history/transaction" className="sidebar-sub-link">
                Transaction History
              </NavLink>
              <NavLink to="/admin/history/merchant" className="sidebar-sub-link">
                Merchant History
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/admin/settings" className="sidebar-link">
          <IoMdSettings /> <span>Settings</span>
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;

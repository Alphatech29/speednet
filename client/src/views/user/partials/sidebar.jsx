import React, { useContext } from 'react';
import { HiViewGrid } from "react-icons/hi";
import { FaShop, FaShopify, FaWallet, FaMobile } from "react-icons/fa6";
import { BiSolidPurchaseTag, BiWorld } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { MdAddBusiness } from "react-icons/md";
import { GiVirtualMarker } from "react-icons/gi";
import { BsBank2 } from "react-icons/bs";
import { SiNordvpn } from "react-icons/si";
import { TiFlashOutline } from "react-icons/ti";
import { IoListCircle } from "react-icons/io5";
import { AuthContext } from "../../../components/control/authContext";
import Swal from "sweetalert2";

const linkClasses = "flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay";

const Sidebar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const country = user?.country;

  return (
    <div className="overflow-auto text-left bottom-0 w-[265px] h-full bg-gray-800 text-slate-200 px-4 pb-4 pt-3 z-50 fixed top-0 left-0 mobile:overflow-y-auto">

      {/* Mobile Close Button */}
      <div className="flex justify-between items-center mb-4 pc:hidden">
        <a href="/">
          <img src="/image/user-logo.png" alt="Logo" className="h-10" />
        </a>
      </div>

      {/* PC Logo */}
      <div className="hidden pc:block mb-4 w-full border-b border-gray-700">
        <a href="/">
          <img src="/image/user-logo.png" alt="Logo" className="h-10" />
        </a>
      </div>

      <div className="gap-4 flex flex-col">
        {/* Show only if role is NOT merchant */}
        {role !== 'merchant' && (
          <NavLink to="/user/become-a-marchant" className="flex items-center p-2 gap-2 text-base bg-primary-600 rounded-lg hover:text-pay">
            <MdAddBusiness /> <span>Become a Merchant</span>
          </NavLink>
        )}

        {/* Show only if role is NOT user */}
        {role !== 'user' && (
          <NavLink to="/user/dashboard" className={linkClasses}>
            <HiViewGrid /> <span>Dashboard</span>
          </NavLink>
        )}

        <NavLink to="/user/marketplace" className={linkClasses}>
          <FaShop /> <span>Marketplace</span>
        </NavLink>

        {/* Show only if role is NOT user */}
        {role !== 'user' && (
          <Dropdown
            label={<span className="flex items-center gap-2"><FaShopify /> Products</span>}
            inline
            className="bg-gray-800 text-white border-none"
          >
            <Dropdown.Item as="div">
              <NavLink className="text-gray-400" to="/user/add-product">Add Product</NavLink>
            </Dropdown.Item>
            <Dropdown.Item as="div">
              <NavLink className="text-gray-400" to="/user/my-products">My Products</NavLink>
            </Dropdown.Item>
          </Dropdown>
        )}

        <NavLink to="/user/wallet" className={linkClasses}>
          <FaWallet /> <span>My Wallet</span>
        </NavLink>

        {/* SweetAlert for SMS-Virtual-Phone */}
        <div
          onClick={() => {
            Swal.fire({
              icon: "info",
              title: "Coming Soon!",
              text: "The SMS Virtual Phone service is under development.",
              confirmButtonColor: "#F66B04",
            });
          }}
          className={linkClasses + " cursor-pointer"}
        >
          <GiVirtualMarker /> <span>Sms-Virtual-Phone</span>
        </div>

        <Dropdown
          label={<span className="flex items-center gap-2"><SiNordvpn /> Nord Services</span>}
          inline
          className="bg-gray-800 text-white border-none"
        >
          <Dropdown.Item as="div">
            <NavLink className="text-gray-400" to="/user/nord-services/vpn">NordVPN</NavLink>
          </Dropdown.Item>
          <Dropdown.Item as="div">
            <NavLink className="text-gray-400" to="/user/nord-services/locker">NordLocker</NavLink>
          </Dropdown.Item>
        </Dropdown>

        {/* Withdraw */}
        {role !== 'user' && (
          <NavLink to="/user/withdraw" className={linkClasses}>
            <BsBank2 /> <span>Withdraw</span>
          </NavLink>
        )}

        {/* VTU Service - Hide for Cameroon */}
        {country !== 'Cameroon' && (
          <NavLink to="/user/vtu" className={linkClasses}>
            <FaMobile /> <span>VTU Service</span>
          </NavLink>
        )}

        <a
          href="https://mrbeanpanel.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
        >
          <TiFlashOutline /> <span>Boost Accounts</span>
        </a>

        <NavLink to="/user/order" className={linkClasses}>
          <BiSolidPurchaseTag /> <span>My Purchase</span>
        </NavLink>

        <NavLink to="/user/report-list" className={linkClasses}>
          <IoListCircle /> <span>My Report</span>
        </NavLink>

        <NavLink to="/user/international-airtime" className={linkClasses}>
          <BiWorld /> <span>International Airtime</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

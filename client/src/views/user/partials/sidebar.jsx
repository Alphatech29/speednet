import React, { useContext } from "react";
import { HiViewGrid } from "react-icons/hi"; // ✅ from 'hi'
import { FaShop, FaShopify, FaWallet, FaMobile, FaWifi } from "react-icons/fa6"; // ✅ all from 'fa6'
import { BiSolidPurchaseTag, BiWorld } from "react-icons/bi"; // ✅ from 'bi'
import { NavLink } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { AuthContext } from "../../../components/control/authContext";
import { MdAddBusiness } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";
import { SiNordvpn } from "react-icons/si";


const linkClasses = "flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay";

const Sidebar = ({ isOpen }) => {
  const { user } = useContext(AuthContext);
  const isMerchant = user?.role === "merchant";

  return (
    <div className="side-bar  sticky  bg-gray-800 text-slate-200 px-4 pb-4 pt-3">
      <div className="mb-4 w-full border-b border-gray-700">
        <a href="/">
          <img src="/image/user-logo.png" alt="Logo" className="h-10" />
        </a>
      </div>

      <div className="gap-4 flex flex-col">
        {!isMerchant && (
          <NavLink to="/user/become-a-merchant" className="flex items-center p-2 gap-2 text-base bg-primary-600 rounded-lg hover:text-pay">
            <MdAddBusiness /> <span>Become a Merchant</span>
          </NavLink>
        )}

        {isMerchant && (
          <NavLink to="/user/dashboard" className={linkClasses}>
            <HiViewGrid /> <span>Dashboard</span>
          </NavLink>
        )}

        <NavLink to="/user/marketplace" className={linkClasses}>
          <FaShop /> <span>Marketplace</span>
        </NavLink>

        {isMerchant && (
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

        {isMerchant && (
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
            <Dropdown.Item as="div">
              <NavLink className="text-gray-400" to="/user/nord-services/pass">NordPass</NavLink>
            </Dropdown.Item>
          </Dropdown>
        )}

        {isMerchant && (
          <NavLink to="/user/withdraw" className={linkClasses}>
            <BsBank2 /> <span>Withdraw</span>
          </NavLink>
        )}

        <NavLink to="/user/airtime" className={linkClasses}>
          <FaMobile /> <span>Airtime Purchase</span>
        </NavLink>

        <NavLink to="/user/data" className={linkClasses}>
          <FaWifi /> <span>Data Purchase</span>
        </NavLink>

        <NavLink to="/user/order" className={linkClasses}>
          <BiSolidPurchaseTag /> <span>My Purchase</span>
        </NavLink>

        <NavLink to="/user/international-airtime" className={linkClasses}>
          <BiWorld /> <span>International Airtime</span>
        </NavLink>

      
      </div>
    </div>
  );
};

export default Sidebar;

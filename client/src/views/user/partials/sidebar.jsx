import React, { useContext } from "react";
import { HiViewGrid } from "react-icons/hi";
import { FaShop, FaShopify } from "react-icons/fa6";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaWallet } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { AuthContext } from "../../../components/control/authContext";
import { MdAddBusiness } from "react-icons/md";

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  // Check if user is a merchant
  const isMerchant = user?.role === "merchant";

  return (
    <div className="side-bar h-screen bg-gray-800 text-slate-200 px-4 pb-4 pt-3">
      {/* Logo Section */}
      <div className="mb-4 w-full border-b border-gray-700">
        <a href="/">
          <img src="/image/user-logo.png" alt="Logo" className="h-10" />
        </a>
      </div>

      {/* Sidebar Navigation */}
      <div className="gap-4 flex flex-col">
        {/* Hide "Become a Merchant" if the user is already a merchant */}
        {!isMerchant && (
          <NavLink
            to="/user/become-a-marchant"
            className="flex items-center p-2 gap-2 text-base bg-primary-600 rounded-lg hover:text-pay"
          >
            <MdAddBusiness /> <span>Become a Merchant</span>
          </NavLink>
        )}

        {isMerchant && (
          <NavLink
            to="/user/dashboard"
            className="flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay"
          >
            <HiViewGrid /> <span>Dashboard</span>
          </NavLink>
        )}

        <NavLink
          to="/user/marketplace"
          className="flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay"
        >
          <FaShop /> <span>Marketplace</span>
        </NavLink>

        {/* Show Products only if the user is a merchant */}
        {isMerchant && (
          <Dropdown
            label={
              <span className="flex items-center gap-2">
                <FaShopify /> Products
              </span>
            }
            inline
            className="bg-gray-800 text-white border-none"
          >
            <Dropdown.Item>
              <NavLink className="text-gray-400" to="/user/add-product">Add Product</NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <NavLink className="text-gray-400" to="/user/my-products">My Products</NavLink>
            </Dropdown.Item>
          </Dropdown>
        )}

        <NavLink
          to="/user/order"
          className="flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay"
        >
          <BiSolidPurchaseTag />
          <span>My Purchase</span>
        </NavLink>

        <NavLink
          to="/user/wallet"
          className="flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay"
        >
          <FaWallet />
          <span>My Wallet</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

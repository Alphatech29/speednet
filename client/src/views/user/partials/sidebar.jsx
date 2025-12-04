import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { AuthContext } from "../../../components/control/authContext";
import { getAllPlatformCate } from "../../../components/backendApis/accounts/accounts";
import { HiViewGrid } from "react-icons/hi";
import {
  FaShop,
  FaShopify,
  FaWallet,
  FaMobile,
  FaEnvelope,
  FaGamepad,
  FaUser,
  FaGlobe,
} from "react-icons/fa6";
import { BiSolidPurchaseTag, BiWorld } from "react-icons/bi";
import { MdAddBusiness } from "react-icons/md";
import { GiVirtualMarker } from "react-icons/gi";
import { BsBank2 } from "react-icons/bs";
import { SiNordvpn } from "react-icons/si";
import { TiFlashOutline } from "react-icons/ti";
import { IoListCircle, IoShareSocialOutline } from "react-icons/io5";

const types = [
  { name: "Social Media", icon: IoShareSocialOutline },
  { name: "Email & Messaging", icon: FaEnvelope },
  { name: "VPN & Proxys", icon: SiNordvpn },
  { name: "Website", icon: FaGlobe },
  { name: "E-Commerce Platform", icon: FaShopify },
  { name: "Gaming", icon: FaGamepad },
  { name: "Account & Subscription", icon: FaUser },
  { name: "Other", icon: FaGlobe },
];

const linkClasses =
  "flex items-center gap-2 text-base hover:bg-primary-600 hover:p-2 hover:rounded-lg hover:text-pay";

const Sidebar = ({
  platformFilter,
  setPlatformFilter = () => {},
  priceRange = [0, 1000],
  setPriceRange = () => {},
}) => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const country = user?.country;

  const [activeTab, setActiveTab] = useState("menu");
  const [platforms, setPlatforms] = useState({});
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handlePriceChange = (e, index) => {
    const value = Number(e.target.value);
    const newRange = [...localPriceRange];

    if (index === 0) {
      newRange[0] = Math.min(value, newRange[1]);
    } else {
      newRange[1] = Math.max(value, newRange[0]);
    }

    setLocalPriceRange(newRange);
    setPriceRange(newRange);
  };

  useEffect(() => {
    const width = window.innerWidth;
    if (width < 768) {
      setActiveTab("menu");
    } else {
      setActiveTab(role === "merchant" ? "menu" : "categories");
    }
  }, [role]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await getAllPlatformCate();
        if (response.success) {
          const data = response.data?.platforms || [];
          const grouped = data.reduce((acc, platform) => {
            const { type, name, id, image_path, price } = platform;
            if (!acc[type]) acc[type] = [];
            acc[type].push({ name, id, image_path, price });
            return acc;
          }, {});
          setPlatforms(grouped);
        } else {
          console.error("Failed to fetch platforms:", response.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPlatforms();
  }, []);

  return (
    <div className="overflow-auto text-left bottom-0 w-[265px] h-full bg-gray-800 text-slate-200 px-4 pb-4 pt-3 z-50 fixed top-0 left-0 mobile:overflow-y-auto">
      
      <div className="mb-4 w-full border-b border-gray-700 flex justify-center pc:block">
        <NavLink to="/">
          <img src="/image/user-logo.png" alt="Logo" className="h-10" />
        </NavLink>
      </div>

      <div className="mobile:hidden tab:flex justify-between mb-4 gap-2">
        <button
          onClick={() => setActiveTab("menu")}
          className={`flex-1 p-2 rounded-lg ${
            activeTab === "menu"
              ? "bg-primary-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Menu
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex-1 p-2 rounded-lg ${
            activeTab === "categories"
              ? "bg-primary-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Categories
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* MENU */}
        {activeTab === "menu" && (
          <>
            {role !== "merchant" && (
              <NavLink
                to="/user/become-a-marchant"
                className="flex items-center p-2 gap-2 text-base bg-primary-600 rounded-lg hover:text-pay"
              >
                <MdAddBusiness /> <span>Become a Merchant</span>
              </NavLink>
            )}

            {role !== "user" && (
              <NavLink to="/user/dashboard" className={linkClasses}>
                <HiViewGrid /> <span>Dashboard</span>
              </NavLink>
            )}

            <NavLink to="/user/marketplace" className={linkClasses}>
              <FaShop /> <span>Marketplace</span>
            </NavLink>

            {role !== "user" && (
              <Dropdown
                label={
                  <span className="flex items-center gap-2">
                    <FaShopify /> Products
                  </span>
                }
                inline
                className="bg-gray-800 text-white border-none"
              >
                <Dropdown.Item as="div">
                  <NavLink className="text-gray-400" to="/user/add-product">
                    Add Product
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item as="div">
                  <NavLink className="text-gray-400" to="/user/my-products">
                    My Products
                  </NavLink>
                </Dropdown.Item>
              </Dropdown>
            )}

            <NavLink to="/user/wallet" className={linkClasses}>
              <FaWallet /> <span>My Wallet</span>
            </NavLink>

            <Dropdown
              label={
                <span className="flex items-center gap-2">
                  <GiVirtualMarker /> Sms-Virtual-Phone
                </span>
              }
              inline
              className="bg-gray-800 text-white border-none"
            >
              <Dropdown.Item as="div">
                <NavLink className="text-gray-400" to="/user/sms-service">
                  Portal
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item as="div">
                <NavLink className="text-gray-400" to="/user/get-number">
                  Get Number
                </NavLink>
              </Dropdown.Item>
            </Dropdown>

            <Dropdown
              label={
                <span className="flex items-center gap-2">
                  <SiNordvpn /> Nord Services
                </span>
              }
              inline
              className="bg-gray-800 text-white border-none"
            >
              <Dropdown.Item as="div">
                <NavLink className="text-gray-400" to="/user/nord-services/vpn">
                  NordVPN
                </NavLink>
              </Dropdown.Item>

              <Dropdown.Item as="div">
                <NavLink className="text-gray-400" to="/user/nord-services/locker">
                  NordLocker
                </NavLink>
              </Dropdown.Item>
            </Dropdown>

            {role !== "user" && (
              <NavLink to="/user/withdraw" className={linkClasses}>
                <BsBank2 /> <span>Withdraw</span>
              </NavLink>
            )}

            {country === "Nigeria" && (
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
          </>
        )}

        {/* CATEGORIES */}
        {activeTab === "categories" && (
          <>
            <div className="border-b-2 text-gray-200 py-2">
              <h1>Filter</h1>
              <p>Account Categories</p>
            </div>
            {/* PLATFORM FILTER */}
            {types.map(({ name, icon: Icon }) => (
              <Dropdown
                key={name}
                label={
                  <span className="flex items-center gap-2">
                    <Icon /> {name}
                  </span>
                }
                inline
                className="bg-gray-800 text-white border-none mb-2"
              >
                {(platforms[name] || [])
                  .filter(
                    (platform) =>
                      platform.price === undefined ||
                      (platform.price >= localPriceRange[0] &&
                        platform.price <= localPriceRange[1])
                  )
                  .map((platform) => (
                    <Dropdown.Item
                      key={platform.id}
                      as="button"
                      onClick={() => setPlatformFilter(platform.name)}
                      className={`flex items-center gap-2 text-left w-full ${
                        platformFilter === platform.name
                          ? "bg-primary-600 text-white rounded"
                          : "text-gray-400"
                      }`}
                    >
                      {platform.image_path && (
                        <img
                          src={platform.image_path}
                          alt={platform.name}
                          className="h-5 w-5 rounded-full object-contain"
                        />
                      )}
                      <span>{platform.name}</span>
                    </Dropdown.Item>
                  ))}

                {(platforms[name] || []).filter(
                  (platform) =>
                    platform.price === undefined ||
                    (platform.price >= localPriceRange[0] &&
                      platform.price <= localPriceRange[1])
                ).length === 0 && (
                  <Dropdown.Item as="div">
                    <span className="text-gray-400 text-sm">No platforms category</span>
                  </Dropdown.Item>
                )}
              </Dropdown>
            ))}
             {/* PRICE FILTER */}
            <div className="flex flex-col gap-2 mt-2 px-2">
              <p>Price Filter</p>
              <div className="flex justify-between text-white text-sm">
                <span>${localPriceRange[0]}</span>
                <span>${localPriceRange[1]}</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={localPriceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="accent-primary-600 flex-1"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

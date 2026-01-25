import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../components/control/authContext";
import { getAllPlatformCate } from "../../../components/backendApis/accounts/accounts";
import { getDarkCategories } from "../../../components/backendApis/admin/apis/darkshop";

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
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";
import { BiSolidPurchaseTag, BiWorld } from "react-icons/bi";
import { MdAddBusiness } from "react-icons/md";
import { GiVirtualMarker } from "react-icons/gi";
import { BsBank2 } from "react-icons/bs";
import { SiNordvpn } from "react-icons/si";
import { TiFlashOutline } from "react-icons/ti";
import { IoListCircle, IoShareSocialOutline } from "react-icons/io5";

/* ---------------- PLATFORM TYPES ---------------- */
const types = [
  { name: "Advanced", icon: FaGlobe },
  { name: "Social Media", icon: IoShareSocialOutline },
  { name: "Email & Messaging", icon: FaEnvelope },
  { name: "VPN & Proxys", icon: SiNordvpn },
  { name: "Website", icon: FaGlobe },
  { name: "E-Commerce Platform", icon: FaShopify },
  { name: "Gaming", icon: FaGamepad },
  { name: "Account & Subscription", icon: FaUser },
  { name: "Other", icon: FaGlobe },
];

const PRIORITY_PLATFORMS = [
  "Facebook",
  "Twitter-X",
  "Instagram",
  "Snapchat",
  "LinkedIn",
];

const linkClasses =
  "flex items-center gap-2 text-base hover:bg-primary-600 p-2 rounded-lg hover:text-pay";

/* ---------------- DROPDOWN ---------------- */
const SidebarDropdown = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer p-2 bg-gray-800 text-white hover:bg-primary-600 rounded-lg"
      >
        <div className="flex items-center gap-2">{label}</div>
        {open ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
      </div>
      {open && <div className="ml-4 mt-1 flex flex-col gap-1">{children}</div>}
    </div>
  );
};

/* ---------------- SIDEBAR ---------------- */
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
  const [darkCategories, setDarkCategories] = useState([]);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  /* -------- PRICE FILTER -------- */
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    const newRange = [value, localPriceRange[1]];
    setLocalPriceRange(newRange);
    setPriceRange(newRange);
  };

  /* -------- ACTIVE TAB -------- */
  useEffect(() => {
    const width = window.innerWidth;
    setActiveTab(width < 768 ? "menu" : role === "merchant" ? "menu" : "categories");
  }, [role]);

  /* -------- FETCH NORMAL PLATFORMS -------- */
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await getAllPlatformCate();
        if (response.success) {
          const grouped = (response.data?.platforms || []).reduce((acc, p) => {
            const { type, name, id, image_path } = p;
            if (!acc[type]) acc[type] = [];
            acc[type].push({ name, id, image_path });
            return acc;
          }, {});
          setPlatforms(grouped);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlatforms();
  }, []);

  /* -------- FETCH DARK CATEGORIES -------- */
  useEffect(() => {
    const fetchDarkCategories = async () => {
      try {
        const response = await getDarkCategories();
        if (response.success) setDarkCategories(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDarkCategories();
  }, []);

  /* -------- RENDER NORMAL PLATFORM ITEMS -------- */
  const renderGroupItems = (items) =>
    items
      .sort((a, b) => {
        const aPriority = PRIORITY_PLATFORMS.indexOf(a.name);
        const bPriority = PRIORITY_PLATFORMS.indexOf(b.name);
        if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;
        return a.name.localeCompare(b.name);
      })
      .map((platform) => (
        <button
          key={platform.id || platform.name}
          onClick={() => setPlatformFilter({ name: platform.name })}
          className={`flex items-center gap-2 text-left w-full p-1 rounded ${
            platformFilter?.name === platform.name
              ? "bg-primary-600 text-white"
              : "text-gray-400 hover:bg-gray-700"
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
        </button>
      ));

  /* -------- RENDER DARK CATEGORIES -------- */
  const renderDarkCategoryItems = (categories) =>
    categories.map((category) => (
      <SidebarDropdown
        key={category.id}
        label={
          <div className="flex items-center gap-2">
            {category.icon && (
              <img
                src={category.icon}
                alt={category.name}
                className="h-5 w-5 rounded-full"
              />
            )}
            {category.name}
          </div>
        }
      >
        {category.groups?.map((group) => (
          <button
            key={group.id}
            onClick={() =>
              setPlatformFilter({
                categoryId: category.id,
                groupId: group.id,
              })
            }
            className={`flex items-center gap-2 text-left w-full p-1 rounded ${
              platformFilter?.groupId === group.id
                ? "bg-primary-600 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <span>{group.name}</span>
          </button>
        ))}
      </SidebarDropdown>
    ));

  return (
    <div className="text-left w-[265px] h-screen bg-gray-800 text-slate-200 fixed top-0 left-0 z-50 flex flex-col">
      {/* LOGO */}
      <div className="mb-4 w-full border-b border-gray-700 flex justify-start items-center p-3">
        <NavLink to="/">
          <img src="/image/user-logo.png" alt="Logo" className="h-10" />
        </NavLink>
      </div>

      {/* MOBILE TABS */}
      <div className="flex md:hidden justify-between mb-4 gap-2 px-2">
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

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-2 mb-5">
        {/* -------- MENU -------- */}
        {activeTab === "menu" && (
          <div className="flex flex-col gap-2">
            {role !== "merchant" && (
              <NavLink
                to="/user/become-a-marchant"
                className={`${linkClasses} bg-primary-600`}
              >
                <MdAddBusiness /> Become a Merchant
              </NavLink>
            )}

            {role !== "user" && (
              <NavLink to="/user/dashboard" className={linkClasses}>
                <HiViewGrid /> Dashboard
              </NavLink>
            )}

            <NavLink to="/user/marketplace" className={linkClasses}>
              <FaShop /> Marketplace
            </NavLink>

            {role !== "user" && (
              <SidebarDropdown label={<><FaShopify /> Products</>}>
                <NavLink to="/user/add-product" className="text-gray-400 hover:text-white p-1">
                  Add Product
                </NavLink>
                <NavLink to="/user/my-products" className="text-gray-400 hover:text-white p-1">
                  My Products
                </NavLink>
              </SidebarDropdown>
            )}
            <NavLink to="/user/order" className={linkClasses}>
              <BiSolidPurchaseTag /> My Purchase
            </NavLink>

            <NavLink to="/user/report-list" className={linkClasses}>
              <IoListCircle /> My Report
            </NavLink>
            <a
              href="https://mrbeanpanel.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              <TiFlashOutline /> Boost Accounts
            </a>

            <SidebarDropdown label={<><GiVirtualMarker /> Sms-Virtual-Phone</>}>
              <NavLink to="/user/sms-service" className="text-gray-400 hover:text-white p-1">
                Portal
              </NavLink>
              <NavLink to="/user/get-number" className="text-gray-400 hover:text-white p-1">
                Get Number
              </NavLink>
            </SidebarDropdown>

            <NavLink to="/user/wallet" className={linkClasses}>
              <FaWallet /> My Wallet
            </NavLink>



            {role !== "user" && (
              <NavLink to="/user/withdraw" className={linkClasses}>
                <BsBank2 /> Withdraw
              </NavLink>
            )}

            {country === "Nigeria" && (
              <NavLink to="/user/vtu" className={linkClasses}>
                <FaMobile /> VTU Service
              </NavLink>
            )}




            <NavLink to="/user/international-airtime" className={linkClasses}>
              <BiWorld /> International Airtime
            </NavLink>
          </div>
        )}

        {/* -------- CATEGORIES -------- */}
        {activeTab === "categories" && (
          <div className="flex flex-col gap-2">
            <div className="border-b-2 text-gray-200 py-2">
              <h1>Filter</h1>
              <p>Account Categories</p>
            </div>

            {types.map(({ name, icon: Icon }) => (
              <SidebarDropdown key={name} label={<><Icon /> {name}</>}>
                {name === "Advanced"
                  ? renderDarkCategoryItems(darkCategories)
                  : renderGroupItems(platforms[name] || [])}
              </SidebarDropdown>
            ))}

            {/* PRICE FILTER */}
            <div className="flex flex-col gap-2 mt-2 px-2">
              <p>Price Filter</p>
              <div className="flex justify-between text-white text-sm">
                <span>${localPriceRange[0]}</span>
                <span>${localPriceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={localPriceRange[0]}
                onChange={handlePriceChange}
                className="accent-primary-600 w-full"
              />

              {/* CLEAR FILTERS */}
              <button
                onClick={() => {
                  setPlatformFilter({});
                  setLocalPriceRange([0, 1000]);
                  setPriceRange([0, 1000]);
                }}
                className="mt-2 p-2 bg-primary-600 rounded text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Sidebar;

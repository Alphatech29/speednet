import React, { useState, useContext, useEffect, useRef } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdNotificationsActive } from "react-icons/md";
import { IoNotificationsOffSharp } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from "../../../components/control/authContext";
import Cart from "../shop/cart/cart";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const profileRef = useRef(null);
  const noticeRef = useRef(null);
  const cartRef = useRef(null);

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
    setIsCartOpen(false);
    setIsNoticeOpen(false);
  };

  const toggleNoticeDropdown = () => {
    setIsNoticeOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsCartOpen(false);
  };

  const toggleCartDropdown = () => {
    setIsCartOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsNoticeOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        noticeRef.current &&
        !noticeRef.current.contains(event.target) &&
        cartRef.current &&
        !cartRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
        setIsNoticeOpen(false);
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-slate-800 shadow-lg px-4 py-2 text-white">
      <div className="flex w-full justify-end items-end space-x-3 relative">
        {/* Notification Icon */}
        <span ref={noticeRef} className="relative">
          <MdNotificationsActive
            className="text-[40px] rounded-full shadow-lg p-2 cursor-pointer"
            onClick={toggleNoticeDropdown}
          />
          {isNoticeOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-700 text-white rounded-lg shadow-lg py-6 px-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[25px] text-gray-400">
                  <IoNotificationsOffSharp />
                </span>
                <p className="text-gray-400 text-center">No new notifications</p>
              </div>
            </div>
          )}
        </span>

        {/* Cart Component */}
        <span ref={cartRef}>
          <Cart isCartOpen={isCartOpen} toggleCartDropdown={toggleCartDropdown} />
        </span>

        {/* Profile Icon */}
        <span ref={profileRef} className="relative">
          <img
            src={user?.avatar}
            alt="Profile"
            loading="lazy"
            height="40"
            width="40"
            className="rounded-full shadow-lg cursor-pointer"
            onClick={toggleProfileDropdown}
          />

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-700 text-white rounded-lg shadow-lg py-2 px-2">
              <div className="flex flex-col px-4 border-b border-slate-400 mb-3 pb-3">
                <p className="text-sm font-bold">{user.full_name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <a href="/profile" className="flex items-center px-4 py-2 hover:text-primary-600">
                <CgProfile className="mr-2" /> Profile
              </a>
              <a href="/settings" className="flex items-center px-4 py-2 hover:text-primary-600">
                <IoIosSettings className="mr-2" /> Settings
              </a>
              <button
                onClick={logout}
                className="border-t flex items-center border-gray-500 w-full text-left px-4 py-2 hover:text-primary-600"
              >
                <RiLogoutCircleRLine className="mr-2" /> Logout
              </button>
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;

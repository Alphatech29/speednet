import React, { useState, useContext } from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdNotificationsActive } from "react-icons/md";
import { IoNotificationsOffSharp } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../../../components/control/authContext';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  // Toggle Profile Dropdown
  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
    setIsCartOpen(false);
    setIsNoticeOpen(false);
  };

  // Toggle Cart Dropdown
  const toggleCartDropdown = () => {
    setIsCartOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsNoticeOpen(false);
  };

  // Toggle Notification Dropdown
  const toggleNoticeDropdown = () => {
    setIsNoticeOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsCartOpen(false);
  };

  return (
    <div className='w-full bg-slate-600 px-4 py-2 text-white'>
      <div className='flex w-full justify-end items-end space-x-3 relative'>
        
        {/* Notification Icon */}
        <span className='relative'>
          <MdNotificationsActive 
            className='text-[40px] rounded-full shadow-lg p-2 cursor-pointer' 
            onClick={toggleNoticeDropdown}
          />
          {isNoticeOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-700 text-white rounded-lg shadow-lg py-6 px-4">
              <div className='flex justify-center items-center flex-col gap-2'>
                <span className='text-[25px] text-gray-400'><IoNotificationsOffSharp />
                </span>
                <p className="text-gray-400 text-center">No new notifications</p>
              </div>
             
            </div>
          )}
        </span>

        {/* Cart Icon */}
        <span className='relative'>
          <FiShoppingCart 
            className='text-[40px] rounded-full shadow-lg p-2 cursor-pointer' 
            onClick={toggleCartDropdown} 
          />
          {isCartOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-slate-700 text-white rounded-lg shadow-lg py-6 px-2">
              <div className='justify-center items-center flex flex-col'>
                <span className='text-[40px] rounded-full shadow-lg p-4 bg-slate-100 '>
                  <FiShoppingCart className='text-gray-600'/>
                </span>
                <p className="px-4 py-2 text-base text-gray-400">Your cart is empty</p> 
              </div>
            </div>
          )}
        </span>
        
        {/* Profile Icon */}
        <span className='relative'>
          <img 
            src="/images/people/profile-picture-3.jpg" 
            alt="Profile"
            loading='lazy' 
            height="40" 
            width="40" 
            className="rounded-full shadow-lg cursor-pointer" 
            onClick={toggleProfileDropdown}
          />
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-700 text-white rounded-lg shadow-lg py-2 px-2">
              <a href="/profile" className="flex justify-start items-center px-4 py-2 hover:text-primary-600">
                <span className='mr-2'><CgProfile /></span>Profile
              </a>
              <a href="/settings" className="flex justify-start items-center px-4 py-2 hover:text-primary-600">
                <span className='mr-2'><IoIosSettings /></span>Settings
              </a>
              <button onClick={logout} className="border-t flex justify-start items-center border-gray-500 w-full text-left px-4 hover:text-primary-600">
                <span className='mr-2'><RiLogoutCircleRLine /></span>Logout
              </button>
            </div>
          )}
        </span>
      </div>
    </div>
  );
}

export default Header;

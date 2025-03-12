import React, { useState, useContext } from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { MdNotificationsActive } from "react-icons/md";
import { AuthContext } from '../../../components/control/authContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  return (
    <div className='w-full bg-slate-600 px-4 py-2 text-white'>
      <div className='flex w-full justify-end items-end space-x-3 relative'>
        <span className='text-[25px] rounded-full shadow-lg p-2'><MdNotificationsActive /></span>
        <span className='text-[25px] rounded-full shadow-lg p-2'><FiShoppingCart /></span>
        
        <span className='relative'>
          <img 
            src="/images/people/profile-picture-3.jpg" 
            alt="Profile" 
            height="40" 
            width="40" 
            className="rounded-full shadow-lg cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
          />
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-700 text-white rounded-lg shadow-lg py-2 px-2">
              <a href="/profile" className="block px-4 py-2 hover:text-primary-600">Profile</a>
              <a href="/settings" className="block px-4 py-2 hover:text-primary-600">Settings</a>
              <button onClick={logout} className="block border-t border-gray-500 w-full text-left px-4 hover:text-primary-600">Logout</button>
            </div>
          )}
        </span>
      </div>
    </div>
  );
}

export default Header;

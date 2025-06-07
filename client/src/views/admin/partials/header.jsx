import React, { Fragment } from 'react';
import { Menu } from '@headlessui/react';
import { IoNotificationsOutline } from "react-icons/io5";


const links = [
  { href: '/admin/settings', label: 'Settings' },
   { href: '/admin/support', label: 'Need Help' },
  { href: '/sign-out', label: 'Sign out' },
];

const Header = () => {
  return (
    <div className='w-full sticky z-50 top-0 bg-[#e4e4e7] border-b-[0.50px] border-zinc-400 flex justify-between items-center px-4 py-3'>
      <div>
        <h1 className='pc:text-[20px] mobile:text-[14px] font-bold text-start'>
          Administrative Panel
        </h1>
        <p className='text-[14px] text-gray-500 text-start'>
          Here’s what’s happening with your store today.
        </p>
      </div>
      <div className='flex items-center gap-3'>
         <Menu as="div" className="relative inline-block text-left ">
          <Menu.Button className="rounded-full focus:outline-none">
          <div className='  h-10 w-10 bg-white  p-2 rounded-full flex justify-center items-center'><IoNotificationsOutline  className='text-[20px] relative'/> <span className='bg-red-500 text-[10px] rounded-full text-white px-[2px] py-[1px] absolute top-0 right-0 '>0</span></div>
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none min-h-[200px] z-50 px-3 py-2">
            <div className='text-[16px] '><h1>No Message at the moment</h1></div>
          
          </Menu.Items>
        </Menu>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="rounded-full focus:outline-none">
            <img src="/image/iuuu" alt="profile" className='h-10 w-10 rounded-full bg-white'  />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
            {links.map((link) => (
              <Menu.Item key={link.href} as={Fragment}>
                {({ active }) => (
                  <a
                    href={link.href}
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-blue-500 text-white' : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                  </a>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default Header;

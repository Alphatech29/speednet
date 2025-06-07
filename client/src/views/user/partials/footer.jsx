import React from "react";
import { BiMenu } from "react-icons/bi";
import { RiHome3Fill } from "react-icons/ri";
import { FaShop } from "react-icons/fa6";
import { NavLink } from "react-router-dom";


const Footer = ({ toggleSidebar }) => {
  return (
    <div className="w-full bg-slate-800 pc:hidden shadow-lg px-4 py-2 text-white mobile:fixed mobile:bottom-0 mobile:z-10">
      <div className="flex w-full justify-between items-center">
        {/* Menu Icon */}
         <div className="mobile:flex  justify-start items-start ">
          <div className=" cursor-pointer flex flex-col justify-center items-center">
           <NavLink to="/user/dashboard" className="flex flex-col justify-center items-center">
            <RiHome3Fill className="text-[30px]" />
            <span className="text-[10px]">Dashboard</span>
           </NavLink>
          </div>
        </div>

         <div className="mobile:flex justify-start items-start ">
          <div className=" cursor-pointer flex flex-col justify-center items-center">
           <NavLink to="/user/marketplace" className="flex flex-col justify-center items-center">
            <FaShop className="text-[30px]" />
            <span className="text-[10px]">Marketplace</span>
           </NavLink>
          </div>
        </div>

         <div className="mobile:flex  justify-start items-start ">
          <div className=" cursor-pointer flex flex-col justify-center items-center">
           <NavLink to="/user/dashboard" className="flex flex-col justify-center items-center">
            <RiHome3Fill className="text-[30px]" />
            <span className="text-[10px]">Dashboard</span>
           </NavLink>
          </div>
        </div>


        <div className="mobile:flex pc:hidden justify-start items-start ">
          <div className="cursor-pointer flex flex-col justify-center items-center" >
            <NavLink to="#" onClick={toggleSidebar} className="flex flex-col justify-center items-center">
              <BiMenu className="text-[30px]" />
            <span className="text-[10px]">Menu</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

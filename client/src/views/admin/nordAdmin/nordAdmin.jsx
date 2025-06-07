import React from 'react';
import { FaUsers } from "react-icons/fa";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { PiChartPieSliceThin } from "react-icons/pi";

import '../cssFile/dashboard.css'; // Assuming you have a CSS file for dashboard styles




const NordAdmin = () => {
  return (
    <div className='flex flex-col gap-3 '>
      <div>
        <h1 className='title text-[18px] font-semibold text-zinc-700'>Nord Reseller Admin</h1>
      </div>
      <div className='flex gap-5 '>
        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#006666]'>
          <span className='text-zinc-400'>Funds</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>$200</h1>
            <div className='bg-[#006666]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'><FaMoneyCheckAlt className='text-[24px] text-[#006666]' /></div>
          </div>
        </div>

        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#f7a740]'>
          <span className='text-zinc-400'>Sales</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>$50</h1>
            <div className='bg-[#f7a740]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'><FaChartLine className='text-[24px] text-[#f7a740]' /></div>
          </div>
        </div>

         <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#e65733]'>
          <span className='text-zinc-400'>Commission</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>$0</h1>
            <div className='bg-[#e65733]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'><PiChartPieSliceThin className='text-[24px] text-[#e65733]' /></div>
          </div>
        </div>

         <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#979797]'>
          <span className='text-zinc-400'>Total Merchant</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>2,000</h1>
            <div className='bg-[#979797]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'><FaUsers className='text-[24px] text-[#979797]' /></div>
          </div>
        </div>
      </div>
    
    </div>
  );
}

export default NordAdmin;

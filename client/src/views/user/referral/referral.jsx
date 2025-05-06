import React from 'react';
import { HiGiftTop } from "react-icons/hi2";
import { IoMdWallet } from "react-icons/io";
import { FaUsers } from "react-icons/fa";




const Referral = () => {
  return (
    <div>
      <div className='text-gray-300'>
        <h1 className='text-lg font-semibold'>Referral</h1>
        <p>Boost your earnings by inviting friends to join Speednet.</p>
      </div>
      <div>
        <div className='flex gap-5 w-full mt-3'>
          <div className='flex flex-col justify-center items-center gap-4 bg-gray-800 rounded-lg p-5 w-[50%]'>
            <span><HiGiftTop className='text-[5rem] text-amber-600' /></span>
           <div className='flex flex-col justify-center items-center gap-2'>
           <h1 className='text-gray-200 text-2xl'>Receive <strong>$5</strong> reward instantly</h1>
           <p className='text-center text-gray-300 text-base'>When your friend registers, funds wallet with minimum of <strong>$25</strong> and purchases at least one <strong>account</strong>, you get rewarded instantly.</p>
           </div>
           <div className='flex flex-col justify-center items-center gap-2'>
            <h2 className='text-base text-gray-200'>How to use invitation code</h2>
            <div>

            </div>
           </div>
          </div>

          <div className='flex flex-col w-[50%]'>
            <h1 className='text-gray-200 mb-3'>Referral Record</h1>
           <div className='flex gap-7 text-gray-300 bg-gray-800 rounded-lg p-3'>
            <div className='flex flex-col justify-start items-start gap-3'>
            <div className='flex justify-start items-center gap-2'><IoMdWallet/>Total Earned</div>
            <span>0</span>
            </div>
            <div className='flex flex-col justify-start items-start gap-3'>
            <div className='flex justify-start items-center gap-2'><FaUsers/>Invitees</div>
            <span>0</span>
            </div>
           </div>
           <div className='flex gap-7 text-gray-300 bg-gray-800 rounded-lg p-3 mt-3'>
            <div className='flex flex-col justify-start items-start gap-5 h-[500px]'>
            <div className='flex justify-start gap-3 border-b  w-full'>
              <span>Pending</span>
              <span>Completed</span>
              </div>
            
            </div>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Referral;

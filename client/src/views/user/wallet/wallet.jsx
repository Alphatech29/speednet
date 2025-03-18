import React from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { RiExchangeDollarFill } from "react-icons/ri";
import Transaction from "./../history/transaction";



const Wallet = () => {
  return (
    <div className='w-full h-screen flex flex-col'>
      <div className='text-lg font-medium text-gray-200 '>Wallet</div>
      <div className='w-full gap-4 flex justify-start items-center pt-3'>
        <div className='bg-primary-600 w-80 h-40 rounded-lg flex flex-col gap-2 justify-center items-center'>
          <span className='text-pay text-sm'>Available Balance</span>
          <p className='text-pay text-lg font-semibold'>$10,000.00</p>
        </div>

        <div className='w-80 h-40 rounded-lg  flex flex-col justify-between items-center'>
         <div className='bg-zinc-700 shadow-md w-full  rounded-lg px-3 py-4 flex justify-center items-center'>
          <button className='w-full flex justify-center items-center gap-3 text-gray-200 text-[17px]'><IoMdAddCircle className='text-[20px]'/>
          Add Fund</button>
         </div>
         <div className='bg-zinc-700 shadow-md w-full rounded-lg px-3 py-4 flex justify-center items-center'>
          <button className='w-full flex justify-center items-center gap-3 text-gray-200 text-[17px]'><RiExchangeDollarFill className='text-[20px]'/>
          Withdraw</button>
         </div>
        </div>

        <div className='bg-gray-800 w-80 h-40 rounded-lg shadow-md   flex flex-col justify-center items-center p-3'>
         <div className='flex flex-col justify-center items-center gap-2 text-pay'>
         <span className='text-sm'>Escrow Balance</span>
         <span className='font-semibold text-base'>$30,000.00</span>
         </div>
        </div>
      </div>
      <Transaction/>
    </div>
  );
}

export default Wallet;

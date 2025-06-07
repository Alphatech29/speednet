import React, { useEffect, useState } from 'react';
import { FaUsers } from "react-icons/fa";
import '../../cssFile/dashboard.css';
import DepositSubmition from './partials/deposit&submition';
import { getAllUsers } from '../../../../components/backendApis/admin/apis/users';

const DefaultDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();

      // Check if response is an array and contains expected structure
      if (Array.isArray(res) && res[0]?.data) {
        setUsers(res[0].data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);


  return (
    <div className='flex flex-col gap-3'>
      <div>
        <h1 className='title text-[18px] font-semibold text-zinc-700'>Dashboard</h1>
      </div>

      <div className='flex gap-5'>
        {/* Users Card */}
        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#006666]'>
          <span className='text-zinc-400'>User's</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>
              {loading ? 'Loading...' : users.length}
            </h1>
            <div className='bg-[#006666]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#006666]' />
            </div>
          </div>
        </div>

        {/* Other Cards (placeholders for now) */}
        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#f7a740]'>
          <span className='text-zinc-400'>Merchant's</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>2,000</h1>
            <div className='bg-[#f7a740]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#f7a740]' />
            </div>
          </div>
        </div>

        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#e65733]'>
          <span className='text-zinc-400'>Total Merchant</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>2,000</h1>
            <div className='bg-[#e65733]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#e65733]' />
            </div>
          </div>
        </div>

        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#979797]'>
          <span className='text-zinc-400'>Total Merchant</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>2,000</h1>
            <div className='bg-[#979797]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#979797]' />
            </div>
          </div>
        </div>
      </div>

      <DepositSubmition />
    </div>
  );
};

export default DefaultDashboard;

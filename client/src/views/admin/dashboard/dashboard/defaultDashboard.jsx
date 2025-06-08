import React, { useEffect, useState } from 'react';
import { FaUsers } from "react-icons/fa";
import '../../cssFile/dashboard.css';
import RecentSubmition from './partials/deposit&submition';
import { getAllUsers } from '../../../../components/backendApis/admin/apis/users';
import { GiTwoCoins } from "react-icons/gi";


const DefaultDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();

        if (res?.data && Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.warn("Unexpected response format:", res);
          setUsers([]);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const merchantCount = users.filter(user => user.role === 'merchant').length;

  return (
    <div className='flex flex-col gap-3'>
      <div>
        <h1 className='title text-[18px] font-semibold text-zinc-700'>Dashboard</h1>
      </div>

      <div className='flex justify-between items-center gap-5 w-full'>
        {/* Users Card */}
        <div className='bibb flex flex-col bg-white rounded-md gap-2 border-b-[0.90px] border-[#006666]'>
          <span className='text-zinc-400'>Users</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>
              {users.length}
            </h1>
            <div className='bg-[#006666]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#006666]' />
            </div>
          </div>
        </div>

        {/* Dynamic Merchant Card */}
        <div className='bibb flex flex-col bg-white rounded-md gap-2 border-b-[0.90px] border-[#f7a740]'>
          <span className='text-zinc-400'>Merchants</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>
              {merchantCount}
            </h1>
            <div className='bg-[#f7a740]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#f7a740]' />
            </div>
          </div>
        </div>

        {/* Static Cards (as-is) */}
        <div className='bibb flex flex-col bg-white rounded-md gap-2 border-b-[0.90px] border-[#e65733]'>
          <span className='text-zinc-400'>Product's</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>2,000</h1>
            <div className='bg-[#e65733]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#e65733]' />
            </div>
          </div>
        </div>

        <div className='bibb flex flex-col bg-white rounded-md gap-2 border-b-[0.90px] border-[#979797]'>
          <span className='text-zinc-400'>Total Payout</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>$2,000</h1>
            <div className='bg-[#979797]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <GiTwoCoins className='text-[24px] text-[#979797]' />
            </div>
          </div>
        </div>
      </div>

      <RecentSubmition />
    </div>
  );
};

export default DefaultDashboard;

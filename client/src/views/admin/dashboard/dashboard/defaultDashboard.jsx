import React, { useEffect, useState } from 'react';
import { FaUsers } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";
import '../../cssFile/dashboard.css';
import RecentSubmition from './partials/deposit&submition';
import { getAllUsers } from '../../../../components/backendApis/admin/apis/users';
import { getAllWithdrawals } from "../../../../components/backendApis/admin/apis/withdrawal";
import { getAllMerchantTransactions } from "../../../../components/backendApis/admin/apis/histroy";

const DefaultDashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [totalSystemAmount, setTotalSystemAmount] = useState(0);

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

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await getAllWithdrawals();
        if (res.success && Array.isArray(res.data)) {
          const completedWithdrawals = res.data.filter(w => w.status === 'completed');
          const total = completedWithdrawals.reduce(
            (sum, w) => sum + Number(w.amount || 0),
            0
          );
          setTotalWithdrawal(total);
        }
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      }
    };

    fetchWithdrawals();
  }, []);

  useEffect(() => {
    const fetchMerchantTransactions = async () => {
      try {
        const res = await getAllMerchantTransactions();
        if (res?.success && Array.isArray(res.data)) {
          const systemTransactions = res.data.filter(txn => txn.status === 'system');
          const total = systemTransactions.reduce(
            (sum, txn) => sum + Number(txn.amount || 0),
            0
          );
          setTotalSystemAmount(total);
        } else {
          console.warn("Invalid merchant transactions response:", res);
        }
      } catch (error) {
        console.error("Error fetching merchant transactions:", error);
      }
    };

    fetchMerchantTransactions();
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
          <span className='text-zinc-400'>User's</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>{users.length}</h1>
            <div className='bg-[#006666]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#006666]' />
            </div>
          </div>
        </div>

        {/* Merchant Card */}
        <div className='bibb flex flex-col bg-white rounded-md gap-2 border-b-[0.90px] border-[#f7a740]'>
          <span className='text-zinc-400'>Merchant's</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>{merchantCount}</h1>
            <div className='bg-[#f7a740]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#f7a740]' />
            </div>
          </div>
        </div>

        {/* Commission from system transactions */}
        <div className='bibb flex flex-col bg-white rounded-md gap-2 border-b-[0.90px] border-[#763bff]'>
          <span className='text-zinc-400'>Commission</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>
              ${Number(totalSystemAmount).toLocaleString()}
            </h1>
            <div className='bg-[#763bff]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <GrMoney className='text-[24px] text-[#763bff]' />
            </div>
          </div>
        </div>

        {/* Total Payout */}
        <div className='bibb flex flex-col bg-white rounded-md gap-2 border-b-[0.90px] border-[#979797]'>
          <span className='text-zinc-400'>Total Payout</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>
              ${Number(totalWithdrawal).toLocaleString()}
            </h1>
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

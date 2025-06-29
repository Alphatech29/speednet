import React, { useContext, useEffect, useState } from 'react';
import { HiGiftTop } from "react-icons/hi2";
import { IoMdWallet } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { TabItem, Tabs } from "flowbite-react";
import Pending from './tabs/pending';
import Completed from './tabs/completed';
import { AuthContext } from '../../../components/control/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchReferralsByUser } from "../../../components/backendApis/referral/referral";

const Referral = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [referralCount, setReferralCount] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loadingReferrals, setLoadingReferrals] = useState(false);

  const currencySymbol = webSettings?.currency;
  const userCode = user?.uid || '';
  const referralLink = webSettings?.web_url && userCode
    ? `${webSettings.web_url}/auth/register?ref=${userCode}`
    : '';

  const copyToClipboard = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied to clipboard!'))
      .catch(err => toast.error('Failed to copy referral link'));
  };

  useEffect(() => {
    const loadReferralStats = async () => {
      if (!user?.uid) return;
      setLoadingReferrals(true);
      try {
        const response = await fetchReferralsByUser(user.uid);
        if (response.success && Array.isArray(response.data)) {
          const referrals = response.data;
          setReferralCount(referrals.length);
          const approved = referrals.filter(r => r.referral_status === 1);
          const total = approved.reduce((sum, r) => sum + Number(r.referral_amount || 0), 0);
          setTotalEarned(total);
        } else {
          setReferralCount(0);
          setTotalEarned(0);
        }
      } catch (error) {
        setReferralCount(0);
        setTotalEarned(0);
      } finally {
        setLoadingReferrals(false);
      }
    };
    loadReferralStats();
  }, [user?.uid]);

  return (
    <div className="mobile:px-2 tab:px-4 pc:px-6">
      <ToastContainer />
      <div className='text-gray-300'>
        <h1 className='text-lg font-semibold'>Referral</h1>
        <p>Boost your earnings by inviting friends to join Speednet.</p>
      </div>

      <div className='flex flex-col lg:flex-row justify-between gap-4 w-full mt-4'>
        {/* Left Section */}
        <div className='bg-gray-800 rounded-lg p-4 tab:p-5 flex flex-col justify-between w-full lg:w-1/2'>
          <div className='flex flex-col items-center gap-3'>
            <HiGiftTop className='text-[4rem] tab:text-[5rem] text-amber-600' />
            <h1 className='text-gray-200 text-xl tab:text-2xl text-center'>
              Receive <strong>$5</strong> reward instantly
            </h1>
            <p className='text-center text-gray-300 text-sm tab:text-base'>
              When your friend registers, funds wallet with minimum of <strong>$25</strong> and purchases at least one <strong>account</strong>, you get rewarded instantly.
            </p>
          </div>

          <div className='mt-6'>
            <h2 className='text-[16px] tab:text-[17px] text-gray-200 mb-2'>How to use invitation code</h2>
            <ul className='text-gray-300 text-sm tab:text-base space-y-1'>
              <li>1. Copy your referral code below.</li>
              <li>2. Share it with your friends via social media, email, or any other platform.</li>
              <li>3. When your friends sign up using your code, you will earn rewards.</li>
            </ul>

            <div className='mt-4'>
              <label className='text-gray-300 text-sm mb-1 block'>Your Referral Link</label>
              <div className='flex items-center gap-2 bg-gray-700 rounded-md px-2 py-1'>
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className='bg-transparent text-gray-200 w-full outline-none border-0 focus:ring-0 focus:border-0 text-xs tab:text-sm'
                />
                <button
                  onClick={copyToClipboard}
                  className='bg-amber-600 text-white px-3 py-1 text-sm rounded hover:bg-amber-700 transition'
                  disabled={!referralLink}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className='flex flex-col w-full lg:w-1/2 gap-4'>
          <div>
            <h1 className='text-gray-200 mb-2'>Referral Record</h1>
            <div className='flex flex-col tab:flex-row gap-4 text-gray-300 bg-gray-800 rounded-lg p-3'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'><IoMdWallet />Total Earned</div>
                <span>{loadingReferrals ? '...' : `${currencySymbol}${totalEarned.toLocaleString()}`}</span>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'><FaUsers />Invitees</div>
                <span>{loadingReferrals ? '...' : referralCount}</span>
              </div>
            </div>
          </div>

          <div className='bg-gray-800 rounded-lg p-3'>
            <Tabs aria-label="Default tabs" variant="default" >
              <TabItem active title="Pending" icon={MdOutlinePendingActions}>
                <Pending />
              </TabItem>
              <TabItem title="Completed" icon={GiConfirmed}>
                <Completed />
              </TabItem>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;

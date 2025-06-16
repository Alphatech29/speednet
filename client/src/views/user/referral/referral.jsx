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

  const currencySymbol = webSettings?.currency ;

  const userCode = user?.uid || '';
  const referralLink = webSettings?.web_url && userCode
    ? `${webSettings.web_url}/auth/register?ref=${userCode}`
    : '';

  const copyToClipboard = () => {
    if (!referralLink) return;

    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast.success('Referral link copied to clipboard!', {
          position: "top-right",
        });
      })
      .catch((err) => {
        toast.error('Failed to copy referral link', {
          position: "top-right",
        });
        console.error('Failed to copy text: ', err);
      });
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

          const approvedReferrals = referrals.filter(r => r.referral_status === 1);
          const total = approvedReferrals.reduce(
            (sum, r) => sum + Number(r.referral_amount || 0),
            0
          );
          setTotalEarned(total);
        } else {
          setReferralCount(0);
          setTotalEarned(0);
        }
      } catch (error) {
        console.error('Failed to fetch referrals:', error);
        setReferralCount(0);
        setTotalEarned(0);
      } finally {
        setLoadingReferrals(false);
      }
    };

    loadReferralStats();
  }, [user?.uid]);

  return (
    <div>
      <ToastContainer />
      <div className='text-gray-300'>
        <h1 className='text-lg font-semibold'>Referral</h1>
        <p>Boost your earnings by inviting friends to join Speednet.</p>
      </div>

      <div className='flex justify-between gap-2 items-center w-full mt-3'>
        <div className='flex flex-col justify-between items-center bg-gray-800 rounded-lg p-5 w-full h-[575px]'>
          <div className='flex flex-col justify-center items-center gap-2'>
            <span><HiGiftTop className='text-[5rem] text-amber-600' /></span>
            <h1 className='text-gray-200 text-2xl'>Receive <strong>$5</strong> reward instantly</h1>
            <p className='text-center text-gray-300 text-base'>
              When your friend registers, funds wallet with minimum of <strong>$25</strong> and purchases at least one <strong>account</strong>, you get rewarded instantly.
            </p>
          </div>

          <div className='flex flex-col justify-start items-start gap-2 w-full'>
            <h2 className='text-[17px] text-gray-200'>How to use invitation code</h2>
            <div>
              <p className='text-gray-300'>1. Copy your referral code below.</p>
              <p className='text-gray-300'>2. Share it with your friends via social media, email, or any other platform.</p>
              <p className='text-gray-300'>3. When your friends sign up using your code, you will earn rewards.</p>

              <div className='mt-4 w-full'>
                <label className='text-gray-300 text-sm mb-1'>Your Referral Link</label>
                <div className='flex items-center gap-2 bg-gray-700 rounded-md py-[0.70px] px-2'>
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className='bg-transparent text-gray-200 w-full outline-none border-0 focus:ring-0 focus:border-0'
                  />
                  <button
                    onClick={copyToClipboard}
                    className='bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition'
                    disabled={!referralLink}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full lg:w-1/2'>
          <h1 className='text-gray-200 mb-3'>Referral Record</h1>

          <div className='flex gap-7 text-gray-300 bg-gray-800 rounded-lg p-3'>
            <div className='flex flex-col justify-start items-start gap-3'>
              <div className='flex justify-start items-center gap-2'><IoMdWallet />Total Earned</div>
              <span>{loadingReferrals ? '...' : `${currencySymbol}${totalEarned.toLocaleString()}`}</span>
            </div>
            <div className='flex flex-col justify-start items-start gap-3'>
              <div className='flex justify-start items-center gap-2'><FaUsers />Invitees</div>
              <span>{loadingReferrals ? '...' : referralCount}</span>
            </div>
          </div>

          <div className='flex gap-7 text-gray-300 bg-gray-800 rounded-lg p-3 mt-3 h-[450px]'>
            <div className='flex flex-col justify-start items-start w-full'>
              <div className='flex justify-start w-full'>
                <Tabs aria-label="Default tabs" variant="default">
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
      </div>
    </div>
  );
};

export default Referral;

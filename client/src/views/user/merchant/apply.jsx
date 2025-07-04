import React, { useState, useContext } from 'react';
import { Button } from 'flowbite-react';
import Activate from './modal/activate';
import { AuthContext } from '../../../components/control/authContext';

const Apply = () => {
  const [isActivate, setActivate] = useState(false);
  const { webSettings } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-3 mobile:px-0 tab:px-8 pc:px-0 w-full pc:mx-auto">
      {/* Header */}
      <div className="text-gray-100 flex flex-col">
        <span className="mobile:text-[22px] tab:text-[26px] pc:text-[30px] font-semibold leading-tight">
          Become a Merchant
        </span>
        <p className="text-gray-400 mobile:text-sm tab:text-base mt-1">
          A one-time payment is required to complete your merchant registration.
        </p>
      </div>

      {/* Info Section */}
      <div className="bg-slate-800 border border-gray-600 rounded-lg mobile:p-4 tab:p-5 pc:p-6 flex flex-col gap-4 text-gray-100">
        <p className="mobile:text-sm tab:text-base">
          Monetize your digital assets by becoming a merchant on our platform.
          If you have premium accounts, subscriptions, or digital services to sell,
          our marketplace provides a secure and efficient way to connect with buyers.
        </p>

        <h1 className="font-semibold mobile:text-[15px] tab:text-[17px]">Why Sell with Us?</h1>
        <ul className="space-y-2 mobile:text-sm tab:text-base">
          <li>✅ Exclusive Access – List your accounts for sale to a wide audience.</li>
          <li>✅ Seamless Upload – Easily list accounts with detailed descriptions.</li>
          <li>✅ Automated Transactions – Fast processing for buyers and sellers.</li>
          <li>✅ Secure Payments – Get paid instantly and withdraw earnings hassle-free.</li>
        </ul>

        <h1 className="font-semibold mobile:text-[15px] tab:text-[17px] mt-2">How It Works?</h1>
        <ol className="list-decimal list-inside space-y-1 text-gray-300 mobile:text-sm tab:text-base">
          <li>
            Sign Up & Pay {webSettings?.currency || '$'}
            {webSettings?.merchant_activation_fee || '0.00'} – Register and make a one-time merchant activation payment.
          </li>
          <li>Upload Accounts – List available accounts with pricing and details.</li>
          <li>Start Selling – Buyers purchase from your listings with secure transactions.</li>
          <li>Receive Payments – Get paid securely after each transaction.</li>
        </ol>

        <Button
          className="mt-5 mobile:text-sm tab:text-base mobile:w-full tab:w-fit bg-primary-600 border-none"
          onClick={() => setActivate(true)}
        >
          🚀 Join today and start selling in minutes!
        </Button>
      </div>

      {isActivate && <Activate onClose={() => setActivate(false)} />}
    </div>
  );
};

export default Apply;

import React, { useState, useContext } from 'react';
import { Button } from 'flowbite-react';
import Activate from './modal/activate';
import { AuthContext } from '../../../components/control/authContext';

const Apply = () => {
  const [isActivate, setActivate] = useState(false);
  const { webSettings } = useContext(AuthContext);

  return (
    <div className='flex flex-col gap-4'>
      <div className='mb-4 text-gray-100 flex flex-col'>
        <span className='text-[30px] font-medium'>Become a merchant</span>
        <p className='text-gray-300 text-sm'>A one-time payment is required to complete your merchant registration.</p>
      </div>
      <div className='bg-slate-800 border border-gray-400 rounded-lg p-4 flex flex-col gap-4 text-gray-100 text-[15px]'>
        <p>Monetize your digital assets by becoming a merchant on our platform. If you have premium accounts, subscriptions, or digital services to sell, our marketplace provides a secure and efficient way to connect with buyers.</p>
        <h1 className='font-medium text-[17px]'>Why Sell with Us?</h1>
        <p>✅ Exclusive Access – List your accounts for sale to a wide audience.</p>
        <p>✅ Seamless Upload – Easily list accounts for sale with detailed descriptions.</p>
        <p>✅ Automated Transactions – Smooth and fast processing for buyers and sellers.</p>
        <p>✅ Secure Payments – Get paid instantly and withdraw earnings hassle-free.</p>
        <h1 className='font-medium text-[17px]'>How it works?</h1>
        <ol className='list-decimal list-inside'>
          <li className='text-[13px]'>
            Sign Up & Pay {webSettings?.currency}
            {webSettings?.merchant_activation_fee} – Register and make a one-time merchant activation payment.
          </li>
          <li className='text-[13px]'>Upload Accounts for Sale – List available accounts with pricing and details.</li>
          <li className='text-[13px]'>Start Selling – Buyers purchase from your listings with secure transactions.</li>
          <li className='text-[13px]'>Receive Payments – Get paid securely once a transaction is completed.</li>
        </ol>

        <Button className='mt-5 bg-primary-600 border-none' onClick={() => setActivate(true)}>
          🚀 Join today and start selling in minutes!
        </Button>
      </div>

      {isActivate && <Activate onClose={() => setActivate(false)} />}
    </div>
  );
};

export default Apply;

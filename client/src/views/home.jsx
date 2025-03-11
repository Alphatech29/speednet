import React from 'react';
import { Button } from "flowbite-react";

const Home = () => {
  return (
  <div className='flex flex-col'>
      <div className='px-20 py-24 bg-slate-100'>
      <div className='flex justify-between items-center'>
        <div className='w-1/2 pt-20'>
          <h1 className='text-3xl font-bold text-gray-800'>Explore Unique Accounts in Our Marketplace – Get Cheap Data & Airtime, Including International Purchases!</h1>
          <p className='text-lg text-gray-700 mt-2'> Take Control of Your Online Presence: Discover, Verify, and Purchase Genuine Accounts on Speednet</p>
          <Button to="register" className='bg-primary-600 text-pay px-7 mt-10 rounded-md'>Get Started</Button>
        </div>
        <div>
         <img src="" alt="" />
        </div>
      </div>
    </div>

    <div className='about-us px-20 py-24 bg-primary-100/5' id="about-us">
      <div className='flex justify-between items-center pt-16'>
        <div className='w-1/2'>
         <img src="" alt="" />
        </div>
        <div className='w-1/2'>
          <h1 className='text-2xl text-gray-700 font-medium'>Speednet: Your Trusted Accounts Marketplace – Buy, Sell, and Discover Authentic Accounts with Ease!</h1>
          <p className='mt-2'>At Speednet, we champion community-driven commerce, offering a diverse marketplace of accounts curated by individual sellers like you. From gaming and video streaming to work and social media accounts, our platform connects you directly with passionate sellers committed to providing authentic accounts.</p>
          <Button to="register" className='bg-primary-600 text-pay px-7 mt-10 rounded-md'>Purchase an account</Button>
        </div>
      </div>
    </div>

    <div className='about-us px-20 py-24 bg-primary-100/5' id='features'>
      <div className='flex justify-between items-center pt-16'>
       
       
      </div>
    </div>
  </div>
  );
}

export default Home;

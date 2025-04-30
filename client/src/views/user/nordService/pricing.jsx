import React, { useState } from 'react';
import { IoCheckmark } from "react-icons/io5";
import { Button } from "flowbite-react";
import Purchase from './model/purchase';

const Pricing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className='flex flex-col'>
      <div className='bg-gray-700 px-4 py-3 rounded-lg'>
        <h1 className='text-2xl text-gray-300 text-center font-semibold'>Get your online security package</h1>
        <div className='flex gap-5 mt-4'>
          {/* BASIC PLAN */}
          <div className='px-3 py-3 border-2 border-gray-600 rounded-lg w-[50%]'>
            <span className='text-gray-300 text-lg'>Basic</span>
            <h1 className='text-xl font-semibold text-gray-400'>$10.99<span>/mo</span></h1>
            <ul className='text-gray-300 text-base mt-3'>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Secure, high-speed VPN</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Threat Protection Pro™: Anti-malware and advanced browsing protection</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Threat Protection Pro™: Ad and tracker blocker</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Password manager with Data Breach Scanner</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />2 devices secured at once</li>
            </ul>
            <Button className='bg-primary-600 border-0 mt-4 w-full' onClick={() => openModal({ name: 'Basic', price: '$10.99' })}>
              Get Basic
            </Button>
          </div>

          {/* PRO PLAN */}
          <div className='px-3 py-3 border-2 border-gray-600 rounded-lg w-[50%]'>
            <span className='text-gray-300 text-lg'>Professional</span>
            <h1 className='text-xl font-semibold text-gray-400'>$12.99<span>/mo</span></h1>
            <ul className='text-gray-300 text-base mt-3'>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Secure, high-speed VPN</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Threat Protection Pro™: Anti-malware and advanced browsing protection</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Threat Protection Pro™: Ad and tracker blocker</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Password manager with Data Breach Scanner</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />10 devices secured at once</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Dedicated IP</li>
              <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />1 TB of encrypted cloud storage</li>
            </ul>
            <Button className='bg-primary-600 border-0 mt-4 w-full' onClick={() => openModal({ name: 'Professional', price: '$12.99' })}>
              Get Pro
            </Button>
          </div>
        </div>
      </div>

      {/* PURCHASE MODAL */}
      {isOpen && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-gray-800 rounded-lg p-6 w-[40%] md:w-[200px] shadow-lg'>
            <Purchase plan={selectedPlan} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;

import React, { useEffect, useState } from 'react';
import { IoCheckmark } from "react-icons/io5";
import { Button } from "flowbite-react";
import Purchase from './model/purchase';
import { getNordPlans } from '../../../components/backendApis/nordVpn/nordVpn';

const Pricing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [nordPlans, setNordPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await getNordPlans();
      console.log("📦 NordVPN Plans Response:", response);

      if (response.success && Array.isArray(response.data?.data)) {
        setNordPlans(response.data.data);
      }
    };

    fetchPlans();
  }, []);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPlan(null);
  };

  const renderFeatures = (planName) => {
    if (planName === 'Standard') {
      return (
        <ul className='text-gray-300 text-base mt-3'>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Secure, high-speed VPN</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Threat Protection Pro™: Anti-malware and advanced browsing protection</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Ad and tracker blocker</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Password manager with Data Breach Scanner</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />2 devices secured at once</li>
        </ul>
      );
    }

    if (planName === 'Professional') {
      return (
        <ul className='text-gray-300 text-base mt-3'>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Secure, high-speed VPN</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Threat Protection Pro™: Anti-malware and advanced browsing protection</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Ad and tracker blocker</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Password manager with Data Breach Scanner</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />10 devices secured at once</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />Dedicated IP</li>
          <li className='flex items-center gap-3'><IoCheckmark className='text-green-500' />1 TB of encrypted cloud storage</li>
        </ul>
      );
    }

    return null;
  };

  return (
    <div className='flex flex-col'>
      <div className='bg-gray-700 px-4 py-3 rounded-lg'>
        <h1 className='text-2xl text-gray-300 text-center font-semibold'>Get your online security package</h1>
        <div className='pc:flex gap-5 mobile:space-y-2 mt-4'>

          {nordPlans.map((plan) => (
            <div key={plan.id} className='px-3 py-3 border-2 border-gray-600 rounded-lg pc:w-[50%]'>
              <span className='text-gray-300 text-lg'>{plan.package_name}</span>
              <h1 className='text-xl font-semibold text-gray-400'>
                ${plan.amount}<span>/mo</span>
              </h1>

              {/* Conditional Feature List */}
              {renderFeatures(plan.package_name)}

              <Button
                className='bg-primary-600 border-0 mt-4 w-full'
                onClick={() => openModal(plan)}
              >
                Get {plan.package_name}
              </Button>
            </div>
          ))}

        </div>
      </div>

      {/* PURCHASE MODAL */}
      {isOpen && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-gray-800 rounded-lg p-6 pc:w-[40%] mobile:w-[360px] shadow-lg'>
            <Purchase plan={selectedPlan} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;

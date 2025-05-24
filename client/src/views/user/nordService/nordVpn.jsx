import React from 'react';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

const NordVpn = () => {
  return (
    <div className='flex flex-col'>
      <h1 className='text-lg text-gray-300 font-medium'>Nord VPN</h1>
      <div className='bg-gray-700 px-4 py-3 rounded-lg'>
        <div>
          <h1 className='text-lg text-gray-300 font-medium mb-3'>Trusted NordVPN Reseller – Secure Your Online Privacy Today</h1>
          <p className='text-sm text-gray-300'>
            Welcome to Speednet—your trusted source for premium VPN services. As a direct NordVPN reseller, we offer reliable, secure, and affordable VPN access. Whether for personal privacy or business protection, enjoy top-tier security, fast speeds, and full digital freedom. Get started today and browse the internet with confidence and peace of mind.
          </p>
        </div>
        <div className='mt-4'>
          <h1 className='text-lg text-gray-300 font-medium text-center'>Enhance your cybersecurity with Threat Protection Pro™ for advanced defense.</h1>
          <div className='pc:flex justify-center items-center pc:gap-4 mobile:space-y-2 mt-3'>
            {/* Feature Cards */}
            {[
              { title: 'Malware protection', desc: 'Avoid malicious websites and protect your devices from malware.', img: '/image/threat-protection.svg' },
              { title: 'Tracker blocker', desc: 'Block tracking cookies and browse the internet without leaving a trace.', img: '/image/cookie-tracking.svg' },
              { title: 'Ad blocker', desc: 'No more pop-ups and intrusive ads — only smooth browsing.', img: '/image/ad-blocker.svg' },
            ].map((item, idx) => (
              <div key={idx} className='border-2 border-gray-600 rounded-lg p-4 pc:w-[18rem]'>
                <img src={item.img} alt="" className="w-full h-full object-cover" />
                <div className='text-gray-300 mt-3'>
                  <h1 className='font-semibold text-lg'>{item.title}</h1>
                  <p className='text-sm'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-between items-center mt-4 flex-wrap gap-5'>
            <div>
              <img src="/image/nord.png" alt="NordVPN logo" className='w-full h-full max-w-sm' />
            </div>
            <div className='text-gray-300 max-w-xl'>
              <h1 className='font-semibold text-4xl text-gray-300'>Keep your data safe from prying eyes</h1>
              <h3 className='text-lg font-medium mt-3 pb-3'>Boosted security online</h3>
              <p>NordVPN uses next-generation encryption to protect your internet connection, letting you safely access accounts, perform bank transfers, and shop online—without worry. Even when connected to public or unsecured Wi-Fi, your data stays private and your activity remains secure.</p>

              <h3 className='text-lg font-medium mt-3 pb-3'>No activity tracking</h3>
              <p>What you do online is your business—nobody else’s. That’s why we never monitor, record, or log your online activity. With NordVPN, you can browse freely and privately, without anyone tracking your movements or watching over your shoulder.</p>

              <Link to="/user/nord-services/vpn/offer">
                <Button className="mt-4 bg-primary-600 border-0">
                  Get the deal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NordVpn;

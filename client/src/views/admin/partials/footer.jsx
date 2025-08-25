import React from 'react';

const Footer = () => {
  return (
    <footer className='w-full bg-[#e4e4e7] px-4 py-2 mt-10 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]'>
      <div className='flex flex-col md:flex-row justify-between items-center text-center gap-2'>
        <div>
          <p className='text-[13px] text-gray-600'>
            Developed with <span className="text-red-500">❤️</span> by Alphatech Multimedia Technologies
          </p>
        </div>
        <div className='text-[13px] text-gray-500'>
          &copy; {new Date().getFullYear()} SpeedNet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

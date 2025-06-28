import React from 'react';
import { SiNordvpn } from "react-icons/si";


const NordLocker = () => {
  return (
    <div>
      <div className='flex justify-center items-center flex-col bg-gray-800 rounded-md p-9 pc:h-[500px] text-white'>
        <span><SiNordvpn className='text-[100px]'/></span> 
        <h1>NordLocker – Secure Cloud Storage & File Encryption</h1>
        <p>NordLocker securely encrypts and stores your files in the cloud, ensuring privacy, safe sharing, and access across all devices.</p>
        <p className='text-[17px]'>Coming Soon...........</p>
      </div>
    </div>
  );
}

export default NordLocker;

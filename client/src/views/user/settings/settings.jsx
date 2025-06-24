import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { MdPassword } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import PinTab from './tabs/pinTab';
import PasswordTab from './tabs/password';
import ProfileTab from './tabs/profile';


const Settings = () => {
  return (
    <div className='bg-gray-800 text-white rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default" className='text-white'>
          <TabItem active title="Profile" icon={FaUserCircle}>
       <ProfileTab/>
      </TabItem>
       <TabItem active title="Password" icon={RiLockPasswordFill}>
       <PasswordTab/>
      </TabItem>
      <TabItem active title="Transaction Pin" icon={MdPassword}>
       <PinTab/>
      </TabItem>
   
    </Tabs>
    </div>
  );
}

export default Settings;

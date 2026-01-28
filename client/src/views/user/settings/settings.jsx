import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { MdPassword } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import PinTab from './tabs/pinTab';
import PasswordTab from './tabs/password';


const Settings = () => {
  return (
    <div className='bg-[#fefce8] text-secondary rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default">
       <TabItem active title="Password" icon={RiLockPasswordFill}>
       <PasswordTab/>
      </TabItem>
      <TabItem title="Transaction Pin" icon={MdPassword}>
       <PinTab/>
      </TabItem>
   
    </Tabs>
    </div>
  );
}

export default Settings;

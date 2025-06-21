import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { MdPassword } from "react-icons/md";

import PinTab from './tabs/pinTab';


const Settings = () => {
  return (
    <div className='bg-gray-800 text-white rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default" className='text-white'>
          <TabItem active title="Transaction Pin" icon={MdPassword}>
       <PinTab/>
      </TabItem>
   
    </Tabs>
    </div>
  );
}

export default Settings;

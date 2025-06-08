import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { ImKey } from "react-icons/im";
import { IoSettings } from "react-icons/io5";
import { HiMiniServer } from "react-icons/hi2";
import {  HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import PasswordTab from './tabs/passwordTab';
import PaymentTab from './tabs/paymentTab';
import Profile from './tabs/profile';
import WebSettingsTab from './tabs/webSettingsTab';

const Settings = () => {
  return (
    <div className='bg-white rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default">
      <TabItem active title="Profile" icon={HiUserCircle}>
        <Profile/>
      </TabItem>
      <TabItem title="Payment Settings" icon={MdDashboard}>
       <PaymentTab/>
      </TabItem>
      <TabItem title="Password" icon={ImKey}>
       <PasswordTab/>
      </TabItem>
      <TabItem title="Paid API" icon={HiMiniServer}>
        This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
        control the content visibility and styling.
      </TabItem>
      <TabItem  title="Web Settings" icon={IoSettings}>
        <WebSettingsTab/>
      </TabItem>
    </Tabs>
    </div>
  );
}

export default Settings;

import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { ImKey } from "react-icons/im";
import { IoSettings } from "react-icons/io5";
import { HiMiniServer } from "react-icons/hi2";
import {  HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { IoWifiSharp } from "react-icons/io5";
import { FaCode } from "react-icons/fa";
import PasswordTab from './tabs/passwordTab';
import PaymentTab from './tabs/paymentTab';
import Profile from './tabs/profile';
import WebSettingsTab from './tabs/webSettingsTab';
import VtuTab from './tabs/vtuTab';
import ApisTab from './tabs/apisTab';
import ExternalCode from './tabs/externalCode';

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
       <ApisTab/>
      </TabItem>
      <TabItem  title="Web Settings" icon={IoSettings}>
        <WebSettingsTab/>
      </TabItem>
       <TabItem  title="Vtu Service" icon={IoWifiSharp}>
        <VtuTab/>
      </TabItem>
       <TabItem  title="External Code" icon={FaCode}>
        <ExternalCode/>
      </TabItem>
    </Tabs>
    </div>
  );
}

export default Settings;

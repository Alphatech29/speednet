import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { ImKey } from "react-icons/im";
import { IoSettings } from "react-icons/io5";
import { HiMiniServer } from "react-icons/hi2";
import {  HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { IoWifiSharp } from "react-icons/io5";
import { SiWebmoney } from "react-icons/si";
import { FaCode } from "react-icons/fa";
import { FaNode } from "react-icons/fa";
import { FaCommentSms } from "react-icons/fa6";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import PaymentTab from './tabs/paymentTab';
import WebSettingsTab from './tabs/webSettingsTab';
import VtuTab from './tabs/vtuTab';
import ApisTab from './tabs/apisTab';
import ExternalCode from './tabs/externalCode';
import WebLogoTab from './tabs/webLogoTab';
import SmtpserverTab from './tabs/smtpserverTab';
import SmsTab from './tabs/smsTab';
import DarkShopTab from './tabs/darkShopTab';

const Settings = () => {
  return (
    <div className='bg-white rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default">
      <TabItem active title="Web Logo" icon={SiWebmoney}>
        <WebLogoTab/>
      </TabItem>
      <TabItem title="Payment Settings" icon={MdDashboard}>
       <PaymentTab/>
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
      <TabItem  title="Sms Service" icon={FaCommentSms}>
        <SmsTab/>
      </TabItem>
       <TabItem  title="Dark Shop Service" icon={MdOutlineProductionQuantityLimits}>
        <DarkShopTab/>
      </TabItem>
       <TabItem  title="SMTP Server" icon={FaNode}>
        <SmtpserverTab/>
      </TabItem>
       <TabItem  title="External Code" icon={FaCode}>
        <ExternalCode/>
      </TabItem>
    </Tabs>
    </div>
  );
}

export default Settings;

import React from 'react';
import { TabItem, Tabs } from "flowbite-react";
import { FaWifi, FaSquarePhone } from "react-icons/fa6";
import AirtimeTab from './tabs/airtimeTab';
import DataTab from './tabs/dataTab';

const Vtu = () => {
  return (
    <div className="w-full mobile:px-4 tab:px-8 pc:px-16 py-6">
      <div className="bg-gray-800 text-white rounded-md mobile:p-4 tab:p-6 pc:p-8 max-w-4xl mx-auto">
        <Tabs aria-label="Default tabs" variant="default" className="text-white mobile:flex">
          <TabItem active title="Airtime Purchase" icon={FaSquarePhone}>
            <AirtimeTab />
          </TabItem>
          <TabItem title="Data Purchase" icon={FaWifi}>
            <DataTab />
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
};

export default Vtu;

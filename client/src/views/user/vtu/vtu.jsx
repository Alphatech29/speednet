import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { FaWifi } from "react-icons/fa6";
import { FaSquarePhone } from "react-icons/fa6";
import AirtimeTab from './tabs/airtimeTab';
import DataTab from './tabs/dataTab';


const Vtu = () => {
  return (
    <div className='bg-gray-800 text-white rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default" className='text-white'>
          <TabItem active title="Airtime Purchase" icon={FaSquarePhone}>
       <AirtimeTab/>
      </TabItem>
      <TabItem  title="Data Purchase" icon={FaWifi}>
        <DataTab/>
      </TabItem>
    </Tabs>
    </div>
  );
}

export default Vtu;

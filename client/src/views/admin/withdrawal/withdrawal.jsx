import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { MdOutlinePendingActions } from "react-icons/md";
import { GrCompliance } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";


import PendingTab from './tabs/pendingTab';
import CompletedTab from './tabs/completedTab';
import RejectedTab from './tabs/rejectedTab';

const Withdrawal = () => {
  return (
    <div className='bg-white rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default">
      <TabItem active title="Pending Withdawal" icon={MdOutlinePendingActions}>
        <PendingTab/>
      </TabItem>
      <TabItem active title="Paid Withdawal" icon={GrCompliance}>
        <CompletedTab/>
      </TabItem>
      <TabItem active title="Rejected Withdawal" icon={FcCancel}>
        <RejectedTab/>
      </TabItem>
    </Tabs>
    </div>
  );
}

export default Withdrawal;

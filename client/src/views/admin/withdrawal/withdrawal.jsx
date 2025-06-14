import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { MdOutlinePendingActions } from "react-icons/md";
import PendingTab from './tabs/pendingTab';

const Withdrawal = () => {
  return (
    <div className='bg-white rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default">
      <TabItem active title="Pending Withdawal" icon={MdOutlinePendingActions}>
        <PendingTab/>
      </TabItem>
    </Tabs>
    </div>
  );
}

export default Withdrawal;

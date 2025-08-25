import React from 'react';
import { TabItem, Tabs} from "flowbite-react";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { PiTrafficConeLight } from "react-icons/pi";
import { MdBlock } from "react-icons/md";
import AllproductTab from './tabs/allProduct';
import UnderReviewingTab from './tabs/underReviewing';
import RejectedTab from './tabs/rejected';


const Products = () => {
  return (
    <div className='bg-white rounded-md p-4'>
      <Tabs aria-label="Default tabs" variant="default">
      <TabItem title="All Products" icon={PiShoppingCartSimpleFill}>
       <AllproductTab/>
      </TabItem>
      <TabItem title="Waiting For Approval" icon={PiTrafficConeLight}>
       <UnderReviewingTab/>
      </TabItem>
      <TabItem title="Rejected" icon={MdBlock}>
       <RejectedTab/>
      </TabItem>
    </Tabs>
    </div>
  );
}

export default Products;

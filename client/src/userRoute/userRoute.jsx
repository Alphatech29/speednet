import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../views/user/dashboard/dashboard';
import Default from '../views/user/dashboard/Default';
import Wallet from '../views/user/wallet/wallet';
import Marketplace from '../views/user/shop/marketplace/marketplace';



const UserRoute = () => {
  return (
    <Routes>
      {/* Parent route for User layout */}
      <Route path="/" element={<Dashboard/>}>
        {/* Other nested routes */}
        <Route path="dashboard" element={<Default />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="wallet" element={<Wallet />} />
        

        {/* GiftCard as a layout route with nested routes */}
        {/*<Route path="giftcard/*" element={<GiftCardOutlet />}>
          <Route index element={<GiftCard  />} />
          <Route path="buy-card" element={<Buycard />} />
          <Route path="sell-card" element={<SellCard/>}/>
        </Route> */}

       
      </Route>
    </Routes>
  );
};

export default UserRoute;
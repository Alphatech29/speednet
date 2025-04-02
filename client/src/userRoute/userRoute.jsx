import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../views/user/dashboard/dashboard';
import Wallet from '../views/user/wallet/wallet';
import Marketplace from '../views/user/shop/marketplace/marketplace';
import Order from '../views/user/purchase/order';
import Marchant from '../views/user/wallet/vendor';
import Apply from '../views/user/merchant/apply';
import Checkout from '../views/user/shop/checkOut/checkOut';



const UserRoute = () => {
  return (
    <Routes>
      {/* Parent route for User layout */}
      <Route path="/" element={<Dashboard/>}>
        {/* Other nested routes */}
        <Route path="dashboard" element={<Marchant />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path='order' element={<Order/>}/>
        <Route path='become-a-marchant' element={<Apply/>}/>
        <Route path='check-out' element={<Checkout/>}/>
        

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
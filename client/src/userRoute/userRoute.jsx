import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../views/user/dashboard/dashboard';
import Wallet from '../views/user/wallet/wallet';
import Marketplace from '../views/user/shop/marketplace/marketplace';
import Order from '../views/user/purchase/order';
import Marchant from '../views/user/wallet/vendor';
import Checkout from '../views/user/shop/checkOut/checkOut';
import Myproduct from "./../views/user/product/myProduct";
import AddNewProdunct from '../views/user/product/addNewProduct';
import Withdrawal from '../views/user/withdrawal/withdrawal';
import NordVpn from "./../views/user/nordService/nordVpn";
import Pricing from '../views/user/nordService/pricing';
import Referral from '../views/user/referral/referral';
import Vtu from '../views/user/vtu/vtu';
import Settings from '../views/user/settings/settings';
import InternationalAirtime from '../views/user/internationalAirtime/internationalAirtime';
import Profile from '../views/user/profile/profile';
import NordLocker from '../views/user/nordService/nordLocker';
import Chat from '../views/user/escrowChat/chat';
import Apply from "./../views/user/merchant/apply";




const UserRoute = () => {
  return (
    <Routes>
      {/* Parent route for User layout */}
      <Route path="/" element={<Dashboard />}>
        {/* Other nested routes */}
        <Route path="dashboard" element={<Marchant />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path='order' element={<Order />} />
        <Route path='become-a-marchant' element={<Apply />} />
        <Route path='check-out' element={<Checkout />} />
        <Route path='my-products' element={<Myproduct />} />
        <Route path='add-product' element={<AddNewProdunct />} />
        <Route path='withdraw' element={<Withdrawal />} />
        <Route path='vtu' element={<Vtu />} />
        <Route path='nord-services/locker' element={<NordLocker />} />
        <Route path='nord-services/vpn' element={<NordVpn />} />
        <Route path='nord-services/vpn/offer' element={<Pricing />} />
        <Route path='referral' element={<Referral />} />
        <Route path='settings' element={<Settings />} />
        <Route path='international-airtime' element={<InternationalAirtime />} />
        <Route path='profile' element={<Profile />} />
        <Route path='chat' element={<Chat />} />
        

     


      </Route>
    </Routes>
  );
};

export default UserRoute;
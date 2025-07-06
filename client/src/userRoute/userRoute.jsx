import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/control/authContext';

// Views
import Dashboard from '../views/user/dashboard/dashboard';
import Wallet from '../views/user/wallet/wallet';
import Marketplace from '../views/user/shop/marketplace/marketplace';
import Order from '../views/user/purchase/order';
import Marchant from '../views/user/wallet/vendor';
import Checkout from '../views/user/shop/checkOut/checkOut';
import Myproduct from '../views/user/product/myProduct';
import AddNewProduct from '../views/user/product/addNewProduct';
import Withdrawal from '../views/user/withdrawal/withdrawal';
import NordVpn from '../views/user/nordService/nordVpn';
import Pricing from '../views/user/nordService/pricing';
import Referral from '../views/user/referral/referral';
import Vtu from '../views/user/vtu/vtu';
import Settings from '../views/user/settings/settings';
import InternationalAirtime from '../views/user/internationalAirtime/internationalAirtime';
import Profile from '../views/user/profile/profile';
import NordLocker from '../views/user/nordService/nordLocker';
import Chat from '../views/user/escrowChat/chat';
import Apply from '../views/user/merchant/apply';
import Unauthorized from '../views/user/unauthorized/unauthorized';
import ReportList from '../views/user/purchase/reportList';

// Role-based guards
const RequireRole = ({ user, role, children }) => {
  return user?.role === role ? children : <Navigate to="/user/unauthorized" replace />;
};

const UserRoute = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Marchant />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="order" element={<Order />} />
        <Route path="become-a-marchant" element={<Apply />} />
        <Route path="check-out" element={<Checkout />} />
        <Route path="vtu" element={<Vtu />} />
        <Route path="referral" element={<Referral />} />
        <Route path="settings" element={<Settings />} />
        <Route path="international-airtime" element={<InternationalAirtime />} />
        <Route path="profile" element={<Profile />} />
        <Route path="chat" element={<Chat />} />
        <Route path="report-list" element={<ReportList />} />
        <Route path="nord-services/locker" element={<NordLocker />} />
        <Route path="nord-services/vpn" element={<NordVpn />} />
        <Route path="nord-services/vpn/offer" element={<Pricing />} />
        {/* Unauthorized page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Merchant-only routes */}
        <Route
          path="dashboard"
          element={
            <RequireRole user={user} role="merchant">
              <Marchant />
            </RequireRole>
          }
        />
        <Route
          path="add-product"
          element={
            <RequireRole user={user} role="merchant">
              <AddNewProduct />
            </RequireRole>
          }
        />
        <Route
          path="my-products"
          element={
            <RequireRole user={user} role="merchant">
              <Myproduct />
            </RequireRole>
          }
        />
        <Route
          path="withdraw"
          element={
            <RequireRole user={user} role="merchant">
              <Withdrawal />
            </RequireRole>
          }
        />
      </Route>
    </Routes>
  );
};

export default UserRoute;

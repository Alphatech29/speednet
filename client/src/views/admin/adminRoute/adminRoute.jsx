import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../admin/dashboard/dashboard/dashboard';
import DefaultDashboard from '../../admin/dashboard/dashboard/defaultDashboard';
import NordAdmin from '../nordAdmin/nordAdmin';
import Settings from '../settings/settings';
import User from '../dashboard/users/user';
import Products from '../product/products';
import Withdrawal from '../withdrawal/withdrawal';
import Platform from '../platform/platform';
import EditeUser from '../dashboard/users/editeUser';



const AdminRoute = () => {
  return (
    <Routes>
      {/* Parent route for User layout */}
      <Route path="/" element={<Dashboard/>}>
        {/* Other nested routes */}
        <Route path="dashboard" element={<DefaultDashboard />} />
         <Route path="nord-admin" element={<NordAdmin />} />
         <Route path="settings" element={<Settings />} />
         <Route path="products" element={<Products />} />
         <Route path="users" element={<User />} />
         <Route path="users/:uid" element={<EditeUser />} />
         <Route path="withdrawal" element={<Withdrawal />} />
         <Route path="platform" element={<Platform />} />

      </Route>
    </Routes>
  );
};

export default AdminRoute;
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
import EditeProduct from '../product/editeProduct';
import Notice from '../notice/notice';
import Create from '../notice/create';
import EditNotice from '../notice/edit';
import Transaction from '../histroy/transaction';
import Merchant from '../histroy/merchant';
import AccountOrder from '../histroy/accountOrder';
import Password from '../password/password';
import Report from '../report/report';
import Transfer from '../transfer/transfer';
import CreatePage from '../page/create';
import Pages from '../page/pages';
import Edit from '../page/edit';
import ShortNotice from '../shortNotice/shortNotice';
import CreateVendor from '../vendor/createVendor';
import MerchantPage from '../vendor/vendor';
import EditVerdor from '../vendor/editeVendor';
import AssignProduct from '../shoppingProduct/assignProduct';
import ShoppingProduct from '../shoppingProduct/product';



const AdminRoute = () => {
  return (
    <Routes>
      {/* Parent route for User layout */}
      <Route path="/" element={<Dashboard />}>
        {/* Other nested routes */}
        <Route path="dashboard" element={<DefaultDashboard />} />
        <Route path="nord-admin" element={<NordAdmin />} />
        <Route path="settings" element={<Settings />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<EditeProduct />} />
        <Route path="users" element={<User />} />
        <Route path="users/:uid" element={<EditeUser />} />
        <Route path="withdrawal" element={<Withdrawal />} />
        <Route path="platform" element={<Platform />} />
        <Route path="announcement" element={<Notice />} />
        <Route path="announcement/create" element={<Create />} />
        <Route path="announcement/edit" element={<EditNotice />} />
        <Route path="histroy/transaction" element={<Transaction />} />
        <Route path="histroy/merchant" element={<Merchant />} />
        <Route path="order" element={<AccountOrder />} />
        <Route path="password" element={<Password />} />
        <Route path="report" element={<Report />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="page/create" element={<CreatePage />} />
        <Route path="short-notice" element={<ShortNotice />} />
        <Route path="page" element={<Pages />} />
        <Route path="page/edit" element={<Edit />} />
        <Route path="vendor/create" element={<CreateVendor/>} />
         <Route path="vendor" element={<MerchantPage/>} />
         <Route path="vendor/edit/:uid" element={<EditVerdor/>} />
         <Route path="shopping/assign-product" element={<AssignProduct/>} />
         <Route path="shopping/product" element={<ShoppingProduct/>} />

      </Route>
    </Routes>
  );
};

export default AdminRoute;
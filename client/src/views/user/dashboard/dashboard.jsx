import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../views/user/partials/sidebar';
import Header from '../../../views/user/partials/header';
import Footer from '../../../views/user/partials/footer';

const Dashboard = () => {
  return (
    <div className="flex min-h-[calc(100vh-1px)] w-full bg-slate-600">
      {/* Sidebar (Hidden on mobile, visible on PC) */}
      <div className="hidden pc:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-0 pc:ml-[265px] flex w-full flex-col">
        {/* Sticky Header */}
        <Header />

        {/* Scrollable Outlet */}
        <div className="flex-grow overflow-auto pc:py-4 mobile:py-4 mobile:mb-14 px-6 mobile:px-4">
          <Outlet />
        </div>

        {/* Sticky footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;

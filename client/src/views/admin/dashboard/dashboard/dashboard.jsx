import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../../views/admin/partials/sidebar';
import Header from '../../../../views/admin/partials/Header';
import '../../cssFile/dashboard.css'; 

const Dashboard = () => {
 

  return (
    <div className="flex main-wrapper ">
      {/* Sidebar (Fixed) */}
      <Sidebar  />

      {/* Main Content */}
      <div className=" Main-Content-Wrapper flex w-full min-h-screen flex-col flex-grow mobile:h-[100%]">
        {/* Sticky Header */}
        <Header />

        {/* Scrollable Outlet */}
        <div className="flex-grow  overflow-auto pc:py-4 mobile:py-4 mobile:mb-14 px:px-6 mobile:px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

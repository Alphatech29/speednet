import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../views/user/partials/sidebar';
import Header from '../../../views/user/partials/header';
import Footer from '../../../views/user/partials/footer';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex main-wrapper-user ">
      {/* Sidebar (Fixed) */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="wrapper-user flex h-full w-full flex-col flex-grow mobile:h-full ">
        {/* Sticky Header */}
        <Header />

        {/* Scrollable Outlet */}
        <div className="flex-grow overflow-auto pc:py-4 mobile:py-4 mobile:mb-14 px:px-6 mobile:px-4">
          <Outlet />
        </div>

        {/* Sticky footer */}
        <Footer toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
};

export default Dashboard;

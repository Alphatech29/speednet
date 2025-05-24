import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../views/user/partials/sidebar';
import Header from '../../../views/user/partials/header';  // fixed import name

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex pc:h-screen">
      {/* Sidebar (Fixed) */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex w-full flex-col flex-grow bg-slate-600 mobile:h-full">
        {/* Sticky Header */}
        <Header 
          className="sticky top-0 z-10 bg-slate-600 shadow-md"
          toggleSidebar={toggleSidebar}  // pass toggle function as prop
        />

        {/* Scrollable Outlet */}
        <div className="flex-grow overflow-auto pc:py-6 mobile:py-4 px:px-6 mobile:px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

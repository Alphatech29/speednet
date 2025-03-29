import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../partials/sidebar';
import Hearder from '../partials/hearder'; 

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex w-full flex-col flex-grow bg-slate-600">
        {/* Sticky Header */}
        <Hearder className="sticky top-0 z-10 bg-slate-600 shadow-md" />

        {/* Scrollable Outlet */}
        <div className="flex-grow  overflow-auto py-6 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

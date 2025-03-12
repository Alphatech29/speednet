import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../partials/sidebar';
import Hearder from '../partials/hearder'; // Ensure correct spelling

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Hearder /> 
        <div className="mt-4 px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { NavLink } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-800 rounded-md">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-gray-300 text-lg mb-6">
        You do not have permission to access this page.
      </p>
      <NavLink
        to="/user/merketplace"
        className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-600/50 transition duration-200"
      >
        Go to Back
      </NavLink>
    </div>
  );
};

export default Unauthorized;

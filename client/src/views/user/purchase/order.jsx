import React from "react";
import { FaFile } from "react-icons/fa";

const Order = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div className="mb-4">
        <span className="text-lg font-medium text-gray-300">My Purchase</span>
      </div>

      {/* Alert Section */}
      <div
        className="bg-yellow-100 w-full text-yellow-800 border-l-4 border-yellow-500 px-4 py-3 rounded-lg text-sm"
      >
        <span className="font-medium">Important!</span> Customers are not
        eligible for a refund on any social media product unless it is reported
        as defective and returned within 24 hours of purchase. To receive
        prompt assistance, please report any defects immediately after purchase.
      </div>

      {/* Transactions Section */}
      <div className="bg-slate-700 flex flex-col w-full border border-gray-400 rounded-lg mt-6 px-3 py-4">
        <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2 mt-4 text-gray-300">
          <FaFile className="text-4xl" />
          <p>No Purchase Record</p>
        </div>
      </div>
    </div>
  );
};

export default Order;

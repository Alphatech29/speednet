import React from "react";
import { FaFile } from "react-icons/fa";
import { Alert } from "flowbite-react";

const Order = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="mb-4">
        <span className="text-lg font-medium text-gray-200 ">My Purchase</span>
      </div>
      {/* Alert Section */}
      <div>
        <Alert color="warning" rounded className="bg-yellow-100 text-yellow-800 border-yellow-500">
          <span className="font-medium">Important!</span> Customers are not eligible for a refund on any social media product unless it is reported as defective and returned within 24 hours of purchase. To receive prompt assistance, please report any defects immediately after purchase.
        </Alert>
      </div>

      {/* Transactions Section */}
      <div className="bg-slate-700 flex flex-col w-full border border-gray-400 rounded-lg mt-6 px-3 py-4">

        {/* Transaction List */}
        <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2 mt-4 text-gray-300">
          <FaFile className="text-4xl" />
          <p>No Purchase Record</p>
        </div>
      </div>
    </div>
  );
};

export default Order;

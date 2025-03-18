import React from "react";
import { FaHistory } from "react-icons/fa";

const Transaction = () => {
  return (
    <div className="bg-slate-700 flex flex-col w-full border border-gray-400 rounded-lg mt-6 px-3 py-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center text-white text-base">
        <span>Recent Transactions</span>
        <span className="cursor-pointer">View More</span>
      </div>

      {/* Transaction List */}
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2 mt-4 text-gray-300">
        <FaHistory className="text-4xl" />
        <p>No Transactions Yet</p>
      </div>
    </div>
  );
};

export default Transaction;

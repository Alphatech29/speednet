import React from 'react';

const PendingTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Withdrawals</h2>
      <p className="text-gray-600">This tab will display all pending withdrawal requests.</p>
      {/* You can add a table or list here to show the pending withdrawals */}
      <div className="mt-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Date Requested</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row, replace with dynamic data */}
            <tr>
              <td className="py-2 px-4 border-b">John Doe</td>
              <td className="py-2 px-4 border-b">$100.00</td>
              <td className="py-2 px-4 border-b">Pending</td>
              <td className="py-2 px-4 border-b">2023-10-01</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingTab;

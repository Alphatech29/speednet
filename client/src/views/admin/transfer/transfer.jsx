import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../../components/backendApis/admin/apis/users';
import { transferFunds } from '../../../components/backendApis/admin/apis/transfer';
import { getAllTransactions } from '../../../components/backendApis/admin/apis/histroy';
import { formatDateTime } from '../../../components/utils/formatTimeDate';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transfer = () => {
  const [form, setForm] = useState({ recipient: '', amount: '' });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [transferHistory, setTransferHistory] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        const fetchedUsers = Array.isArray(response?.data) ? response.data : [];
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        toast.error('Failed to fetch users.');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter user dropdown by search
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const results = users.filter((user) => {
      const fullName = user.full_name || '';
      const email = user.email || '';
      return fullName.toLowerCase().includes(query) || email.toLowerCase().includes(query);
    });
    setFilteredUsers(results);
  }, [searchQuery, users]);

  // Fetch transaction history filtered by "Fund from Admin"
  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const response = await getAllTransactions();

      if (Array.isArray(response?.data)) {
        const filtered = response.data.filter(
          (txn) => txn.transaction_type === 'Fund from Admin'
        );

        const history = filtered.map((txn) => ({
          full_name: txn.full_name || 'Unknown',
          email: txn.email || 'Unknown',
          amount: parseFloat(txn.amount),
          created_at: formatDateTime(txn.created_at),
        }));

        setTransferHistory(history.slice(0, 10)); // ✅ Limit to top 10
      } else {
        toast.warn('Unexpected response for transactions.');
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast.error('Failed to load transaction history.');
    }
  };

  if (!loading) {
    fetchHistory();
  }
}, [loading]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserSelect = (uid) => {
    setForm({ ...form, recipient: uid });
    setDropdownOpen(false);
    setSearchQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.recipient || !form.amount) {
      toast.warning('Please fill all fields.');
      return;
    }

    try {
      const response = await transferFunds({
        userId: form.recipient,
        amount: form.amount,
      });

      if (response.success) {
        toast.success(response.message || 'Transfer successful');

        const selectedUser = users.find((u) => u.uid === form.recipient);

        setTransferHistory((prev) => [
          {
            full_name: selectedUser?.full_name || 'Unknown',
            email: selectedUser?.email || 'Unknown',
            amount: parseFloat(form.amount),
            created_at: formatDateTime(new Date()),
          },
          ...prev.slice(0, 9),
        ]);

        setForm({ recipient: '', amount: '' });
      } else {
        toast.error(response.message || 'Transfer failed');
        console.error(response.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Transfer Error:', err);
      toast.error('Something went wrong during the transfer.');
    }
  };

  const getSelectedUserLabel = () => {
    const selectedUser = users.find((u) => u.uid === form.recipient);
    return selectedUser ? `${selectedUser.full_name} (${selectedUser.email})` : 'Select recipient';
  };

  return (
    <div className="space-y-5">
      <ToastContainer />

      {/* Transfer Form */}
      <div className="bg-white shadow-xl rounded-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transfer Funds</h2>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer bg-white"
              >
                {getSelectedUserLabel()}
              </div>

              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
                  />

                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.uid}
                        onClick={() => handleUserSelect(user.uid)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {user.full_name} ({user.email})
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No users found</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="w-full border border-gray-300 shadow-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                required
                min={1}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white py-1 rounded-lg px-3 hover:bg-blue-700 transition-colors"
              >
                Send Funds
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Transfer History */}
      <div className="bg-white shadow-xl rounded-md p-6 min-h-[350px]">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Transfers</h3>
        {transferHistory.length === 0 ? (
          <p className="text-gray-500">No transfer history available.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Amount ($)</th>
                  <th className="px-4 py-3">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {transferHistory.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.full_name} ({item.email})</td>
                    <td className="px-4 py-3 font-semibold text-green-700">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfer;

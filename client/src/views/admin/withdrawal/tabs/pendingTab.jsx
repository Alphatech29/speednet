import React, { useEffect, useState } from 'react';
import { Table, Spinner, Modal, Button } from 'flowbite-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getAllWithdrawals,
  updateWithdrawalStatus
} from '../../../../components/backendApis/admin/apis/withdrawal';

const PendingTab = () => {
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch withdrawals
  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const result = await getAllWithdrawals();
      if (result.success && Array.isArray(result.data)) {
        const filtered = result.data.filter(w => w.status === 'pending');
        setPendingWithdrawals(filtered);
      } else {
        toast.error('Failed to load withdrawals');
      }
    } catch (err) {
      toast.error('Error loading withdrawals');
      console.error('Error fetching withdrawals:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Approve
  const handleApprove = async (id) => {
    try {
      const res = await updateWithdrawalStatus(id, 'completed');
      if (res.success) {
        toast.success('Withdrawal approved successfully');
        setIsModalOpen(false);
        await fetchWithdrawals();
      } else {
        toast.error(res.message || 'Failed to approve withdrawal');
      }
    } catch (err) {
      toast.error('Error approving withdrawal');
      console.error('Error approving withdrawal:', err);
    }
  };

  // Reject
  const handleReject = async (id) => {
    try {
      const res = await updateWithdrawalStatus(id, 'rejected');
      if (res.success) {
        toast.success('Withdrawal rejected successfully');
        setIsModalOpen(false);
        await fetchWithdrawals();
      } else {
        toast.error(res.message || 'Failed to reject withdrawal');
      }
    } catch (err) {
      toast.error('Error rejecting withdrawal');
      console.error('Error rejecting withdrawal:', err);
    }
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsModalOpen(true);
  };

  const renderDetails = () => {
    if (!selectedWithdrawal) return null;
    const { method } = selectedWithdrawal;

    if (method === 'Bank') {
      return (
        <div className="space-y-2">
          <p><strong>Account Name:</strong> {selectedWithdrawal.account_name}</p>
          <p><strong>Account Number:</strong> {selectedWithdrawal.account_number}</p>
          <p><strong>Bank Name:</strong> {selectedWithdrawal.bank_name}</p>
          <p><strong>Amount:</strong> ${Number(selectedWithdrawal.amount).toLocaleString()}</p>
        </div>
      );
    }

    if (method === 'Crypto') {
      return (
        <div className="space-y-2">
          <p><strong>Coin Name:</strong> {selectedWithdrawal.coin_name}</p>
          <p><strong>Wallet Address:</strong> {selectedWithdrawal.wallet_address}</p>
          <p><strong>Wallet Network:</strong> {selectedWithdrawal.wallet_network}</p>
          <p><strong>Amount:</strong> ${Number(selectedWithdrawal.amount).toLocaleString()}</p>
        </div>
      );
    }

    if (method === 'MOMO') {
      return (
        <div className="space-y-2">
          <p><strong>MOMO Number:</strong> {selectedWithdrawal.momo_number}</p>
          <p><strong>Amount:</strong> ${Number(selectedWithdrawal.amount).toLocaleString()}</p>
        </div>
      );
    }

    return <p>No method-specific data available.</p>;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Spinner aria-label="Loading pending withdrawals" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Withdrawals</h2>

      <div className="overflow-x-auto">
        <Table hoverable className="bg-transparent">
          <Table.Head className="bg-transparent text-gray-600 mobile:text-[13px]">
            <Table.HeadCell>S/N</Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Method</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell className="text-center">Actions</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {pendingWithdrawals.length > 0 ? (
              pendingWithdrawals.map((withdrawal, index) => (
                <Table.Row key={withdrawal.id} className="text-gray-800">
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{withdrawal.full_name}</Table.Cell>
                  <Table.Cell>${Number(withdrawal.amount).toLocaleString()}</Table.Cell>
                  <Table.Cell>{withdrawal.method}</Table.Cell>
                  <Table.Cell>
                    <span className="px-2 py-1 rounded-full text-yellow-800 text-xs bg-yellow-100 capitalize">
                      {withdrawal.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {withdrawal.created_at
                      ? new Date(withdrawal.created_at).toLocaleString()
                      : 'N/A'}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button
                        size="sm"
                        className="px-2 py-1 bg-slate-800 text-white rounded text-xs hover:bg-gray-700"
                        onClick={() => handleViewDetails(withdrawal)}
                      >
                        Details
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={7} className="text-center py-4 text-gray-500">
                  No pending withdrawals found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} popup>
        <Modal.Body>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedWithdrawal?.full_name}'s Withdrawal Details
            </h3>
            {renderDetails()}
            <div className="flex justify-end gap-2 pt-6">
              <Button
                className="bg-green-700 text-white py-1"
                size="sm"
                onClick={() =>
                  selectedWithdrawal && handleApprove(selectedWithdrawal.id)
                }
              >
                Approve
              </Button>
              <Button
                className="bg-red-700 text-white py-1"
                size="sm"
                onClick={() =>
                  selectedWithdrawal && handleReject(selectedWithdrawal.id)
                }
              >
                Reject
              </Button>
              <Button size="sm" color="gray" className='py-1' onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PendingTab;
import React, { useEffect, useState } from 'react';
import { Table, Spinner, Modal, Button } from 'flowbite-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getAllWithdrawals
} from '../../../../components/backendApis/admin/apis/withdrawal';

const RejectedTab = () => {
  const [completedWithdrawals, setCompletedWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch withdrawals
  const fetchWithdrawals = async () => {
    setLoading(true);
    const result = await getAllWithdrawals();
    if (result.success && Array.isArray(result.data)) {
      const filtered = result.data.filter(w => w.status === 'rejected');
      setCompletedWithdrawals(filtered);
    } else {
      toast.error("Failed to fetch withdrawals.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

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
        <Spinner aria-label="Loading completed withdrawals" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Completed Withdrawals</h2>

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
            {completedWithdrawals.length > 0 ? (
              completedWithdrawals.map((withdrawal, index) => (
                <Table.Row key={withdrawal.id} className="text-gray-800">
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{withdrawal.full_name}</Table.Cell>
                  <Table.Cell>${Number(withdrawal.amount).toLocaleString()}</Table.Cell>
                  <Table.Cell>{withdrawal.method}</Table.Cell>
                  <Table.Cell>
                    <span className="px-2 py-1 rounded-full text-red-800 text-xs bg-red-100 capitalize">
                      {withdrawal.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {withdrawal.updated_at
                      ? new Date(withdrawal.updated_at).toLocaleString()
                      : 'N/A'}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button
                        size="sm"
                        className="px-2 bg-slate-800 text-white rounded text-xs hover:bg-gray-700"
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
                  No completed withdrawals found.
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
              <Button size="sm" color="gray" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RejectedTab;

// Wallet.jsx
import React, { useState, useContext, useEffect } from "react";
import Deposit from "./modal/deposit";
import { AuthContext } from "../../../components/control/authContext";
import { getUserTransactions } from "../../../components/backendApis/history/transaction";
import { Table } from "flowbite-react";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import Notice from "./modal/notice";

const Wallet = () => {
  const { user, webSettings } = useContext(AuthContext);
  const userId = user?.uid?.toString();
  const userRole = user?.role?.toLowerCase();

  const [isDepositOpen, setDepositOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Show notice modal only if user.notice === 0 AND userRole is "user"
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getUserTransactions(userId);
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  // Show notice modal conditionally on user.notice and userRole
  useEffect(() => {
    if (user?.notice === 0 && userRole === "user") {
      setShowNotice(true);
    }
  }, [user?.notice, userRole]);

  const formatAmount = (amount) => `${webSettings.currency}${amount}`;
  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === "completed" || normalized === "successful") return "bg-green-500";
    if (normalized === "failed") return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className="w-full pc:h-screen flex flex-col ">
      {user && webSettings && (
        <>
          {/* Notice modal rendered only if showNotice is true */}
          {showNotice && (
            <Notice onClose={() => setShowNotice(false)} />
          )}

          <div className="text-lg font-medium mb-4 text-gray-200">Wallet</div>

          <div className="flex flex-col pc:flex-row tab:flex-col border border-gray-400 rounded-lg overflow-hidden">
            {/* Left Panel */}
            <div className="bg-primary-600 mobile:h-60 pc:h-full tab:h-full pc:w-[300px] tab:w-full px-4 py-6 flex flex-col items-center justify-between">
              <div className="flex flex-col items-center justify-center">
                <span className="text-pay text-sm">Available Balance</span>
                <p className="text-pay text-xl font-bold text-center">
                  {webSettings.currency}{user?.account_balance}
                </p>
              </div>

              <button
                className="w-full shadow-white shadow-md py-2 mt-6 rounded-md flex justify-center items-center gap-2 text-gray-100 text-[14px] tab:text-[16px] pc:text-[17px]"
                onClick={() => setDepositOpen(true)}
              >
                Add Fund
              </button>
            </div>

            {/* Right Panel */}
            <div className="bg-slate-700 w-full px-3 py-4 flex flex-col ">
              <div className="flex justify-between items-center text-white text-[14px] tab:text-[15px] pc:text-[16px]">
                <span>Recent Transactions</span>
                <span className="cursor-pointer hover:underline">View More</span>
              </div>

              <div className="overflow-x-auto text-gray-300">
                {loading ? (
                  <p className="text-center text-gray-400">Loading transactions...</p>
                ) : transactions.length > 0 ? (
                  <Table hoverable className="bg-transparent ">
                    <Table.Head className="bg-transparent text-gray-200">
                      <Table.HeadCell>Transaction ID</Table.HeadCell>
                      <Table.HeadCell>Description</Table.HeadCell>
                      <Table.HeadCell>Amount</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Date</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y divide-gray-600">
                      {transactions.slice(0, 6).map((transaction) => (
                        <Table.Row key={transaction.transaction_no} className="text-gray-400">
                          <Table.Cell className="text-[12px] tab:text-sm">{transaction.transaction_no}</Table.Cell>
                          <Table.Cell className="text-[12px] tab:text-sm">{transaction.transaction_type}</Table.Cell>
                          <Table.Cell className="text-[12px] tab:text-sm">{formatAmount(transaction.amount)}</Table.Cell>
                          <Table.Cell>
                            <span className={`px-3 py-1 text-[12px] tab:text-sm rounded-full ${getStatusColor(transaction.status)} text-white`}>
                              {transaction.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="text-[12px] tab:text-sm">{formatDateTime(transaction.created_at)}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <p className="text-center text-gray-400">No transactions found</p>
                )}
              </div>
            </div>
          </div>

          {isDepositOpen && <Deposit onClose={() => setDepositOpen(false)} />}
        </>
      )}
    </div>
  );
};

export default Wallet;

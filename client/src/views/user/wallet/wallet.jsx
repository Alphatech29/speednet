import React, { useState, useContext, useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import Deposit from "./modal/deposit";
import { AuthContext } from "../../../components/control/authContext";
import { getUserTransactions } from "../../../components/backendApis/history/transaction";
import { Table } from "flowbite-react";
import { formatDateTime } from "../../../components/utils/formatTimeDate";

const Wallet = () => {
  const { user, webSettings } = useContext(AuthContext);
  const userId = user?.uid?.toString();

  const [isDepositOpen, setDepositOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        const response = await getUserTransactions(userId);

        if (!response.success || !response.data || !Array.isArray(response.data.transactions)) {
          throw new Error("Invalid API response format");
        }

        setTransactions(response.data.transactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  // Function to format amount (currency)
  const formatAmount = (amount) => {
    return `${webSettings.currency}${amount}`;
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {!user || !webSettings ? (
        <p className="text-gray-200">Loading Wallet...</p>
      ) : (
        <>
          <div className="text-lg font-medium mb-4 text-gray-200">Wallet</div>
          <div className="w-full flex justify-start items-center h-[500px] rounded-lg border border-gray-400 overflow-hidden">
            <div className="bg-primary-600 w-96 py-4 px-4 h-full flex flex-col gap-2 justify-between items-center">
              <div className="mt-12 flex flex-col items-center justify-center">
                <span className="text-pay text-sm">Available Balance</span>
                <p className="text-pay text-lg font-semibold text-center">
                  {webSettings.currency}{user?.account_balance}
                </p>
              </div>
              <button
                className="w-full shadow-white shadow-md py-2 rounded-md flex justify-center items-center gap-3 text-gray-200 text-[17px]"
                onClick={() => setDepositOpen(true)}
              >
                <IoMdAddCircle className="text-[20px]" /> Add Fund
              </button>
            </div>

            <div className="bg-slate-700 gap-5 h-full flex flex-col w-full px-3 py-4">
              <div className="w-full flex justify-between items-center text-white text-base">
                <span>Recent Transactions</span>
                <span className="cursor-pointer">View More</span>
              </div>

              <div className="overflow-x-auto text-gray-300">
                {loading ? (
                  <p>Loading Transactions...</p>
                ) : error ? (
                  <p className="text-red-400">{error}</p>
                ) : transactions.length === 0 ? (
                  <Table hoverable className="bg-transparent">
                    <Table.Head className="bg-transparent">
                      <Table.HeadCell>Transaction ID</Table.HeadCell>
                      <Table.HeadCell>Description</Table.HeadCell>
                      <Table.HeadCell>Amount (₦)</Table.HeadCell>
                      <Table.HeadCell>Type</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Date</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row>
                        <Table.Cell colSpan={6} className="text-center h-[400px]">
                          No transaction history available.
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                ) : (
                  <Table hoverable className="bg-transparent">
                    <Table.Head className="bg-transparent text-gray-200">
                      <Table.HeadCell>Transaction ID</Table.HeadCell>
                      <Table.HeadCell>Description</Table.HeadCell>
                      <Table.HeadCell>Amount</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Date</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {transactions.slice(0, 10).map((transaction) => (
                        <Table.Row key={transaction.transaction_no}>
                          <Table.Cell>{transaction.transaction_no}</Table.Cell>
                          <Table.Cell>{transaction.transaction_type}</Table.Cell>
                          <Table.Cell>{formatAmount(transaction.amount)}</Table.Cell>
                          <Table.Cell>
                            <div className={`px-3 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                              {transaction.status}
                            </div>
                          </Table.Cell>
                          <Table.Cell>{formatDateTime(transaction.created_at)}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
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

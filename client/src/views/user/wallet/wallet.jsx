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

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getUserTransactions(userId);

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.warn("Unexpected API response:", data);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const formatAmount = (amount) => `${webSettings.currency}${amount}`;

  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === "completed" || normalized === "successful") {
      return "bg-green-500";
    } else if (normalized === "failed") {
      return "bg-red-500";
    } else {
      return "bg-yellow-500";
    }
  };

  return (
    <div className="w-full h-[100%] flex flex-col">
      {user && webSettings && (
        <>
          <div className="text-lg font-medium mb-4 text-gray-200">Wallet</div>
          <div className="w-full pc:flex justify-start items-center pc:min-h-[500px] pc:max-h-[500px] mobile:min-h-[700px] mobile:max-h-[1200px] rounded-lg border border-gray-400 overflow-hidden">
            <div className="bg-primary-600 pc:w-96 py-4 px-4 pc:h-[500px] flex flex-col gap-2 pc:justify-between items-center">
              <div className="mt-12 flex flex-col items-center justify-center">
                <span className="text-pay text-sm">Available Balance</span>
                <p className="text-pay text-lg font-semibold text-center">
                  {webSettings.currency}
                  {user?.account_balance}
                </p>
              </div>
              <button
                className="w-full shadow-white shadow-md py-2 rounded-md flex justify-center items-center gap-3 text-gray-200 pc:text-[17px] mobile:text-[13px] mobile:mt-8"
                onClick={() => setDepositOpen(true)}
              >
                <IoMdAddCircle className="pc:text-[20px] mobile:text-[16px]" /> Add Fund
              </button>
            </div>

            <div className="bg-slate-700 gap-5 pc:h-[500px] flex flex-col w-full px-3 py-4">
              <div className="w-full flex justify-between items-center text-white pc:text-base mobile:text-[13px]">
                <span>Recent Transactions</span>
                <span className="cursor-pointer">View More</span>
              </div>

              <div className="overflow-x-auto text-gray-300">
                {loading ? (
                  <p className="text-gray-400 text-center">Loading transactions...</p>
                ) : transactions.length > 0 ? (
                  <Table hoverable className="bg-transparent">
                    <Table.Head className="bg-transparent text-gray-200">
                      <Table.HeadCell>Transaction ID</Table.HeadCell>
                      <Table.HeadCell>Description</Table.HeadCell>
                      <Table.HeadCell>Amount</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Date</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {transactions.slice(0, 6).map((transaction) => (
                        <Table.Row key={transaction.transaction_no}>
                          <Table.Cell className="text-gray-300 mobile:text-[12px] pc:text-sm">
                            {transaction.transaction_no}
                          </Table.Cell>
                          <Table.Cell className="text-gray-300 mobile:text-[12px] pc:text-sm">
                            {transaction.transaction_type}
                          </Table.Cell>
                          <Table.Cell className="text-gray-300 mobile:text-[12px] pc:text-sm">
                            {formatAmount(transaction.amount)}
                          </Table.Cell>
                          <Table.Cell>
                            <div
                              className={`px-3 py-1 mobile:text-[12px] pc:text-sm rounded-full ${getStatusColor(
                                transaction.status
                              )} text-white`}
                            >
                              {transaction.status}
                            </div>
                          </Table.Cell>
                          <Table.Cell className="text-gray-300 mobile:text-[12px] pc:text-sm">
                            {formatDateTime(transaction.created_at)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <p className="text-gray-400 text-center">No transactions found</p>
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

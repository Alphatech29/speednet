import React, { useState, useEffect, useContext } from "react";
import { FaHistory } from "react-icons/fa";
import { AuthContext } from "../../../components/control/authContext";
import { getUserOrderHistory } from "../../../components/backendApis/history/orderHistory";
import { Table } from "flowbite-react";
import { formatDateTime } from "../../../components/utils/formatTimeDate";

const Transaction = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchOrderHistory = async () => {
      if (!user?.uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await getUserOrderHistory(String(user.uid));
        const { orderHistory = [], merchantHistory = [] } = response.data || {};

        if (orderHistory.length || merchantHistory.length) {
          const mergedTransactions = [
            ...orderHistory.map((order) => ({
              id: order.order_no || "N/A",
              type: order.order_type || "Unknown",
              amount: order.amount || 0,
              status: order.status || "Unknown",
              date: order.updated_at ? new Date(order.updated_at) : new Date(),
              source: "Order ID:",
            })),
            ...merchantHistory.map((transaction) => ({
              id: transaction.transaction_id || "N/A",
              type: transaction.transaction_type || "Unknown",
              amount: transaction.amount || 0,
              status: transaction.status || "Unknown",
              date: transaction.created_at ? new Date(transaction.created_at) : new Date(),
              source: "",
            })),
          ];

          mergedTransactions.sort((a, b) => b.date - a.date);
          setTransactions(mergedTransactions);
          setError(null);
        } else {
          setTransactions([]);
          setError("No transactions found");
        }
      } catch (err) {
        console.error("Error fetching transaction history:", err);
        setError("Error fetching transaction history");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrderHistory();

    // Polling every 30 seconds
    intervalId = setInterval(fetchOrderHistory, 30000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [user]);

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-500";
    switch (status.toLowerCase()) {
      case "refunded":
        return "bg-red-500";
      case "credited":
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "system":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="bg-slate-700 flex flex-col mobile:w-full tab:w-full pc:w-full border border-gray-400 rounded-lg px-3 py-4">
      <div className="w-full flex justify-between items-center text-white mobile:text-[13px] tab:text-[15px] pc:text-base">
        <span>Recent Transactions</span>
        {!loading && !error && transactions.length > 0 && (
          <span className="cursor-pointer text-primary-400 hover:underline">View More</span>
        )}
      </div>

      <div className="min-h-[300px] flex flex-col gap-2 mt-4 text-gray-300 overflow-auto">
        {loading || error || transactions.length === 0 ? (
          <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2 text-gray-300">
            <FaHistory className="text-4xl" />
            <p>{loading ? "Loading..." : error || "No Transactions Yet"}</p>
          </div>
        ) : (
          <Table hoverable className="bg-transparent min-w-[700px]">
            <Table.Head className="bg-transparent text-gray-200">
              <Table.HeadCell className="mobile:text-[12px] tab:text-sm">Order ID / Transaction ID</Table.HeadCell>
              <Table.HeadCell className="mobile:text-[12px] tab:text-sm">Description</Table.HeadCell>
              <Table.HeadCell className="mobile:text-[12px] tab:text-sm">Amount</Table.HeadCell>
              <Table.HeadCell className="mobile:text-[12px] tab:text-sm">Status</Table.HeadCell>
              <Table.HeadCell className="mobile:text-[12px] tab:text-sm">Date</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {transactions.slice(0, 10).map((transaction) => (
                <Table.Row key={transaction.id}>
                  <Table.Cell className="text-gray-300 mobile:text-[12px] tab:text-sm">
                    {transaction.source} {transaction.id}
                  </Table.Cell>
                  <Table.Cell className="text-gray-300 mobile:text-[12px] tab:text-sm">{transaction.type}</Table.Cell>
                  <Table.Cell className="text-gray-300 mobile:text-[12px] tab:text-sm">
                    {webSettings?.currency}{transaction.amount}
                  </Table.Cell>
                  <Table.Cell className="text-gray-300 mobile:text-[12px] tab:text-sm">
                    <div className={`px-3 py-1 rounded-full text-white text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status || "Unknown"}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-gray-300 mobile:text-[12px] tab:text-sm">
                    {formatDateTime(transaction.date)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Transaction;

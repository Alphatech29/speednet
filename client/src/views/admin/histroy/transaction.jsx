import React, { useEffect, useState } from "react";
import { Table, Spinner } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import { getAllTransactions } from "../../../components/backendApis/admin/apis/histroy";
import "react-toastify/dist/ReactToastify.css";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await getAllTransactions();
      if (res?.success && Array.isArray(res.data)) {
        setTransactions(res.data);
        setFilteredTransactions(res.data);
      } else {
        toast.error("Failed to fetch transactions.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (txn) => txn.transaction_no?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter(
        (txn) => txn.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, transactions]);

  // Capitalize first letter of status
  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="flex flex-col gap-3">
      <ToastContainer />
      <h1 className="text-[18px] font-semibold text-zinc-700">
        Transaction History
      </h1>

      <div className="bg-white flex flex-col w-full border rounded-lg px-3 py-4">
        {/* Search and Filter */}
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <input
            className="rounded-md border px-2 py-1 pc:w-[300px]"
            type="search"
            placeholder="Search by Transaction No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded-md border px-2 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Successful">Successful</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* Table */}
        <div className="pc:w-full min-h-[400px] flex flex-col gap-2 mt-4 text-gray-800 mobile:overflow-auto">
          {loading ? (
            <div className="w-full flex justify-center items-center py-10">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table hoverable className="bg-transparent">
              <Table.Head className="bg-transparent text-gray-600 mobile:text-[13px]">
                <Table.HeadCell className="select-text">S/N</Table.HeadCell>
                <Table.HeadCell className="select-text">Transaction No</Table.HeadCell>
                <Table.HeadCell className="select-text">User</Table.HeadCell>
                <Table.HeadCell className="select-text">Type</Table.HeadCell>
                <Table.HeadCell className="select-text">Amount</Table.HeadCell>
                <Table.HeadCell className="select-text">Status</Table.HeadCell>
                <Table.HeadCell className="select-text">Date</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn, index) => (
                    <Table.Row
                      key={txn.id}
                      className="text-sm hover:bg-gray-100 cursor-pointer z-20 relative transition-colors duration-200"
                    >
                      <Table.Cell className="select-text">{index + 1}</Table.Cell>
                      <Table.Cell className="select-text ">{txn.transaction_no}</Table.Cell>
                      <Table.Cell className="select-text">
                        <div className="flex flex-col">
                          <span className="font-medium">{txn.full_name || "N/A"}</span>
                          <span className="text-xs text-gray-500">{txn.email}</span>
                          <span className="text-xs text-gray-500">{txn.phone_number}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="select-text">{txn.transaction_type}</Table.Cell>
                      <Table.Cell className="select-text">
                        {Number(txn.amount).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Table.Cell>
                      <Table.Cell className="select-text">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            ["completed", "successful"].includes(txn.status?.toLowerCase())
                              ? "bg-green-500 text-white"
                              : txn.status?.toLowerCase() === "pending"
                              ? "bg-yellow-400 text-white"
                              : txn.status?.toLowerCase() === "failed"
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {capitalize(txn.status)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="select-text">
                        {txn.created_at
                          ? new Date(txn.created_at).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="text-sm hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                    <Table.Cell colSpan={7} className="text-center py-4 select-text">
                      No transactions found.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;

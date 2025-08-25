import React, { useEffect, useState } from "react";
import { Table, Spinner } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import { getAllOrderList } from "../../../components/backendApis/admin/apis/histroy";
import "react-toastify/dist/ReactToastify.css";

const AccountOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await getAllOrderList();
      if (res?.success && Array.isArray(res.data)) {
        setOrders(res.data);
        setFilteredOrders(res.data);
      } else {
        toast.error("Failed to fetch account orders.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.order_no?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter(
        order => order.payment_status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="flex flex-col gap-3">
      <ToastContainer />
      <h1 className="text-[18px] font-semibold text-zinc-700">
        Account Order History
      </h1>

      <div className="bg-white flex flex-col w-full border rounded-lg px-3 py-4">
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <input
            className="rounded-md border px-2 py-1 pc:w-[300px]"
            type="search"
            placeholder="Search by Order ID"
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
            <option value="Declined">Declined</option>
          </select>
        </div>

        <div className="pc:w-full min-h-[400px] flex flex-col gap-2 mt-4 text-gray-800 mobile:overflow-auto">
          {loading ? (
            <div className="w-full flex justify-center items-center py-10">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table hoverable className="bg-transparent">
              <Table.Head className="bg-transparent text-gray-600 mobile:text-[13px]">
                <Table.HeadCell>S/N</Table.HeadCell>
                <Table.HeadCell>Order ID</Table.HeadCell>
                <Table.HeadCell>Product</Table.HeadCell>
                <Table.HeadCell>Seller</Table.HeadCell>
                <Table.HeadCell>Buyer</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <Table.Row key={order.id} className="text-sm">
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{order.order_no}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.platform || "N/A"}</span>
                          <span className="text-xs text-gray-500">{order.title}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.seller_name || "N/A"}</span>
                          <span className="text-xs text-gray-500">{order.seller_email}</span>
                          <span className="text-xs text-gray-500">{order.seller_phone}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.buyer_name || "N/A"}</span>
                          <span className="text-xs text-gray-500">{order.buyer_email}</span>
                          <span className="text-xs text-gray-500">{order.buyer_phone}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {Number(order.price).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.payment_status?.toLowerCase() === "completed"
                              ? "bg-green-500 text-white"
                              : order.payment_status?.toLowerCase() === "pending"
                              ? "bg-yellow-400 text-white"
                              : order.payment_status?.toLowerCase() === "declined"
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {capitalize(order.payment_status)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        {order.create_at
                          ? new Date(order.create_at).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={8} className="text-center py-4">
                      No account orders found.
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

export default AccountOrder;

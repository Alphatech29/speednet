import React, { useContext, useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { AuthContext } from "../../../components/control/authContext";
import { getUserOrders } from "../../../components/backendApis/history/orderHistory";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { Table, Button } from "flowbite-react";
import OrderDetails from "./modal/orderDetails";

const Order = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;

    if (user?.uid) {
      getUserOrders(String(user.uid))
        .then((response) => {
          const grouped = response.reduce((acc, order) => {
            const key = `${order.order_no}_${new Date(order.create_at).toISOString()}`;
            acc[key] = acc[key] || [];
            acc[key].push(order);
            return acc;
          }, {});

          const sorted = Object.keys(grouped)
            .sort((a, b) => new Date(grouped[b][0].create_at) - new Date(grouped[a][0].create_at))
            .reduce((acc, key) => {
              acc[key] = grouped[key];
              return acc;
            }, {});
          setOrders(sorted);
        })
        .catch((err) => console.error("Order fetch error:", err))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const handleViewDetails = (orderId) => {
    const allOrders = Object.values(orders).flat();
    const order = allOrders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-300">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div>
        <span className="text-lg font-medium text-gray-300">My Purchase</span>
      </div>

      {/* Alert */}
      <div className="bg-yellow-100 w-full text-yellow-800 border-l-4 border-yellow-500 px-4 py-3 rounded-lg text-sm mobile:text-[13px] pc:text-base">
        <span className="font-medium">Important!</span> Customers are not eligible for a refund on any social media product unless it is reported as defective and returned within 24 hours of purchase.
      </div>

      {/* Purchase History */}
      <div className="bg-slate-700 border border-gray-400 rounded-lg px-3 py-4">
        {Object.keys(orders).length > 0 ? (
          <div className="text-gray-300">
            {Object.keys(orders).map((groupKey) => {
              const [orderNo, orderDate] = groupKey.split("_");
              const orderData = orders[groupKey][0];

              return (
                <div key={groupKey} className="mb-4 bg-gray-800 p-4 rounded-md shadow-md">
                  {/* Order Info */}
                  <div className="flex flex-col mb-3 border-b pb-2">
                    <h1 className="font-medium text-white pc:text-lg mobile:text-[14px]">
                      Order No: {orderNo}
                    </h1>
                    <h2 className="text-white pc:text-sm mobile:text-[12px]">
                      Status: {orderData.payment_status || "Pending"}
                    </h2>
                    <span className="pc:text-sm mobile:text-[12px]">
                      {formatDateTime(orderData.create_at)}
                    </span>
                  </div>

                  {/* Table - Responsive */}
                  <div className="overflow-x-auto">
                    <Table hoverable className="bg-transparent min-w-[600px] text-xs tab:text-sm pc:text-base">
                      <Table.Head className="bg-transparent text-white">
                        <Table.HeadCell>S/N</Table.HeadCell>
                        <Table.HeadCell>Platform</Table.HeadCell>
                        <Table.HeadCell>Title</Table.HeadCell>
                        <Table.HeadCell>Price</Table.HeadCell>
                        <Table.HeadCell>Details</Table.HeadCell>
                      </Table.Head>

                      <Table.Body className="divide-y">
                        {orders[groupKey].map((order, index) => (
                          <Table.Row key={order.id} className="text-gray-300">
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{order.platform}</Table.Cell>
                            <Table.Cell>{order.title}</Table.Cell>
                            <Table.Cell>
                              {webSettings?.currency}
                              {order.price}
                            </Table.Cell>
                            <Table.Cell>
                              <Button
                                className="bg-primary-600 border-0 text-gray-200 text-sm px-3 py-1 rounded-md hover:bg-primary-700 transition"
                                onClick={() => handleViewDetails(order.id)}
                              >
                                View Details
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2 mt-4 text-gray-300">
            <FaFile className="text-4xl" />
            <p>No Purchase Record</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Order;

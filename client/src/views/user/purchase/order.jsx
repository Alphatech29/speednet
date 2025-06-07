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
    if (!user) {
      console.warn("User context is not yet available.");
      return;
    }

    if (user?.uid) {
      const userUid = String(user.uid);
      console.log("Fetching orders for user ID:", userUid);

      getUserOrders(userUid)
        .then((response) => {
          console.log("Orders fetched:", response);

          // Group orders by order_no and create_at
          const groupedOrders = response.reduce((acc, order) => {
            const { order_no, create_at } = order;
            const orderDate = new Date(create_at).toISOString();

            const groupKey = `${order_no}_${orderDate}`;

            if (!acc[groupKey]) {
              acc[groupKey] = [];
            }
            acc[groupKey].push(order);
            return acc;
          }, {});

          // Sort the groups by the latest `create_at`
          const sortedGroupedOrders = Object.keys(groupedOrders)
            .sort((a, b) => {
              const latestA = new Date(groupedOrders[a][0].create_at);
              const latestB = new Date(groupedOrders[b][0].create_at);
              return latestB - latestA;
            })
            .reduce((acc, groupKey) => {
              acc[groupKey] = groupedOrders[groupKey];
              return acc;
            }, {});

          setOrders(sortedGroupedOrders);
        })
        .catch((error) => console.error("Error fetching orders:", error))
        .finally(() => setIsLoading(false));
    } else {
      console.error("Invalid or missing user ID:", user?.uid);
      setIsLoading(false);
    }
  }, [user]);

  const handleViewDetails = (orderId) => {
    // Flatten the grouped orders and search for the order by ID
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
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div>
        <span className="text-lg font-medium text-gray-300">My Purchase</span>
      </div>

      {/* Alert Section */}
      <div
        className="bg-yellow-100 w-full text-yellow-800 border-l-4 border-yellow-500 px-4 py-3 rounded-lg text-sm"
      >
        <span className="font-medium mobile:text-[13px] pc:text-base">Important!</span> Customers are not
        eligible for a refund on any social media product unless it is reported
        as defective and returned within 24 hours of purchase. To receive
        prompt assistance, please report any defects immediately after purchase.
      </div>

      {/* Transactions Section */}
      <div className="bg-slate-700 flex flex-col pc:w-full  border border-gray-400 rounded-lg px-3 py-4">
        {Object.keys(orders).length > 0 ? (
          <div className="text-gray-300">
            {/* Render grouped orders */}
            {Object.keys(orders).map((groupKey) => {
              const [orderNo, orderDate] = groupKey.split('_');
              return (
                <div key={groupKey} className="mb-4 bg-gray-800 p-4 rounded-md gap-4 shadow-md">
                  {/* Order Header */}
                  <div className="flex flex-col mb-3 border-b pb-2">
                    <div className="flex flex-col">
                      <h1 className="pc:text-lg mobile:text-[14px] font-medium text-white">Order No: {orderNo}</h1>
                      <h1 className="text-white p-1 rounded-md pc:text-[14px] mobile:text-[12px]">
                        Status: {orders[groupKey][0]?.payment_status || "Pending"}
                      </h1>
                      <span className="pc:text-[14px] mobile:text-[12px]">{formatDateTime(orders[groupKey][0]?.create_at)}</span>
                    </div>
                  </div>

                 <div className="overflow-auto">
                   {/* Table for Orders under this Order No */}
                  <Table hoverable={true} className="bg-transparent">
                    <Table.Head>
                      <Table.HeadCell>S/N</Table.HeadCell>
                      <Table.HeadCell>Platform</Table.HeadCell>
                      <Table.HeadCell>Title</Table.HeadCell>
                      <Table.HeadCell>Price</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {orders[groupKey].map((order, index) => (
                        <Table.Row className="text-gray-400" key={`${groupKey}-${order.id}`}>
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell>{order.platform}</Table.Cell>
                          <Table.Cell>{order.title}</Table.Cell>
                          <Table.Cell>{webSettings?.currency}{order.price}</Table.Cell>
                          <Table.Cell>
                            <Button
                              className="bg-primary-600 text-sm border-0 text-gray-200 rounded-md cursor-pointer"
                              onClick={() => handleViewDetails(order.id)}
                            >
                              View details
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

      {/* OrderDetails Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}s
        />
      )}
    </div>
  );
};

export default Order;

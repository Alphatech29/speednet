import React, { useContext, useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { AuthContext } from "../../../components/control/authContext";
import {
  getUserOrders,
  getUserDarkshopOrders,
} from "../../../components/backendApis/history/orderHistory";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { Table, Button } from "flowbite-react";
import { FaTelegramPlane } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import OrderDetails from "./modal/orderDetails";
import Report from "./modal/report";

const Order = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [orders, setOrders] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    defendantId: null,
    orderId: null,
  });
  const [timers, setTimers] = useState({});

  // Countdown logic
  const getCountdown = (expiresAt) => {
    if (!expiresAt) return "—";
    const distance = new Date(expiresAt) - new Date();
    if (distance <= 0) return "Escrow Completed";
    const hours = String(Math.floor(distance / (1000 * 60 * 60))).padStart(
      2,
      "0",
    );
    const minutes = String(
      Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    ).padStart(2, "0");
    const seconds = String(
      Math.floor((distance % (1000 * 60)) / 1000),
    ).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Fetch orders
  useEffect(() => {
    if (!user?.uid) return;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        const [normalOrders, darkshopOrders] = await Promise.all([
          getUserOrders(String(user.uid)),
          getUserDarkshopOrders(String(user.uid)),
        ]);

        // Normalize orders
        const normalizedNormalOrders = normalOrders.map((o) => ({
          ...o,
          isDarkshop: false,
          create_at: o.create_at || o.created_at,
        }));

        const normalizedDarkshopOrders = darkshopOrders.map((o) => ({
          ...o,
          isDarkshop: true,
          create_at: o.create_at || o.created_at,
          escrow_expires_at: null, // Darkshop orders have no escrow
        }));

        const combinedOrders = [
          ...normalizedNormalOrders,
          ...normalizedDarkshopOrders,
        ];

        // Group by order_no
        const grouped = combinedOrders.reduce((acc, order) => {
          const key = `${order.order_no}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(order);
          return acc;
        }, {});

        // Sort orders within each group (newest first)
        Object.keys(grouped).forEach((key) => {
          grouped[key].sort(
            (a, b) => new Date(b.create_at) - new Date(a.create_at),
          );
        });

        // Sort groups by latest order date (newest first)
        const sortedGroups = Object.keys(grouped)
          .sort(
            (a, b) =>
              new Date(grouped[b][0].create_at) -
              new Date(grouped[a][0].create_at),
          )
          .reduce((acc, key) => ({ ...acc, [key]: grouped[key] }), {});

        setOrders(sortedGroups);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Timer update
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      Object.keys(orders).forEach((key) => {
        const order = orders[key][0];
        newTimers[key] = order.isDarkshop
          ? "—"
          : getCountdown(order.escrow_expires_at);
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [orders]);

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
      <div>
        <span className="text-lg font-medium text-gray-300">My Purchases</span>
      </div>

      <div className="bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 px-4 py-3 rounded-lg text-sm">
        <span className="font-medium">Important!</span> Refunds only within 24
        hours for defective social media products.
      </div>

      {/* MOBILE UI */}
      <div className="block lg:hidden bg-slate-700 border border-gray-400 rounded-lg px-3 py-4">
        {Object.keys(orders).length > 0 ? (
          <div className="flex flex-col gap-4 text-gray-300">
            {Object.keys(orders)
              .sort(
                (a, b) =>
                  new Date(orders[b][0].create_at) -
                  new Date(orders[a][0].create_at),
              )
              .map((groupKey) => {
                const orderData = orders[groupKey][0];
                const countdown = timers[groupKey] || "—";

                return (
                  <div
                    key={groupKey}
                    className="mb-4 bg-gray-800 p-4 rounded-md shadow-md"
                  >
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <h2 className="font-semibold text-white text-base">
                          Order No: {groupKey}
                        </h2>
                        <p className="text-sm">
                          Status: {orderData.payment_status || "Pending"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDateTime(orderData.create_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {orderData.isDarkshop ? "" : countdown}
                        </p>
                        <div className="flex gap-2 mt-2 justify-end">
                          <Button
                            size="sm"
                            className="bg-primary-600/20 py-1"
                            onClick={() => {
                              setReportData({
                                defendantId: orderData.seller_id,
                                orderId: orderData.order_no,
                              });
                              setShowReportModal(true);
                            }}
                          >
                            <MdReport className="text-base text-[50px]" />
                          </Button>
                          <a
                            href="https://t.me/bobcarly888"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="sm"
                              className="bg-slate-700 text-gray-300 py-1 flex items-center gap-2"
                            >
                              <FaTelegramPlane className="text-base text-[50px]" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-2">
                      {orders[groupKey]
                        .sort(
                          (a, b) =>
                            new Date(b.create_at) - new Date(a.create_at),
                        )
                        .map((order, index) => (
                          <div
                            key={order.id}
                            className="bg-gray-700 p-3 rounded-md flex flex-col gap-1"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {index + 1}. {order.title}
                              </span>
                              <span className="font-semibold">
                                {webSettings?.currency}
                                {order.price}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1 text-xs text-gray-300">
                              <span>Platform: {order.platform}</span>
                              <Button
                                size="xs"
                                className="bg-primary-600 border-0 text-gray-200 px-2 py-1 rounded-md hover:bg-primary-700"
                                onClick={() => handleViewDetails(order.id)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
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

      {/* PC & Tablet UI */}
      <div className="hidden lg:block bg-slate-700 border border-gray-400 rounded-lg px-3 py-4">
        {/* Your previous table-based UI goes here */}
      </div>

      {isModalOpen && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {showReportModal && (
        <Report
          defendantId={reportData.defendantId}
          orderId={reportData.orderId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default Order;

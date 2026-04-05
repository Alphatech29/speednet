import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFile, FaWhatsapp } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { HiClock, HiShieldCheck } from "react-icons/hi";
import { BiPackage } from "react-icons/bi";
import { AuthContext } from "../../../components/control/authContext";
import { getUserOrders, getUserDarkshopOrders } from "../../../components/backendApis/history/orderHistory";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import OrderDetails from "./modal/orderDetails";
import Report from "./modal/report";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  const map = {
    completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
    pending:   "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
    failed:    "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50",
    refunded:  "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${map[s] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {status || "Pending"}
    </span>
  );
};

const getCountdown = (expiresAt) => {
  if (!expiresAt) return null;
  const distance = new Date(expiresAt) - new Date();
  if (distance <= 0) return "Escrow Completed";
  const h = String(Math.floor(distance / 3600000)).padStart(2, "0");
  const m = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const Order = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [orders, setOrders] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ defendantId: null, orderId: null });
  const [timers, setTimers] = useState({});
  const currency = webSettings?.currency || "$";

  useEffect(() => {
    if (!user?.uid) return;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const [normal, dark] = await Promise.all([
          getUserOrders(String(user.uid)),
          getUserDarkshopOrders(String(user.uid)),
        ]);
        const combined = [
          ...normal.map((o) => ({ ...o, isDarkshop: false, create_at: o.create_at || o.created_at })),
          ...dark.map((o) => ({ ...o, isDarkshop: true, create_at: o.create_at || o.created_at, escrow_expires_at: null })),
        ];
        const grouped = combined.reduce((acc, o) => {
          const key = `${o.order_no}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(o);
          return acc;
        }, {});
        Object.keys(grouped).forEach((k) => grouped[k].sort((a, b) => new Date(b.create_at) - new Date(a.create_at)));
        const sorted = Object.keys(grouped)
          .sort((a, b) => new Date(grouped[b][0].create_at) - new Date(grouped[a][0].create_at))
          .reduce((acc, k) => ({ ...acc, [k]: grouped[k] }), {});
        setOrders(sorted);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = {};
      Object.keys(orders).forEach((k) => {
        const o = orders[k][0];
        next[k] = o.isDarkshop ? null : getCountdown(o.escrow_expires_at);
      });
      setTimers(next);
    }, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  const handleViewDetails = (orderId) => {
    const o = Object.values(orders).flat().find((o) => o.id === orderId);
    if (o) { setSelectedOrder(o); setIsModalOpen(true); }
  };

  const orderKeys = Object.keys(orders);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">My Purchases</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">{orderKeys.length} order{orderKeys.length !== 1 ? "s" : ""}</p>
        </div>
        <a href="https://wa.me/17656359872" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
          <FaWhatsapp size={14} /> Get Support
        </a>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-2xl px-5 py-3.5 mb-6">
        <HiShieldCheck size={16} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium leading-relaxed">
          <strong>Important:</strong> Refunds are only available within 24 hours for defective social media products. Open a dispute from the order card below.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded w-1/4" />
                </div>
              </div>
              <div className="h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : orderKeys.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-16 flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <FaFile size={24} className="text-gray-300 dark:text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-500 dark:text-slate-400">No purchases yet</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Your orders will appear here once you make a purchase</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orderKeys.map((groupKey, idx) => {
            const orderData = orders[groupKey][0];
            const countdown = timers[groupKey];
            const items = orders[groupKey];

            return (
              <motion.div
                key={groupKey}
                variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order header */}
                <div className="flex flex-col tab:flex-row tab:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                      <BiPackage size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Order #{groupKey}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">{formatDateTime(orderData.create_at)} · {items.length} item{items.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={orderData.payment_status} />
                    {countdown && !orderData.isDarkshop && (
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${
                        countdown === "Escrow Completed"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                      }`}>
                        <HiClock size={13} />
                        {countdown}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setReportData({ defendantId: orderData.seller_id, orderId: orderData.order_no }); setShowReportModal(true); }}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 px-3 py-2 rounded-xl transition-all border border-red-100 dark:border-red-800/30"
                      >
                        <MdReport size={14} /> Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="px-6 py-4 flex flex-col gap-3">
                  {items.sort((a, b) => new Date(b.create_at) - new Date(a.create_at)).map((order, index) => (
                    <div key={order.id} className="flex items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary-600/20 transition-all group">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-400 dark:text-slate-500 w-5 flex-shrink-0">{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{order.title}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Platform: {order.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{currency}{order.price}</span>
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="text-xs font-semibold bg-primary-600/10 hover:bg-primary-600 text-primary-600 hover:text-white px-3 py-1.5 rounded-xl transition-all border border-primary-600/20"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={() => setIsModalOpen(false)} />
      )}
      {showReportModal && (
        <Report defendantId={reportData.defendantId} orderId={reportData.orderId} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};

export default Order;

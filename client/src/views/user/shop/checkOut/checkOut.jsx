import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../../../components/control/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collectOrder } from "../../../../components/backendApis/purchase/collectOrder";
import { HiShieldCheck, HiArrowLeft } from "react-icons/hi";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { BiPackage } from "react-icons/bi";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const Checkout = () => {
  const navigate = useNavigate();
  const { cart = [], webSettings, user, updateCartState, increaseQty, decreaseQty, removeFromCart } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const currency = webSettings?.currency || "$";

  const { lineItems, subtotal, vat, grandTotal } = useMemo(() => {
    const lineItems = cart.map((item) => {
      const isDarkshop = item.store === "darkshop";
      const quantity = isDarkshop ? item.quantity : 1;
      return { id: item.id, price: Number(item.price || 0), quantity, total: Number(item.price || 0) * quantity };
    });
    const subtotal = lineItems.reduce((s, i) => s + i.total, 0);
    const vatRate = Number(webSettings?.vat || 0);
    const vat = (subtotal * vatRate) / 100;
    return { lineItems, subtotal, vat, grandTotal: subtotal + vat };
  }, [cart, webSettings]);

  const handlePayment = async () => {
    if (!user?.uid) { toast.error("User not authenticated"); return; }
    if (!lineItems.length) { toast.error("Your cart is empty"); return; }
    setIsProcessing(true);
    try {
      const response = await collectOrder({ userId: user.uid, products: lineItems, subtotal, vat, totalAmount: grandTotal });
      if (response?.success) {
        toast.success(response.message || "Order placed successfully");
        updateCartState([]);
        localStorage.removeItem("speednet_cart");
        setTimeout(() => navigate("/user/order"), 1000);
      } else {
        toast.error(response?.message || "Order failed");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <ToastContainer position="top-right" theme="light" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-600 dark:text-slate-300 transition-all">
          <HiArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Checkout</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-16 flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
            <FiShoppingCart size={24} className="text-gray-300 dark:text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Your cart is empty</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Add products from the marketplace to continue</p>
          </div>
          <button onClick={() => navigate("/user/marketplace")}
            className="mt-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-primary-600/25 transition-all">
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="flex flex-col pc:flex-row gap-5">
          {/* Cart items */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.4 }}
            className="flex-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Order Items</p>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {cart.map((item) => {
                const isDarkshop = item.store === "darkshop";
                const qty = isDarkshop ? item.quantity : 1;
                return (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                    {/* Image */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 flex-shrink-0">
                      <img src={item.image} alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-100 capitalize truncate">{item.name}</p>
                      {item.seller && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {item.avatar && (
                            <img src={item.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                              onError={(e) => { e.target.style.display = "none"; }} />
                          )}
                          <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                            {item.seller} <MdVerified size={11} className="text-blue-400" />
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 dark:text-slate-500">{currency}{Number(item.price).toFixed(2)} each</span>
                        {isDarkshop && item.stock_quantity != null && (
                          <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-0.5">
                            <BiPackage size={10} /> {item.stock_quantity} in stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Qty + price */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-sm font-extrabold text-gray-900 dark:text-white">{currency}{(item.price * qty).toFixed(2)}</span>
                      <div className="flex items-center gap-1.5">
                        {isDarkshop ? (
                          <>
                            <button onClick={() => decreaseQty(item.id)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl font-bold text-gray-700 dark:text-slate-200 transition-all">
                              −
                            </button>
                            <span className="text-sm font-bold text-gray-700 dark:text-slate-200 min-w-[20px] text-center">{item.quantity}</span>
                            <button onClick={() => increaseQty(item.id)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl font-bold text-gray-700 dark:text-slate-200 transition-all">
                              +
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-lg">Qty: 1</span>
                        )}
                        <button onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Order summary */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full pc:w-80 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Order Summary</p>
              </div>
              <div className="px-6 py-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-700 dark:text-slate-200">{currency}{subtotal.toFixed(2)}</span>
                </div>
                {Number(webSettings?.vat) > 0 && (
                  <div className="flex justify-between text-sm text-gray-500 dark:text-slate-400">
                    <span>VAT ({webSettings.vat}%)</span>
                    <span className="font-semibold text-gray-700 dark:text-slate-200">{currency}{vat.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-white/5">
                  <span>Total</span>
                  <span>{currency}{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || cart.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm"
            >
              {isProcessing ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Processing...</>
              ) : (
                <>Pay {currency}{grandTotal.toFixed(2)}</>
              )}
            </button>

            <div className="flex flex-col gap-2 px-2">
              {["256-bit SSL encryption", "Instant order processing", "Funds held in escrow"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500">
                  <HiShieldCheck size={13} className="text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

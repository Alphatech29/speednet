import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../components/control/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collectOrder } from "../../../../components/backendApis/purchase/collectOrder";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart = [],
    webSettings,
    user,
    updateCartState,
    increaseQty,
    decreaseQty,
  } = useContext(AuthContext);

  const [isProcessing, setIsProcessing] = useState(false);

  // ==========================
  // ORDER CALCULATION
  // ==========================
  const { products, subtotal, vat, grandTotal } = useMemo(() => {
    const products = cart.map((item) => {
      const isDarkshop = item.store === "darkshop";
      const quantity = isDarkshop ? item.quantity : 1;

      return {
        id: item.id,
        price: Number(item.price || 0),
        quantity,
        total: Number(item.price || 0) * quantity,
      };
    });

    const subtotal = products.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const vatRate = Number(webSettings?.vat || 0);
    const vat = (subtotal * vatRate) / 100;
    const grandTotal = subtotal + vat;

    return { products, subtotal, vat, grandTotal };
  }, [cart, webSettings]);

  // ==========================
  // HANDLE PAYMENT
  // ==========================
  const handlePayment = async () => {
    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    if (!products.length) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    const orderDetails = {
      userId: user.uid,
      products,
      subtotal,
      vat,
      totalAmount: grandTotal,
    };

    try {
      const response = await collectOrder(orderDetails);

      if (response?.success) {
        toast.success(response.message || "Order placed successfully");

        updateCartState([]);
        localStorage.removeItem("speednet_cart");

        setTimeout(() => navigate("/user/order"), 1000);
      } else {
        toast.error(response?.message || "Order failed");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-screen-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-secondary">
        Checkout
      </h2>

      <div className="bg-[#fefce8] shadow-md p-4 rounded-lg flex flex-col tab:flex-row pc:flex-row justify-between gap-6">
        {/* ================= CART ITEMS ================= */}
        <div className="w-full tab:w-[65%] pc:w-[65%]">
          {cart.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cart.map((item) => {
                const isDarkshop = item.store === "darkshop";
                const quantity = isDarkshop ? item.quantity : 1;

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-3 text-secondary"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md border"
                    />

                    <div className="flex flex-col w-full">
                      <span className="font-bold text-base uppercase">
                        {item.name}
                      </span>

                      <div className="flex items-center gap-2 text-xs">
                        <img
                          src={item.avatar}
                          alt="Seller"
                          className="w-4 h-4 rounded-full border"
                        />
                        <span>{item.seller}</span>
                      </div>

                      {/* PRICE + QUANTITY */}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">
                          {webSettings.currency}
                          {Number(item.price).toFixed(2)}
                        </span>

                        {/* DARKSHOP ONLY */}
                        {isDarkshop ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded font-bold"
                            >
                              −
                            </button>

                            <span className="min-w-[24px] text-center font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => increaseQty(item.id)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded font-bold"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold">
                            Qty: 1
                          </span>
                        )}

                        <span className="font-semibold">
                          {webSettings.currency}
                          {(item.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-secondary">No items in cart</p>
          )}
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="w-full tab:w-[35%] pc:w-[35%] border-t tab:border-t-0 pc:border-t-0 tab:border-l pc:border-l border-primary-600 pt-4 tab:pt-0 tab:pl-6">
          <h3 className="text-secondary font-medium mb-3 text-lg">
            Order Summary
          </h3>

          <p className="flex justify-between text-secondary text-sm">
            <span>Subtotal:</span>
            <span>
              {webSettings.currency}
              {subtotal.toFixed(2)}
            </span>
          </p>

          <p className="flex justify-between text-secondary text-sm">
            <span>VAT ({webSettings.vat}%):</span>
            <span>
              {webSettings.currency}
              {vat.toFixed(2)}
            </span>
          </p>

          <p className="flex justify-between font-bold text-secondary text-base mt-2">
            <span>Total:</span>
            <span>
              {webSettings.currency}
              {grandTotal.toFixed(2)}
            </span>
          </p>

          <button
            onClick={handlePayment}
            disabled={isProcessing || cart.length === 0}
            className={`w-full p-2 mt-4 rounded-md transition ${
              isProcessing
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 text-white"
            }`}
          >
            {isProcessing ? "Processing..." : "Pay"}
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Checkout;

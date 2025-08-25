import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../components/control/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collectOrder } from "../../../../components/backendApis/purchase/collectOrder";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0, vat = 0, grandTotal = 0 } = location.state || {};
  const { webSettings, user, updateCartState } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user || !user.uid) {
      toast.error("User not authenticated");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsProcessing(true);

    const orderDetails = {
      userId: user.uid,
      products: cart.map((item) => item.id),
      totalAmount: grandTotal,
    };

    try {
      const response = await collectOrder(orderDetails);

      if (response.success) {
        toast.success(response.message);
        updateCartState([]);
        localStorage.removeItem("cart");
        sessionStorage.removeItem("cart");

        setTimeout(() => {
          navigate("/user/order");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(" API Error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-screen-xl mx-auto ">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Checkout</h2>

      <div className="bg-gray-900 p-4 rounded-lg flex flex-col tab:flex-row pc:flex-row justify-between gap-6">
        {/* Cart Items */}
        <div className="w-full tab:w-[65%] pc:w-[65%]">
          {cart.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-3 text-gray-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 mobile:w-14 mobile:h-14 rounded-md border"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-base uppercase">{item.name}</span>
                    <div className="flex items-center gap-2 text-gray-400">
                      <img
                        src={item.avatar}
                        alt="Seller"
                        className="w-4 h-4 rounded-full border"
                      />
                      <span className="text-xs">{item.seller}</span>
                    </div>
                    <span className="text-gray-200 text-sm">
                      {webSettings.currency}
                      {Number(item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in cart</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full tab:w-[35%] pc:w-[35%] border-t tab:border-t-0 pc:border-t-0 tab:border-l pc:border-l border-gray-600 pt-4 tab:pt-0 pc:pt-0 tab:pl-6 pc:pl-6">
          <div>
            <h3 className="text-gray-100 font-medium mb-3 text-lg">Order Summary</h3>
            <p className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal:</span>
              <span>{webSettings.currency}{Number(total).toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-gray-400 text-sm">
              <span>VAT ({webSettings.vat}%):</span>
              <span>{webSettings.currency}{Number(vat).toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold text-gray-100 text-base mt-2">
              <span>Total:</span>
              <span>{webSettings.currency}{Number(grandTotal).toFixed(2)}</span>
            </p>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full p-2 mt-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                isProcessing
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              }`}
            >
              {isProcessing ? "Processing..." : "Pay"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Checkout;

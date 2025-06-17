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

        // Reset the cart in context and local storage after successful order
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
      console.error("⚠️ API Error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Checkout</h2>
      <div className="bg-gray-900 p-4 rounded-lg flex justify-between min-h-[500px]">
        <div className="w-[650px]">
          {cart.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-3 text-gray-300">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md border" />
                  <div className="flex flex-col">
                    <span className="font-bold text-base uppercase">{item.name}</span>
                    <div className="flex items-center gap-2 text-gray-400">
                      <img src={item.avatar} alt="Seller" className="w-3 h-3 rounded-full border" />
                      <span className="text-xs">{item.seller}</span>
                    </div>
                    <span className="text-gray-200 text-sm">
                      {webSettings.currency}{Number(item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in cart</p>
          )}
        </div>
        <div className="border-l-4 border-gray-600 px-4 w-[350px] h-full">
          <div className="mt-4">
            <h3 className="text-gray-100 font-medium mb-3 text-lg">Order Summary</h3>
            <p className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span>{webSettings.currency}{Number(total).toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-gray-400">
              <span>VAT ({webSettings.vat}%):</span>
              <span>{webSettings.currency}{Number(vat).toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold text-gray-100">
              <span>Total:</span>
              <span>{webSettings.currency}{Number(grandTotal).toFixed(2)}</span>
            </p>
          </div>
          <button 
            onClick={handlePayment} 
            className={`w-full p-2 mt-4 rounded-md ${isProcessing ? "bg-gray-600 cursor-not-allowed" : "bg-primary-600 text-white"}`}
            disabled={isProcessing}
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

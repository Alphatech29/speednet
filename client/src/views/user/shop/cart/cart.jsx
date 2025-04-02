import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { FiShoppingCart } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { AuthContext } from "../../../../components/control/authContext";

const Cart = ({ isCartOpen, toggleCartDropdown }) => {
  const navigate = useNavigate();
  const { cart = [], removeFromCart, webSettings } = useContext(AuthContext);

  // Function to calculate total amount and VAT
  const calculateTotalWithVAT = () => {
    if (!Array.isArray(cart)) return { total: 0, vat: 0, grandTotal: 0 };

    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    
    // Ensure webSettings.vat is a valid number before using it in VAT calculation
    const vatRate = parseFloat(webSettings?.vat);
    const vat = total * (vatRate / 100);
    
    return { total, vat, grandTotal: total + vat };
  };

  const { total, vat, grandTotal } = calculateTotalWithVAT();

  return (
    <div className="relative">
      <FiShoppingCart
        className="text-[40px] rounded-full shadow-lg p-2 cursor-pointer"
        onClick={toggleCartDropdown}
      />
      {cart.length > 0 && (
        <span
          className="bg-red-600 px-2 py-1 absolute top-0 right-0 text-[9px] text-white rounded-full mb-4 cursor-pointer"
          onClick={toggleCartDropdown}
        >
          {cart.length}
        </span>
      )}

      {isCartOpen && (
        <div className="absolute z-30 right-0 mt-2 w-96 max-h-[500px] overflow-y-auto bg-slate-700 text-white rounded-lg shadow-lg py-6 px-2">
          {cart.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center border-b border-gray-500 pb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full border border-white"
                  />
                  <div className="flex w-full flex-col justify-start items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.avatar}
                          alt="Seller"
                          className="size-5 rounded-full border border-white"
                        />
                        <span>{item.seller}</span>
                      </div>
                      <span className="font-semibold text-base">{item.name}</span>
                    </div>
                    <div className="flex justify-between w-full items-center">
                      <span className="text-gray-400">{webSettings.currency}{(Number(item.price) || 0).toFixed(2)}</span>
                      <button
                        className="text-gray-300 hover:text-red-600"
                        onClick={() => removeFromCart(item.id)} // Ensure removeFromCart updates the cart state
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Display total, VAT, and grand total */}
              <div className="border-t border-gray-500 pt-4">
                <p className="flex justify-between text-sm">
                  <span>Sum:</span>
                  <span>{webSettings.currency}{total.toFixed(2)}</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span className="text-sm">Vat ({webSettings.vat}%):</span>
                  <span>{webSettings.currency}{vat.toFixed(2)}</span>
                </p>
                <p className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>{webSettings.currency}{grandTotal.toFixed(2)}</span>
                </p>

                {/* Checkout Button: Pass Full Cart Data */}
                <Button
                  className="bg-primary-600 text-base w-full border-0 mt-4 rounded-md"
                  onClick={() => {
                    navigate("/user/check-out", {
                      state: { cart, total, vat, grandTotal },
                    });
                    toggleCartDropdown();  // Close the cart dropdown after navigation
                  }}
                >
                  Checkout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-[40px] rounded-full shadow-lg p-4 bg-slate-100">
                <FiShoppingCart className="text-gray-600" />
              </span>
              <p className="px-4 py-2 text-base text-gray-400">Your cart is empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;

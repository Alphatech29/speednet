import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { FiShoppingCart } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { AuthContext } from "../../../../components/control/authContext";

const Cart = ({ isCartOpen, toggleCartDropdown }) => {
  const navigate = useNavigate();

  const {
    cart = [],
    removeFromCart,
    increaseQty,
    decreaseQty,
    webSettings,
  } = useContext(AuthContext);

  // ==========================
  // CALCULATE TOTAL + VAT
  // ==========================
  const calculateTotalWithVAT = () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return { total: 0, vat: 0, grandTotal: 0 };
    }

    const total = cart.reduce((sum, item) => {
      const isDarkshop = item.store === "darkshop";
      const quantity = isDarkshop ? item.quantity : 1;
      return sum + Number(item.price || 0) * quantity;
    }, 0);

    const vatRate = Number(webSettings?.vat || 0);
    const vat = (total * vatRate) / 100;
    const grandTotal = total + vat;

    return { total, vat, grandTotal };
  };

  const { total, vat, grandTotal } = calculateTotalWithVAT();

  return (
    <div className="relative">
      {/* CART ICON */}
      <FiShoppingCart
        className="text-[40px] rounded-full shadow-lg p-2 cursor-pointer"
        onClick={toggleCartDropdown}
      />

      {/* CART COUNT */}
      {cart.length > 0 && (
        <span
          className="bg-red-600 px-2 py-1 absolute top-0 right-0 text-[9px] text-white rounded-full cursor-pointer"
          onClick={toggleCartDropdown}
        >
          {cart.reduce((sum, item) => {
            const isDarkshop = item.store === "darkshop";
            return sum + (isDarkshop ? item.quantity : 1);
          }, 0)}
        </span>
      )}

      {/* CART DROPDOWN */}
      {isCartOpen && (
        <div className="absolute z-30 right-0 mt-2 w-96 max-h-[500px] mobile:right-[-50px] overflow-y-auto bg-[#fefce8] text-secondary rounded-lg shadow-lg py-6 px-2">
          {cart.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cart.map((item) => {
                const isDarkshop = item.store === "darkshop";
                const quantity = isDarkshop ? item.quantity : 1;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center border-b border-primary-600 pb-3"
                  >
                    {/* IMAGE */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-full border border-primary-600"
                    />

                    {/* DETAILS */}
                    <div className="flex w-full flex-col">
                      <span className="font-semibold text-base">
                        {item.name}
                      </span>

                      <div className="flex justify-between items-center w-full mt-1">
                        {/* PRICE */}
                        <span className="text-secondary text-sm">
                          {webSettings.currency}
                          {(item.price * quantity).toFixed(2)}
                        </span>

                        {/* QUANTITY / ACTIONS */}
                        <div className="flex items-center gap-2">
                          {isDarkshop ? (
                            <>
                              <button
                                onClick={() => decreaseQty(item.id)}
                                className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded font-bold"
                              >
                                −
                              </button>

                              <span className="min-w-[20px] text-center text-sm font-semibold">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => increaseQty(item.id)}
                                className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded font-bold"
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <span className="text-sm font-semibold">
                              Qty: 1
                            </span>
                          )}

                          {/* DELETE */}
                          <button
                            className="text-secondary hover:text-red-600 ml-2"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <MdDeleteForever size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* TOTAL SECTION */}
              <div className="border-t border-gray-500 pt-4">
                <p className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>
                    {webSettings.currency}
                    {total.toFixed(2)}
                  </span>
                </p>

                <p className="flex justify-between text-sm">
                  <span>VAT ({webSettings.vat}%):</span>
                  <span>
                    {webSettings.currency}
                    {vat.toFixed(2)}
                  </span>
                </p>

                <p className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>
                    {webSettings.currency}
                    {grandTotal.toFixed(2)}
                  </span>
                </p>

                <Button
                  className="bg-primary-600 text-base w-full border-0 mt-4 rounded-md"
                  onClick={() => {
                    navigate("/user/check-out");
                    toggleCartDropdown();
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
              <p className="px-4 py-2 text-base text-gray-400">
                Your cart is empty
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;

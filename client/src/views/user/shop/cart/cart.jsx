import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiChevronRight } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi";
import { AuthContext } from "../../../../components/control/authContext";

const Cart = ({ isCartOpen, toggleCartDropdown }) => {
  const navigate = useNavigate();
  const { cart = [], removeFromCart, increaseQty, decreaseQty, webSettings } = useContext(AuthContext);

  const currency = webSettings?.currency || "$";

  const { total, vat, grandTotal } = (() => {
    const total = cart.reduce((sum, item) => {
      const qty = item.store === "darkshop" ? item.quantity : 1;
      return sum + Number(item.price || 0) * qty;
    }, 0);
    const vatRate = Number(webSettings?.vat || 0);
    const vat = (total * vatRate) / 100;
    return { total, vat, grandTotal: total + vat };
  })();

  const itemCount = cart.reduce((sum, item) => sum + (item.store === "darkshop" ? item.quantity : 1), 0);

  return (
    <div className="relative">
      {/* Cart icon */}
      <button
        onClick={toggleCartDropdown}
        className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-slate-400 transition-all"
      >
        <FiShoppingCart size={17} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isCartOpen && (
        <div className="absolute z-40 right-0 mt-2 w-80 tab:w-96 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden mobile:right-[-60px]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <FiShoppingCart size={15} className="text-primary-600" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">Cart</span>
              {cart.length > 0 && (
                <span className="bg-primary-600/10 text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
              )}
            </div>
          </div>

          {cart.length > 0 ? (
            <>
              {/* Items */}
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800 px-4 py-2">
                {cart.map((item) => {
                  const isDarkshop = item.store === "darkshop";
                  const qty = isDarkshop ? item.quantity : 1;
                  return (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800/50 flex-shrink-0 border border-gray-100 dark:border-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-slate-100 truncate capitalize">{item.name}</p>
                        <p className="text-xs text-primary-600 font-bold mt-0.5">{currency}{(item.price * qty).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isDarkshop && (
                          <>
                            <button onClick={() => decreaseQty(item.id)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-gray-700 dark:text-slate-200 font-bold text-sm transition-all">
                              −
                            </button>
                            <span className="text-xs font-bold text-gray-700 dark:text-slate-200 min-w-[16px] text-center">{item.quantity}</span>
                            <button onClick={() => increaseQty(item.id)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-gray-700 dark:text-slate-200 font-bold text-sm transition-all">
                              +
                            </button>
                          </>
                        )}
                        <button onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-1">
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="border-t border-gray-100 dark:border-white/5 px-5 py-4 bg-gray-50/50 dark:bg-slate-800/50">
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold">{currency}{total.toFixed(2)}</span>
                  </div>
                  {Number(webSettings?.vat) > 0 && (
                    <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
                      <span>VAT ({webSettings.vat}%)</span>
                      <span className="font-semibold">{currency}{vat.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-slate-700">
                    <span>Total</span>
                    <span>{currency}{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => { navigate("/user/check-out"); toggleCartDropdown(); }}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-3 rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all"
                >
                  Checkout <FiChevronRight size={14} />
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <HiShieldCheck size={12} className="text-green-500" />
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">Secure checkout</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-10 px-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <FiShoppingCart size={22} className="text-gray-400 dark:text-slate-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-600 dark:text-slate-300">Cart is empty</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Add products from the marketplace</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;

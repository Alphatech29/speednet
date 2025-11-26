import React from "react";
import { FiEye, FiShoppingCart, FiCheck } from "react-icons/fi";

const ColumnView = ({ products, cart, openDetailsModal, handleAddToCart }) => {
  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => {
        const isAdded = cart.some((i) => i.id === product.id);

        return (
          <div
            key={product.id}
            className="flex flex-row shadow-lg p-2 rounded-lg bg-gray-700 gap-3"
          >
            <img
              src={product.image}
              alt={product.name}
              className="tab:w-16 tab:h-16 mobile:size-9 rounded-md object-cover bg-white"
            />

            <div className="flex justify-between items-center flex-1">
              <div className="flex-1 flex flex-col">
                <div className="font-semibold text-white text-sm capitalize line-clamp-2 tab:text-lg break-words">
                  {product.name}
                </div>

                <p className="text-gray-300 text-sm line-clamp-1">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 text-gray-300 mt-2">
                  {product.avatar && (
                    <img
                      src={product.avatar}
                      className="w-7 h-7 mobile:size-5 rounded-full border border-white"
                    />
                  )}
                  <span className="text-sm">{product.seller}</span>
                </div>
              </div>

              <div className="flex flex-col items-end justify-end space-y-2">
                <span className="text-sm text-white">${product.price}</span>

                <div className="flex justify-end gap-3 mt-2">
                  {/* Details Button */}
                  <button
                    onClick={() => openDetailsModal(product)}
                    className="bg-orange-900 text-xs px-3 py-1 rounded-sm text-white flex items-center justify-center"
                  >
                    {/* Text for tablet and larger */}
                    <span className="hidden mobile:hidden tab:inline">
                      Details
                    </span>

                    {/* Icon for mobile */}
                    <FiEye className="text-[12px] tab:hidden" />
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdded}
                    className={`text-xs px-3 py-1 rounded-sm text-white flex items-center justify-center ${
                      isAdded ? "bg-green-500" : "bg-primary-600"
                    }`}
                  >
                    {/* Text for tablet and larger */}
                    <span className="hidden mobile:hidden tab:inline">
                      {isAdded ? "Added" : "Add to cart"}
                    </span>

                    {/* Icons for mobile */}
                    {isAdded ? (
                      <FiCheck className="text-[12px] tab:hidden" />
                    ) : (
                      <FiShoppingCart className="text-[12px] tab:hidden" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColumnView;

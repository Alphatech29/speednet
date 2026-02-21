import React from "react";
import { FiEye, FiShoppingCart, FiCheck } from "react-icons/fi";

const ColumnView = ({ products, cart, openDetailsModal, handleAddToCart }) => {
  return (
    <div className="flex flex-col gap-3 mobile:p-2">
      {products.map((product) => {
        const isAdded = cart.some((i) => i.id === product.id);

        return (
          <div
            key={product.id}
            className="flex justify-center mobile:p-1.5 rounded-lg bg-[#fefce8] shadow-lg gap-3 items-center"
          >
            <div>
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="mobile:w-8 mobile:h-9 tab:w-16 tab:h-16 pc:w-16 pc:h-16 rounded-md object-cover flex-shrink-0 "
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-secondary font-semibold text-sm mobile:text-[13px] tab:text-base pc:text-lg line-clamp-2 break-words capitalize">
                    {product.name}
                  </h2>
                  <span className="text-secondary font-medium text-sm mobile:text-sm tab:text-base pc:text-lg">
                    ${product.price}
                  </span>
                </div>
                <p
                  className="text-secondary/50 text-xs mobile:text-[11px] tab:text-sm pc:text-sm line-clamp-2 mt-1"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></p>

                <div className="flex justify-between items-center w-full">
                  <div className="flex justify-start items-start gap-3">
                     {product.seller && (
                    <div className="flex items-center gap-2 mt-2">
                      {product.avatar && (
                        <img
                          src={product.avatar}
                          className="mobile:w-4 mobile:h-4 tab:w-4 tab:h-4 rounded-full border border-white object-cover"
                        />
                      )}
                      <span className="text-secondary/60 text-xs mobile:text-[11px] tab:text-sm pc:text-sm">
                        {product.seller}
                      </span>
                    </div>
                  )}

                  <div>
                       {product.instant_delivery && (
                    <div className="flex items-center gap-2 mt-2">
                      {product.icon && (
                        <img
                          src={product.icon}
                          className="mobile:w-4 mobile:h-4 tab:w-4 tab:h-4 rounded-full object-cover"
                        />
                      )}
                      <span className="text-secondary/60 text-xs mobile:text-[11px] tab:text-sm pc:text-sm">
                        Instant Delivery
                      </span>
                    </div>
                  )}
                  </div>
                   <div>
                       {product.quantity && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-secondary/60 text-xs mobile:text-[11px] tab:text-sm pc:text-sm">
                        {product.stock_quantity} in stock
                      </span>
                    </div>
                  )}
                  </div>
                  </div>
                  <div className="flex gap-2">
                    {/* Details Button */}
                    <button
                      onClick={() => openDetailsModal(product)}
                      className="bg-orange-900 text-white text-xs mobile:text-[11px] tab:text-sm pc:text-base px-3 py-1 rounded flex items-center justify-center"
                    >
                      <span className="tab:inline mobile:hidden pc:inline text-[10px]">
                        Details
                      </span>
                      <FiEye className="mobile:inline tab:hidden pc:hidden text-[14px]" />
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdded}
                      className={`flex items-center justify-center text-xs mobile:text-[11px] tab:text-sm pc:text-base px-3  rounded ${
                        isAdded ? "bg-green-500" : "bg-primary-600"
                      } text-white`}
                    >
                      <span className="tab:inline mobile:hidden pc:inline text-[10px]">
                        {isAdded ? "Added" : "Add to cart"}
                      </span>
                      {isAdded ? (
                        <FiCheck className="mobile:inline tab:hidden pc:hidden text-[14px]" />
                      ) : (
                        <FiShoppingCart className="mobile:inline tab:hidden pc:hidden text-[14px]" />
                      )}
                    </button>
                  </div>
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

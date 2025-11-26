import React from "react";

const GridView = ({ products, cart, openDetailsModal, handleAddToCart }) => {
  return (
    <div className="grid pc:grid-cols-5 tab:grid-cols-3 mobile:grid-cols-2 gap-3">
      {products.map((product) => {
        const isAdded = cart.some((i) => i.id === product.id);

        return (
          <div
            key={product.id}
            className="flex flex-col justify-between shadow-lg p-2 rounded-lg bg-gray-700"
          >
            <img
              src={product.image}
              className="w-full h-[120px] rounded-md object-cover bg-white"
            />

            <div className="mt-2 font-semibold text-white line-clamp-2 break-words capitalize mb-2">
              {product.name}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-300">
                {product.avatar && (
                  <img
                    src={product.avatar}
                    className="size-7 rounded-full border border-white"
                  />
                )}
                <span className="text-sm">{product.seller}</span>
              </div>
              <span className="text-sm text-white">${product.price}</span>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => openDetailsModal(product)}
                className="bg-orange-900 text-xs px-2 py-1 rounded-sm text-white"
              >
                Details
              </button>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={isAdded}
                className={`text-xs px-2 py-1 rounded-sm text-white ${
                  isAdded ? "bg-green-500" : "bg-primary-600"
                }`}
              >
                {isAdded ? "Added" : "Add to cart"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridView;

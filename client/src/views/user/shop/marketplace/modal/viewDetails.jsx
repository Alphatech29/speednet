import React from "react";

const ViewDetails = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center  bg-black bg-opacity-50 z-50">
      <div className=" bg-gray-800 p-6 rounded-lg shadow-lg pc:w-[500px] mobile:w-[360px] flex flex-col gap-4 text-gray-200 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-end top-2 right-2 text-red-500 text-sm hover:text-red-400"
        >
          Close ✕
        </button>

        {/* Product Details */}
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-sm mt-3">{product.description}</p>

          {/* Seller Info */}
          <div className="flex items-center gap-3 mt-4">
            {product.avatar && (
              <img
                src={product.avatar}
                alt={product.seller || "Product"}
                className="w-7 h-7 rounded-full object-cover"
              />
            )}
            <span className="text-sm font-medium">{product.seller}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ViewDetails;

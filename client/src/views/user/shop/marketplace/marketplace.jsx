import React, { useContext, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { AuthContext } from "../../../../components/control/authContext"; 

const Marketplace = () => {
  const { addToCart, cart } = useContext(AuthContext); // Get addToCart and cart from context

  const products = [
    {
      id: 1,
      name: "7 Years USA New York Facebook Account",
      price: 50,
      seller: "Alphatech",
      image: "/image/facebook.png",
    },
    {
      id: 2,
      name: "10 Years USA Verified Instagram Account",
      price: 75,
      seller: "Alphatech",
      image: "/image/facebook.png",
    },
    {
      id: 3,
      name: "10 Years USA Verified Instagram Account",
      price: 75,
      seller: "Alphatech",
      image: "/image/facebook.png",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-white font-medium">Marketplace</h1>
          <p className="text-sm text-gray-300">
            Browse a wide range of products from our verified marketplace sellers.
          </p>
        </div>
        <div>
          <input
            type="text"
            id="search"
            placeholder="Search by name or category"
            className="p-2 w-56 border shadow-md border-slate-50 rounded-md bg-transparent text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        {products.map((product) => {
          const isAdded = cart.some((item) => item.id === product.id);
          return (
            <div
              key={product.id}
              className="flex gap-4 flex-col shadow-lg shadow-slate-950 p-2 rounded-lg w-48 bg-gray-700"
            >
              <div className="w-full h-[120px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full bg-white h-[120px] rounded-md object-fill"
                />
              </div>
              <div className="text-[15px] font-semibold text-white w-full">
                {product.name}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center text-slate-200">
                  <img
                    src="/image/user.png"
                    alt="Seller"
                    className="size-7 rounded-full shadow-lg shadow-white border border-white"
                  />
                  <span className="text-sm">{product.seller}</span>
                </div>
                <span className="text-slate-200 text-base font-medium">
                  ${product.price}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <button className="flex gap-1 bg-orange-900 justify-start items-center rounded-sm py-1 px-2 text-[12px] text-white">
                  <BsEyeFill /> Details
                </button>
                <button
                  onClick={() => addToCart(product)}
                  className={`flex gap-1 justify-start items-center rounded-sm py-1 px-2 text-[12px] text-white ${isAdded ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-600'}`}
                  disabled={isAdded}
                >
                  {isAdded ? "Added" : "Add to cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;
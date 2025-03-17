import React, { useContext, useState, useEffect } from "react";
import { BsEyeFill } from "react-icons/bs";
import { AuthContext } from "../../../../components/control/authContext";
import { getAllAccounts } from "../../../../components/backendApis/accounts/accounts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Marketplace = () => {
  const { addToCart, cart } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAllAccounts();
        console.log("API Response:", response);

        if (response && response.success && Array.isArray(response.data.data)) {
          const formattedProducts = response.data.data.map((account) => ({
            id: account.id,
            name: account.title,
            price: account.price,
            seller: account.username,
            image: account.logo_url,
            avatar: account.avatar,
          }));

          setProducts(formattedProducts);
        } else {
          setError("Invalid response format.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch marketplace data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Product add Successful", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Notification Container */}
      <ToastContainer className="text-sm" />

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

      {loading && (
        <div className="w-full  flex justify-center items-center">
          <p className="text-white">Loading products...</p>
        </div>
      )}
      {error && (
        <div className="w-full flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <div className="w-full grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        {products.map((product) => {
          const isAdded = cart.some((item) => item.id === product.id);
          return (
            <div
              key={product.id}
              className="flex justify-between gap-4 flex-col shadow-lg shadow-slate-950 p-2 rounded-lg w-48 bg-gray-700"
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
                    src={product.avatar}
                    alt="Seller"
                    className="size-7 rounded-full shadow-lg shadow-white border border-white"
                  />
                  <span className="text-sm">{product.seller}</span>
                </div>
                <span className="text-slate-200 text-sm font-medium">
                  ${product.price}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <button className="flex gap-1 bg-orange-900 justify-start items-center rounded-sm py-1 px-2 text-[12px] text-white">
                  <BsEyeFill /> Details
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`flex gap-1 justify-start items-center rounded-sm py-1 px-2 text-[12px] text-white ${
                    isAdded ? "bg-gray-500 cursor-not-allowed" : "bg-primary-600"
                  }`}
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

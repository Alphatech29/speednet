import React, { useContext, useState, useEffect } from "react";
import { BsEyeFill } from "react-icons/bs";
import { AuthContext } from "../../../../components/control/authContext";
import { getAllAccounts } from "../../../../components/backendApis/accounts/accounts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewDetails from "./modal/viewDetails";

const Marketplace = () => {
  const { updateCartState, cart } = useContext(AuthContext); // Correct usage of context
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAllAccounts();
        if (response && response.success && Array.isArray(response.data.data)) {
          const formattedProducts = response.data.data
            .filter((account) => account.status === "approved")
            .map((account) => ({
              id: account.id,
              name: account.title,
              price: account.price,
              seller: account.username,
              image: account.logo_url,
              description: account.description,
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
    const updatedCart = [...cart, product];
    updateCartState(updatedCart); // Update cart in the context and persist it
    toast.success("Product added successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const openDetailsModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
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
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or category"
            className="p-2 w-56 border shadow-md border-slate-50 rounded-md bg-transparent text-white placeholder-gray-400"
          />
        </div>
      </div>

      {loading && (
        <div className="w-full flex justify-center items-center">
          <p className="text-white">Loading products...</p>
        </div>
      )}
      {error && (
        <div className="w-full flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <div className="w-full grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
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
                  <button
                    className="flex gap-1 bg-orange-900 justify-start items-center rounded-sm py-1 px-2 text-[12px] text-white"
                    onClick={() => openDetailsModal(product)}
                  >
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
          })
        ) : (
          <div className="w-full text-center text-white">No products found</div>
        )}
      </div>

      {showModal && selectedProduct && (
        <ViewDetails
          product={selectedProduct}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
};

export default Marketplace;

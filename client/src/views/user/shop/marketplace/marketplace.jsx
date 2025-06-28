import React, { useContext, useState, useEffect } from "react";
import { BsEyeFill } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa6";
import { AuthContext } from "../../../../components/control/authContext";
import { getAllAccounts } from "../../../../components/backendApis/accounts/accounts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewDetails from "./modal/viewDetails";
import CustomPagination from "../../partials/CustomPagination";

const Marketplace = () => {
  const { updateCartState, cart } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAllAccounts();
        if (response?.success && Array.isArray(response.data.data)) {
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
    updateCartState(updatedCart);
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
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gray-800 mobile:px-2 px-6 rounded-md pb-5">
      <ToastContainer className="text-sm" />

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="pc:flex mobile:gap-2 justify-between items-center">
          <div>
            <h1 className="text-2xl text-white font-medium mobile:text-[16px]">Marketplace</h1>
            <p className="text-sm text-gray-300">
              Browse a wide range of products from our verified marketplace sellers.
            </p>
          </div>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or category"
            className="px-2 pc:w-56 mobile:w-full border mobile:py-1 shadow-md border-slate-50 rounded-md bg-transparent text-white placeholder-gray-400 mobile:placeholder:text-sm"
          />
        </div>

        {loading && (
          <p className="text-white text-center">Loading products...</p>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="w-full grid pc:grid-cols-5 mobile:grid-cols-2 gap-3 mt-3">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => {
              const isAdded = cart.some((item) => item.id === product.id);
              return (
                <div
                  key={product.id}
                  className="flex flex-col justify-between shadow-lg shadow-slate-950 p-2 rounded-lg bg-gray-700"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[120px] rounded-md object-cover bg-white"
                  />
                  <div className="text-[15px] font-semibold text-white mt-2">
                    {product.name}
                  </div>
                  <div className="flex justify-between items-center mt-1">
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

                  {/* Buttons */}
                  <div className="flex justify-between items-center mt-2">
                    {/* Details Button */}
                    <button
                      className="flex gap-1 bg-orange-900 items-center rounded-sm py-1 px-2 text-[12px] text-white"
                      onClick={() => openDetailsModal(product)}
                    >
                      <BsEyeFill className="mobile:text-[20px]" />
                      <span className="hidden pc:inline">Details</span>
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex gap-1 items-center rounded-sm py-1 px-2 text-white text-[12px] ${
                        isAdded ? "bg-gray-500 cursor-not-allowed" : "bg-primary-600"
                      }`}
                      disabled={isAdded}
                    >
                      <span className="pc:hidden">
                        <FaCartPlus className="text-[18px]" />
                      </span>
                      <span className="hidden pc:inline">
                        {isAdded ? "Added" : "Add to cart"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-white text-center">No products found</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <CustomPagination
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}

        {/* View Details Modal */}
        {showModal && selectedProduct && (
          <ViewDetails product={selectedProduct} onClose={closeDetailsModal} />
        )}
      </div>
    </div>
  );
};

export default Marketplace;

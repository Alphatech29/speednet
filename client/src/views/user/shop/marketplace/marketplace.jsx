import React, { useContext, useState, useEffect } from "react";
import { BsEyeFill } from "react-icons/bs";
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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
    <div>
      <div className="bg-gray-800 px-5 rounded-md h-auto pb-5">
        <div className="flex flex-col gap-4">
          <ToastContainer className="text-sm" />

          {/* Header */}
          <div className="pc:flex mobile:gap-2 justify-between items-center">
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
                className="px-2 pc:w-56 mobile:w-full border shadow-md border-slate-50 rounded-md bg-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Loading & Error */}
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

          {/* Products Grid */}
          <div className="w-full grid pc:grid-cols-5 mobile:grid-cols-2 pc:gap-4 mobile:gap-3 mt-3">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => {
                const isAdded = cart.some((item) => item.id === product.id);
                return (
                  <div
                    key={product.id}
                    className="flex justify-between gap-4 flex-col shadow-lg shadow-slate-950 p-2 rounded-lg mobile:w-[175px] pc:w-48 bg-gray-700"
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
            <ViewDetails
              product={selectedProduct}
              onClose={closeDetailsModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

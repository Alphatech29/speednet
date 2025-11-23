import React, { useContext, useState, useEffect } from "react";
import { BsEyeFill } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa6";
import { AuthContext } from "../../../../components/control/authContext";
import { getAllAccounts } from "../../../../components/backendApis/accounts/accounts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewDetails from "./modal/viewDetails";
import CustomPagination from "../../partials/CustomPagination";
import { IoGridOutline } from "react-icons/io5";
import { PiTextColumns } from "react-icons/pi";

const Marketplace = () => {
  const { updateCartState, cart } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("column");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const itemsPerPage = 15;

  // Fixed categories
  const categories = [
    "All",
    "Social Media",
    "Email & Messaging Services",
    "VPN & Proxys",
    "Website",
    "E-Commerce Platform",
    "Gaming",
    "Account & Subscription",
    "Other",
  ];

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAllAccounts();
        if (response?.success && Array.isArray(response.data.data)) {
          const formattedProducts = response.data.data
            .filter((account) => account.status === "approved")
            .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
            .map((account) => ({
              id: account.id,
              name: account.title,
              price: account.price,
              seller: account.username,
              image: account.logo_url,
              description: account.description,
              previewLink: account.previewLink,
              avatar: account.avatar,
              category: account.category || "Uncategorized",
            }));

          setProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
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

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, products]);

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

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    if (index === 0 && newRange[0] > newRange[1]) newRange[0] = newRange[1];
    if (index === 1 && newRange[1] < newRange[0]) newRange[1] = newRange[0];
    setPriceRange(newRange);
  };

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
            <h1 className="text-2xl text-white font-medium mobile:text-[16px]">
              Marketplace
            </h1>
            <p className="text-sm text-gray-300">
              Browse a wide range of products from our verified marketplace sellers.
            </p>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name (e.g Facebook)"
            className="px-2 pc:w-56 mobile:w-full border mobile:py-1 shadow-md border-slate-50 rounded-md bg-transparent text-white placeholder-gray-400 mobile:placeholder:text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between gap-4 items-center mt-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-white text-sm">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 py-1 rounded-md bg-gray-600 text-white text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="flex gap-2 items-center text-white text-sm">
            <span>${priceRange[0]}</span>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="accent-primary-600"
            />

            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className={`px-4 py-1 text-sm rounded-md ${
              viewMode === "grid" ? "bg-primary-600" : "bg-gray-600"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <IoGridOutline className="text-white text-[20px]" />
          </button>

          <button
            className={`px-4 py-1 text-sm rounded-md ${
              viewMode === "column" ? "bg-primary-600" : "bg-gray-600"
            }`}
            onClick={() => setViewMode("column")}
          >
            <PiTextColumns className="text-white text-[20px]" />
          </button>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="w-full grid pc:grid-cols-5 mobile:grid-cols-2 tab:grid-cols-3 gap-3 mt-3">
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
                    <div className="text-[15px] font-semibold uppercase text-white mt-2 line-clamp-2">
                      {product.name}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex gap-2 items-center text-slate-200">
                        <img
                          src={product.avatar}
                          alt="Seller"
                          className="size-7 rounded-full border border-white"
                        />
                        <span className="text-sm">{product.seller}</span>
                      </div>
                      <span className="text-slate-200 text-sm font-medium">
                        ${product.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <button
                        className="flex gap-1 bg-orange-900 items-center rounded-sm py-1 px-2 text-[12px] text-white"
                        onClick={() => openDetailsModal(product)}
                      >
                        <BsEyeFill className="mobile:text-[20px]" />
                        <span className="hidden pc:inline">Details</span>
                      </button>
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
              <div className="py-24 text-gray-500 text-center">No products found</div>
            )}
          </div>
        )}

        {/* COLUMN VIEW */}
        {viewMode === "column" && (
          <div className="flex flex-col gap-3 mt-3">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => {
                const isAdded = cart.some((item) => item.id === product.id);
                return (
                  <div
                    key={product.id}
                    className="flex gap-3 bg-gray-700 p-3 rounded-md shadow-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-md object-cover bg-white"
                    />
                    <div className="flex-1">
                      <div className="font-semibold uppercase text-lg text-white">{product.name}</div>
                      <p className="text-gray-300 min-w-[65%] text-sm line-clamp-1 mt-1">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <img
                            src={product.avatar}
                            className="size-7 rounded-full border border-white"
                          />
                          <span className="text-sm">{product.seller}</span>
                        </div>
                        <span className="text-sm text-white">${product.price}</span>
                      </div>
                      <div className="flex flex-row justify-end items-end w-full gap-3 mt-3">
                        <button
                          className="bg-orange-900 text-xs px-3 py-1 rounded-sm text-white"
                          onClick={() => openDetailsModal(product)}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`text-xs px-3 py-1 rounded-sm text-white ${
                            isAdded ? "bg-gray-500 cursor-not-allowed" : "bg-primary-600"
                          }`}
                          disabled={isAdded}
                        >
                          {isAdded ? "Added" : "Add to cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-24 text-gray-500 text-center">No products found</div>
            )}
          </div>
        )}

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

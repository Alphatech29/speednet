import React, { useState, useEffect, useContext } from "react";
import { IoGridOutline, IoShareSocialOutline, IoFilter } from "react-icons/io5";
import { PiTextColumns } from "react-icons/pi";
import {
  FaEnvelope,
  FaGlobe,
  FaShopify,
  FaGamepad,
  FaUser,
} from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import { SiNordvpn } from "react-icons/si";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../../../../components/control/authContext";
import {
  getAllAccounts,
  getAllPlatformCate,
} from "../../../../components/backendApis/accounts/accounts";
import ViewDetails from "./modal/viewDetails";
import CustomPagination from "../../partials/CustomPagination";
import GridView from "./views/gridView";
import ColumnView from "./views/columnView";
import Sidebar from "../../../user/partials/sidebar";
import { getAllShortNoticesAPI } from "../../../../components/backendApis/admin/apis/shortNotice";

const accountTypes = [
  { name: "Social Media", icon: IoShareSocialOutline },
  { name: "Email & Messaging", icon: FaEnvelope },
  { name: "VPN & Proxys", icon: SiNordvpn },
  { name: "Website", icon: FaGlobe },
  { name: "E-Commerce Platform", icon: FaShopify },
  { name: "Gaming", icon: FaGamepad },
  { name: "Account & Subscription", icon: FaUser },
  { name: "Other", icon: FaGlobe },
];

const Marketplace = () => {
  const { updateCartState, cart } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("column");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [platforms, setPlatforms] = useState({});
  const [platformFilter, setPlatformFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [openCategory, setOpenCategory] = useState({});
  const [notices, setNotices] = useState([]);

  const ITEMS_PER_PAGE = 100;

  // PRIORITY LIST FOR SORTING
  const priorityOrder = ["Facebook", "Twitter-X", "Instagram", "Snapchat", "LinkedIn"];

  const sortPlatforms = (list) => {
    return [...list].sort((a, b) => {
      const aP = priorityOrder.indexOf(a.name);
      const bP = priorityOrder.indexOf(b.name);

      if (aP !== -1 && bP !== -1) return aP - bP;
      if (aP !== -1) return -1;
      if (bP !== -1) return 1;

      return a.name.localeCompare(b.name);
    });
  };

  const sortAndMixProducts = (products) => {
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllAccounts();
        if (res?.success) {
          const mixed = sortAndMixProducts(res.data?.data || [])
            .filter((x) => x.status === "approved")
            .map((acc) => ({
              id: acc.id,
              name: acc.title,
              price: Number(acc.price),
              platform: acc.platform,
              seller: acc.username,
              image: acc.logo_url,
              description: acc.description,
              avatar: acc.avatar,
              previewLink: acc.previewLink,
              created_at: acc.create_at,
              updated_at: acc.updated_at,
            }));

          setProducts(mixed);
          setFilteredProducts(mixed);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlatforms = async () => {
      try {
        const res = await getAllPlatformCate();
        if (res?.success) {
          const grouped = (res.data?.platforms || []).reduce(
            (acc, platform) => {
              const { type, name, image_path, price } = platform;
              if (!acc[type]) acc[type] = [];
              acc[type].push({ name, image_path, price });
              return acc;
            },
            {}
          );
          setPlatforms(grouped);
        }
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };

    const fetchNotices = async () => {
      try {
        const res = await getAllShortNoticesAPI();
        if (res?.success) {
          const activeNotices =
            res.data?.filter((notice) => notice.status === "active") || [];
          setNotices(activeNotices);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchProducts();
    fetchPlatforms();
    fetchNotices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilteredProducts((prev) => sortAndMixProducts(prev));
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = [...products];

    if (platformFilter) {
      result = result.filter(
        (p) => p.platform?.toLowerCase() === platformFilter.toLowerCase()
      );
    }

    const [minPrice, maxPrice] = priceRange;
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, platformFilter, priceRange, searchQuery]);

  const addToCart = (item) => {
    if (!cart.some((c) => c.id === item.id)) {
      updateCartState([...cart, item]);
      toast.success("Product added to cart");
    }
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <>
      {notices.length > 0 && (
        <div className="w-full bg-primary-600/30 text-white border-primary-600 border-l-4 mb-3 px-2 py-3 rounded-lg">
          {notices.map((notice) => (
            <p key={notice.id} className="flex justify-start items-start">
              <span className="text-primary-600 text-[25px] mr-3">
                <MdCelebration />
              </span>
              {notice.content}
            </p>
          ))}
        </div>
      )}

      <div className="flex flex-col bg-gray-800 min-h-screen">
        <ToastContainer />

        <div className="hidden pc:block">
          <Sidebar
            platforms={platforms}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        {/* ---- UPDATED MOBILE FILTER ---- */}
        {categoriesOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center pt-8 mobile:block pc:hidden">
            <div className="bg-gray-900 text-white p-4 rounded-md w-full h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold">Account Categories</h2>
                <button
                  onClick={() => setCategoriesOpen(false)}
                  className="text-white text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {accountTypes.map(({ name: typeName, icon: TypeIcon }) => (
                <div key={typeName} className="mb-2">
                  <button
                    className="flex justify-between w-full items-center py-2 px-2 bg-gray-800 rounded"
                    onClick={() =>
                      setOpenCategory((prev) => ({
                        ...prev,
                        [typeName]: !prev[typeName],
                      }))
                    }
                  >
                    <div className="flex items-center gap-2">
                      <TypeIcon className="text-[12px]" />
                      <span className="capitalize text-sm">{typeName}</span>
                    </div>
                    <span className="text-sm">
                      {openCategory[typeName] ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Updated Sorting Applied Here */}
                  {openCategory[typeName] && (
                    <div className="pl-6 mt-1 flex flex-col gap-1">
                      {sortPlatforms(platforms[typeName] || []).map(
                        (platform) => (
                          <button
                            key={platform.name}
                            className={`flex items-center gap-2 w-full py-1 text-sm ${
                              platformFilter === platform.name
                                ? "text-orange-500"
                                : "text-gray-400"
                            }`}
                            onClick={() => setPlatformFilter(platform.name)}
                          >
                            {platform.image_path && (
                              <img
                                src={platform.image_path}
                                alt={platform.name}
                                className="h-4 w-4 rounded-full object-contain"
                              />
                            )}
                            <span className="text-[17px]">{platform.name}</span>
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <h3 className="text-sm mb-1">Price Range</h3>
                <div className="flex justify-between text-sm mt-1 mb-2">
                  <span className="text-sm">${priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full accent-orange-500"
                  />
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
                <button
                  className="mt-2 w-full py-2 bg-orange-500 text-white rounded"
                  onClick={() => setCategoriesOpen(false)}
                >
                  Show Accounts
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 p-3 tab:p-6">
          <div className="flex flex-col pc:flex-row justify-between items-center gap-3 w-full">
            <div className="mobile:w-full w-full">
              <h1 className="text-2xl text-white font-semibold">
                Latest account
              </h1>
              <p className="text-sm text-gray-400">
                Browse verified product listings
              </p>
            </div>

            <div className="mobile:w-full tab:w-80 flex justify-around items-center gap-2">
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full px-3 py-1 rounded border bg-transparent text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-primary-600 text-gray-200 p-2 rounded-md mobile:flex pc:hidden"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <IoFilter className="text-[19px]" />
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-3 gap-2">
            {["grid", "column"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1 rounded-md ${
                  viewMode === mode ? "bg-primary-600" : "bg-gray-600"
                }`}
              >
                {mode === "grid" ? (
                  <IoGridOutline className="text-white text-xl" />
                ) : (
                  <PiTextColumns className="text-white text-xl" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="text-gray-400 py-20 text-center">Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-gray-500 py-20 text-center">
                No products found
              </div>
            ) : viewMode === "column" ? (
              <ColumnView
                products={paginatedProducts}
                cart={cart}
                handleAddToCart={addToCart}
                openDetailsModal={setModalProduct}
              />
            ) : (
              <GridView
                products={paginatedProducts}
                cart={cart}
                handleAddToCart={addToCart}
                openDetailsModal={setModalProduct}
              />
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <CustomPagination
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {modalProduct && (
            <ViewDetails
              product={modalProduct}
              onClose={() => setModalProduct(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Marketplace;

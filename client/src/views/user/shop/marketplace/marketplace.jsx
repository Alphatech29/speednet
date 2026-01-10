import React, { useState, useEffect, useContext } from "react";
import { IoGridOutline, IoFilter, IoShareSocialOutline } from "react-icons/io5";
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
import { getAllShortNoticesAPI } from "../../../../components/backendApis/admin/apis/shortNotice";
import {
  getDarkProducts,
  getDarkCategories,
} from "../../../../components/backendApis/admin/apis/darkshop";

import ViewDetails from "./modal/viewDetails";
import CustomPagination from "../../partials/CustomPagination";
import GridView from "./views/gridView";
import ColumnView from "./views/columnView";

// -------- PLATFORM TYPES & PRIORITY --------
const types = [
  { name: "Advanced", icon: FaGlobe },
  { name: "Social Media", icon: IoShareSocialOutline },
  { name: "Email & Messaging", icon: FaEnvelope },
  { name: "VPN & Proxys", icon: SiNordvpn },
  { name: "Website", icon: FaGlobe },
  { name: "E-Commerce Platform", icon: FaShopify },
  { name: "Gaming", icon: FaGamepad },
  { name: "Account & Subscription", icon: FaUser },
  { name: "Other", icon: FaGlobe },
];

const PRIORITY_PLATFORMS = [
  "Facebook",
  "Twitter-X",
  "Instagram",
  "Snapchat",
  "LinkedIn",
];
const ITEMS_PER_PAGE = 100;

// ---------- HELPER FUNCTIONS ----------
const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const sortPlatforms = (list) => {
  return [...list].sort((a, b) => {
    const aP = PRIORITY_PLATFORMS.indexOf(a.name);
    const bP = PRIORITY_PLATFORMS.indexOf(b.name);
    if (aP !== -1 && bP !== -1) return aP - bP;
    if (aP !== -1) return -1;
    if (bP !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
};

// ---------- MAIN COMPONENT ----------
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
  const [darkCategories, setDarkCategories] = useState([]);
  const [platformFilter, setPlatformFilter] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const [openCategory, setOpenCategory] = useState({});
  const [openDarkCategory, setOpenDarkCategory] = useState({});
  const [notices, setNotices] = useState([]);

  // ---------- FETCH PRODUCTS ----------
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [accountsRes, darkRes] = await Promise.all([
          getAllAccounts(),
          getDarkProducts(),
        ]);

        const regularProducts = accountsRes?.success
          ? (accountsRes.data?.data || [])
              .filter((x) => x.status === "approved")
              .map((acc) => ({
                id: acc.id,
                name: acc.title,
                price: Number(acc.price),
                platform: acc.platform || "Uncategorized",
                seller: acc.username,
                image: acc.logo_url,
                description: acc.description,
                avatar: acc.avatar,
                previewLink: acc.previewLink,
                created_at: acc.create_at,
                updated_at: acc.updated_at,
              }))
          : [];

        const darkProducts = darkRes?.success
          ? (darkRes.data || []).map((prod) => ({
              id: `dark-${prod.id}`,
              name: prod.name || "Unnamed Product",
              price: Number(prod.price) || 0,
              platform: prod.category_name || "Uncategorized",
              categoryId: prod.category_id,
              groupId: prod.group_id,
              seller: "Speednet",
              image: prod.miniature || "",
              description: prod.description || "",
              avatar: "",
              previewLink: "",
              created_at: prod.created_at,
              updated_at: prod.updated_at,
            }))
          : [];

        // Merge regular and dark products
        const maxLen = Math.max(regularProducts.length, darkProducts.length);
        const combinedProducts = [];
        for (let i = 0; i < maxLen; i++) {
          if (i < regularProducts.length)
            combinedProducts.push(regularProducts[i]);
          if (i < darkProducts.length) combinedProducts.push(darkProducts[i]);
        }

        setProducts(combinedProducts);
        setFilteredProducts(combinedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ---------- FETCH FILTERS ----------
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [platformRes, darkRes] = await Promise.all([
          getAllPlatformCate(),
          getDarkCategories(),
        ]);

        if (platformRes?.success) {
          const grouped = (platformRes.data?.platforms || []).reduce(
            (acc, p) => {
              const { type, name, id, image_path, price } = p;
              if (!acc[type]) acc[type] = [];
              acc[type].push({ name, id, image_path, price });
              return acc;
            },
            {}
          );
          setPlatforms(grouped);
        }

        if (darkRes?.success) setDarkCategories(darkRes.data || []);
      } catch (err) {
        console.error("Error fetching filter categories:", err);
      }
    };
    fetchFilters();
  }, []);

  // ---------- FETCH NOTICES ----------
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await getAllShortNoticesAPI();
        if (res.success) setNotices(res.data || []);
      } catch (err) {
        console.error("Error fetching short notices:", err);
      }
    };
    fetchNotices();
  }, []);

  // ---------- SHUFFLE PRODUCTS ----------
  useEffect(() => {
    const interval = setInterval(() => {
      setFilteredProducts((prev) => shuffleArray(prev));
    }, 180000); // every 3 minutes
    return () => clearInterval(interval);
  }, []);

  // ---------- FILTER PRODUCTS ----------
  useEffect(() => {
    let result = [...products];

    // Platform / category filters
    if (platformFilter) {
      if (platformFilter.groupId) {
        result = result.filter((p) => p.groupId === platformFilter.groupId);
      } else if (platformFilter.name) {
        result = result.filter(
          (p) =>
            p.platform?.toLowerCase() === platformFilter.name.toLowerCase() ||
            p.category_name?.toLowerCase() === platformFilter.name.toLowerCase()
        );
      }
    }

    // Price filter
    const [minPrice, maxPrice] = priceRange;
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, platformFilter, priceRange, searchQuery]);

  // ---------- CART ----------
  const addToCart = (item) => {
    if (cart.some((c) => c.id === item.id)) return;
    updateCartState([...cart, item]);
    toast.success("Product added to cart");
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

        {/* MOBILE CATEGORY FILTER */}
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

              {/* RENDER TYPES */}
              {types.map(({ name, icon: Icon }) => (
                <div key={name} className="mb-2">
                  <button
                    className="flex justify-between w-full items-center py-2 px-2 bg-gray-800 rounded"
                    onClick={() =>
                      setOpenCategory((prev) => ({
                        ...prev,
                        [name]: !prev[name],
                      }))
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="text-white" />
                      <span className="text-[15px]">{name}</span>
                    </div>
                    <span className="text-[15px]">
                      {openCategory[name] ? "▲" : "▼"}
                    </span>
                  </button>

                  {openCategory[name] && (
                    <div className="pl-4 mt-1 flex flex-col gap-1">
                      {name === "Advanced"
                        ? darkCategories.map((cat) => (
                            <div key={cat.id}>
                              <button
                                className="flex justify-between w-full items-center py-1 px-1 bg-gray-800 rounded"
                                onClick={() =>
                                  setOpenDarkCategory((prev) => ({
                                    ...prev,
                                    [cat.id]: !prev[cat.id],
                                  }))
                                }
                              >
                                <div className="flex items-center gap-2">
                                  {cat.icon && (
                                    <img
                                      src={cat.icon}
                                      alt={cat.name}
                                      className="h-5 w-5 rounded-full object-contain"
                                    />
                                  )}
                                  <span className="text-[15px]">
                                    {cat.name}
                                  </span>
                                </div>
                                <span className="text-[15px]">
                                  {openDarkCategory[cat.id] ? "▲" : "▼"}
                                </span>
                              </button>

                              {openDarkCategory[cat.id] &&
                                cat.groups?.length > 0 && (
                                  <div className="pl-6 mt-1 flex flex-col gap-1">
                                    {cat.groups.map((group) => (
                                      <button
                                        key={group.id}
                                        className={`flex items-center gap-2 w-full py-1 text-sm ${
                                          platformFilter?.groupId === group.id
                                            ? "text-orange-500"
                                            : "text-gray-400"
                                        }`}
                                        onClick={() =>
                                          setPlatformFilter({
                                            categoryId: cat.id,
                                            groupId: group.id,
                                            name: cat.name,
                                          })
                                        }
                                      >
                                        <span className="text-[15px]">
                                          {group.name}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))
                        : sortPlatforms(platforms[name] || []).map(
                            (platform) => (
                              <button
                                key={platform.id || platform.name}
                                className={`flex items-center gap-2 w-full py-1 text-sm ${
                                  platformFilter?.name === platform.name
                                    ? "text-orange-500"
                                    : "text-gray-400"
                                }`}
                                onClick={() =>
                                  setPlatformFilter({ name: platform.name })
                                }
                              >
                                {platform.image_path && (
                                  <img
                                    src={platform.image_path}
                                    alt={platform.name}
                                    className="h-4 w-4 rounded-full object-contain"
                                  />
                                )}
                                <span className="text-[17px]">
                                  {platform.name}
                                </span>
                              </button>
                            )
                          )}
                    </div>
                  )}
                </div>
              ))}

              {/* PRICE FILTER */}
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
                  Show Products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH & VIEW MODE */}
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

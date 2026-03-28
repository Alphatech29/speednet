import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoGridOutline } from "react-icons/io5";
import { PiTextColumns } from "react-icons/pi";
import { BiSearch, BiX } from "react-icons/bi";
import { HiChevronDown, HiAdjustments } from "react-icons/hi";
import { MdCelebration } from "react-icons/md";
import { FaGlobe, FaEnvelope, FaShopify, FaGamepad, FaUser } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { SiNordvpn } from "react-icons/si";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../../components/control/authContext";
import { getAllAccounts, getAllPlatformCate } from "../../../../components/backendApis/accounts/accounts";
import { getAllShortNoticesAPI } from "../../../../components/backendApis/admin/apis/shortNotice";
import { getDarkProducts, getDarkCategories } from "../../../../components/backendApis/admin/apis/darkshop";
import ViewDetails from "./modal/viewDetails";
import CustomPagination from "../../partials/CustomPagination";
import GridView from "./views/gridView";
import ColumnView from "./views/columnView";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const ITEMS_PER_PAGE = 100;

const types = [
  { name: "Advanced",               short: "Advanced",   icon: FaGlobe,             color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { name: "Social Media",           short: "Social",     icon: IoShareSocialOutline, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { name: "Email & Messaging",      short: "Email",      icon: FaEnvelope,           color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { name: "VPN & Proxys",           short: "VPN",        icon: SiNordvpn,            color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  { name: "Website",                short: "Website",    icon: FaGlobe,             color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" },
  { name: "E-Commerce Platform",    short: "E-Commerce", icon: FaShopify,            color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
  { name: "Gaming",                 short: "Gaming",     icon: FaGamepad,            color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" },
  { name: "Account & Subscription", short: "Accounts",   icon: FaUser,              color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" },
  { name: "Other",                  short: "Other",      icon: FaGlobe,             color: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-slate-400" },
];

function sortByNewest(arr) {
  return [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
function shuffleArray(arr) {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}
function interleaveArrays(regular = [], dark = []) {
  const result = [];
  const max = Math.max(regular.length, dark.length);
  for (let i = 0; i < max; i++) {
    if (regular[i]) result.push(regular[i]);
    if (dark[i]) result.push(dark[i]);
  }
  return result;
}
function sortPlatforms(list = []) {
  return [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

const Marketplace = () => {
  const { updateCartState, cart } = useContext(AuthContext);

  const [products, setProducts]               = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery]         = useState("");
  const [viewMode, setViewMode]               = useState("column");
  const [currentPage, setCurrentPage]         = useState(1);
  const [modalProduct, setModalProduct]       = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [platforms, setPlatforms]             = useState({});
  const [darkCategories, setDarkCategories]   = useState([]);
  const [platformFilter, setPlatformFilter]   = useState({});
  const [priceRange, setPriceRange]           = useState([0, 1000]);
  const [notices, setNotices]                 = useState([]);
  const [activeType, setActiveType]           = useState(null);
  const [openDarkCat, setOpenDarkCat]         = useState(null);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const priceRef        = useRef(null);
  const categoryRef     = useRef(null);
  const mobileSheetRef  = useRef(null);

  /* ---- fetch products ---- */
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [accountsRes, darkRes] = await Promise.all([getAllAccounts(), getDarkProducts()]);
        const regular = accountsRes?.success
          ? (accountsRes.data?.data || []).filter((x) => x.status === "approved").map((acc) => ({
              id: acc.id, name: acc.title, price: Number(acc.price),
              platform: acc.platform || "Uncategorized", seller: acc.username,
              image: acc.logo_url, description: acc.description, avatar: acc.avatar,
              instant_delivery: true, stock_quantity: acc.stock_quantity || 1,
              icon: acc.icon || "/uploads/image.png", previewLink: acc.previewLink,
              created_at: acc.create_at, updated_at: acc.updated_at,
              store: "regular", quantity: 1,
            }))
          : [];
        const dark = darkRes?.success
          ? (darkRes.data || []).map((prod) => ({
              id: `dark-${prod.id}`, name: prod.name || "Unnamed Product",
              price: Number(prod.price) || 0, platform: prod.category_name || "Uncategorized",
              categoryId: prod.category_id, groupId: prod.group_id, seller: prod.seller,
              instant_delivery: prod.instant_delivery, stock_quantity: prod.stock_quantity || 0,
              icon: prod.icon, image: prod.miniature || "", description: prod.description || "",
              avatar: prod.avatar || "", previewLink: "",
              created_at: prod.created_at, updated_at: prod.updated_at,
              store: "darkshop", quantity: 1,
            }))
          : [];
        const final = interleaveArrays(shuffleArray(sortByNewest(regular)), sortByNewest(dark));
        setProducts(final);
        setFilteredProducts(final);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  /* ---- fetch filters ---- */
  useEffect(() => {
    const run = async () => {
      try {
        const [platformRes, darkRes] = await Promise.all([getAllPlatformCate(), getDarkCategories()]);
        if (platformRes?.success) {
          const grouped = (platformRes.data?.platforms || []).reduce((acc, p) => {
            if (!acc[p.type]) acc[p.type] = [];
            acc[p.type].push(p);
            return acc;
          }, {});
          setPlatforms(grouped);
        }
        if (darkRes?.success) setDarkCategories(darkRes.data || []);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    run();
  }, []);

  /* ---- fetch notices ---- */
  useEffect(() => {
    getAllShortNoticesAPI()
      .then((res) => { if (res.success) setNotices(res.data || []); })
      .catch((err) => console.error("Error fetching notices:", err));
  }, []);

  /* ---- filter logic ---- */
  useEffect(() => {
    let result = [...products];
    if (platformFilter?.groupId) {
      result = result.filter((p) => p.groupId === platformFilter.groupId);
    } else if (platformFilter?.name) {
      result = result.filter((p) => p.platform?.toLowerCase() === platformFilter.name.toLowerCase());
    }
    const [min, max] = priceRange;
    result = result.filter((p) => p.price >= min && p.price <= max);
    if (searchQuery.trim()) {
      result = result.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, platformFilter, priceRange, searchQuery]);

  /* ---- close dropdowns on outside click ---- */
  useEffect(() => {
    const handler = (e) => {
      if (priceRef.current && !priceRef.current.contains(e.target)) setShowPriceFilter(false);
      if (
        categoryRef.current && !categoryRef.current.contains(e.target) &&
        (!mobileSheetRef.current || !mobileSheetRef.current.contains(e.target))
      ) {
        setActiveType(null);
        setOpenDarkCat(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---- cart ---- */
  const addToCart = (item) => {
    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      toast.info(item.store === "darkshop" ? "Item already in cart" : "This product can only be added once");
      return;
    }
    updateCartState([...cart, { ...item, quantity: 1 }]);
    toast.success("Added to cart");
  };

  /* ---- type tab click ---- */
  const handleTypeClick = (typeName) => {
    if (activeType === typeName) {
      // deselect
      setActiveType(null);
      setPlatformFilter({});
      setOpenDarkCat(null);
    } else {
      setActiveType(typeName);
      setPlatformFilter({});
      setOpenDarkCat(null);
    }
  };

  /* ---- sub-item click ---- */
  const handlePlatformClick = (platform) => {
    setPlatformFilter({ name: platform.name });
  };
  const handleGroupClick = (cat, group) => {
    setPlatformFilter({ categoryId: cat.id, groupId: group.id, name: cat.name });
    setOpenDarkCat(null);
  };

  /* ---- clear all ---- */
  const clearAll = () => {
    setActiveType(null);
    setPlatformFilter({});
    setOpenDarkCat(null);
    setPriceRange([0, 1000]);
    setSearchQuery("");
  };

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const hasActiveFilter = !!(platformFilter?.name || platformFilter?.groupId || priceRange[1] < 1000);

  /* sub-items to show when a type is selected */
  const subItems = activeType
    ? activeType === "Advanced"
      ? darkCategories
      : sortPlatforms(platforms[activeType] || [])
    : [];

  return (
    <div className="w-full">
      <ToastContainer position="top-right" theme="light" />

      {/* Notices */}
      {notices.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="mb-4 bg-primary-600/10 border border-primary-600/20 rounded-2xl px-5 py-3.5 flex flex-col gap-1.5">
          {notices.map((notice) => (
            <div key={notice.id} className="flex items-start gap-3">
              <MdCelebration size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary-600 font-medium">{notice.content}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* ══════════ CATEGORY TOP BAR ══════════ */}
      <div ref={categoryRef} className="relative mb-3">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.35 }}
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">

          {/* ── MOBILE: icon grid (5-col × 2 rows) ── */}
          <div className="tab:hidden grid grid-cols-5 gap-1 p-3">
            <button
              onClick={clearAll}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${
                !activeType && !hasActiveFilter
                  ? "bg-primary-600/10 dark:bg-primary-600/20 ring-2 ring-primary-600"
                  : "bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-extrabold ${
                !activeType && !hasActiveFilter
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
              }`}>✦</div>
              <span className={`text-[9px] font-bold leading-none text-center ${
                !activeType && !hasActiveFilter ? "text-primary-600" : "text-gray-400 dark:text-slate-500"
              }`}>All</span>
            </button>
            {types.map(({ name, short, icon: Icon, color }) => {
              const isActive = activeType === name;
              return (
                <button key={name} onClick={() => handleTypeClick(name)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${
                    isActive
                      ? "bg-primary-600/10 dark:bg-primary-600/20 ring-2 ring-primary-600"
                      : "bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? "bg-primary-600 text-white" : color}`}>
                    <Icon size={15} />
                  </div>
                  <span className={`text-[9px] font-bold leading-none text-center truncate w-full px-1 ${
                    isActive ? "text-primary-600" : "text-gray-500 dark:text-slate-400"
                  }`}>{short}</span>
                </button>
              );
            })}
          </div>

          {/* ── MOBILE: active filter chip ── */}
          {(platformFilter?.name || platformFilter?.groupId) && (
            <div className="tab:hidden flex items-center gap-2 px-3 pb-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Filtered:</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-600/10 text-primary-600 text-xs font-bold rounded-full border border-primary-600/20">
                {platformFilter?.groupId
                  ? darkCategories.flatMap((c) => c.groups || []).find((g) => g.id === platformFilter.groupId)?.name
                  : platformFilter?.name}
                <button
                  onClick={clearAll}
                  className="w-3.5 h-3.5 rounded-full bg-primary-600/20 flex items-center justify-center hover:bg-primary-600/40 transition-all flex-shrink-0"
                >
                  <BiX size={9} />
                </button>
              </span>
            </div>
          )}

          {/* ── TAB+: horizontal scroll pills ── */}
          <div className="relative hidden tab:block">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide px-3 py-2.5">
              <button onClick={clearAll}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  !activeType && !hasActiveFilter
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/25"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white"
                }`}
              >All</button>
              <span className="w-px h-4 bg-gray-200 dark:bg-slate-700 flex-shrink-0 mx-0.5" />
              {types.map(({ name, icon: Icon, color }) => {
                const isActive = activeType === name;
                return (
                  <button key={name} onClick={() => handleTypeClick(name)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                        : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 ${isActive ? "bg-white/20" : color}`}>
                      <Icon size={9} />
                    </span>
                    {name}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* ── TAB+: Sub-nav popup dropdown ── */}
        <AnimatePresence>
          {activeType && subItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="hidden tab:block absolute left-0 right-0 top-full mt-2 z-40 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
            >
              {/* Popup header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-white/5">
                {(() => {
                  const t = types.find((x) => x.name === activeType);
                  const TIcon = t?.icon;
                  return TIcon ? (
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${t.color}`}>
                      <TIcon size={11} />
                    </span>
                  ) : null;
                })()}
                <span className="text-xs font-extrabold text-gray-700 dark:text-slate-200">{activeType}</span>
                {platformFilter?.name && (
                  <><span className="text-gray-300 dark:text-slate-600 text-xs">›</span>
                  <span className="text-xs font-bold text-primary-600 truncate max-w-[200px]">{platformFilter.name}</span></>
                )}
                {platformFilter?.groupId && (
                  <><span className="text-gray-300 dark:text-slate-600 text-xs">›</span>
                  <span className="text-xs font-bold text-primary-600">
                    {darkCategories.flatMap((c) => c.groups || []).find((g) => g.id === platformFilter.groupId)?.name || ""}
                  </span></>
                )}
                {(platformFilter?.name || platformFilter?.groupId) && (
                  <button onClick={() => { setPlatformFilter({}); setOpenDarkCat(null); }}
                    className="ml-1 text-[10px] text-gray-400 dark:text-slate-500 hover:text-primary-600 font-bold transition-colors flex-shrink-0">
                    Clear filter
                  </button>
                )}
                <button onClick={() => { setActiveType(null); setPlatformFilter({}); setOpenDarkCat(null); }}
                  className="ml-auto w-6 h-6 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-slate-600 transition-all flex-shrink-0">
                  <BiX size={13} />
                </button>
              </div>

              {/* Popup content */}
              <div className="p-3 max-h-72 overflow-y-auto">
                {activeType === "Advanced"
                  ? (
                    <div className="flex flex-col gap-0.5">
                      {darkCategories.map((cat) => (
                        <div key={cat.id}>
                          <button
                            onClick={() => setOpenDarkCat(openDarkCat === cat.id ? null : cat.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              platformFilter?.categoryId === cat.id
                                ? "bg-primary-600/10 dark:bg-primary-600/20 text-primary-600 border border-primary-600/20"
                                : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 border border-transparent"
                            }`}
                          >
                            {cat.icon && <img src={cat.icon} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" onError={(e) => { e.target.style.display = "none"; }} />}
                            <span className="flex-1 text-left">{cat.name}</span>
                            {cat.groups?.length > 0 && (
                              <HiChevronDown size={13} className={`flex-shrink-0 transition-transform duration-200 text-gray-400 ${openDarkCat === cat.id ? "rotate-180" : ""}`} />
                            )}
                          </button>
                          <AnimatePresence>
                            {openDarkCat === cat.id && cat.groups?.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="flex flex-col gap-0.5 pl-4 pb-1.5 pt-0.5">
                                  {cat.groups.map((group) => (
                                    <button key={group.id} onClick={() => handleGroupClick(cat, group)}
                                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                        platformFilter?.groupId === group.id
                                          ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
                                          : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-primary-600"
                                      }`}
                                    >{group.name}</button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )
                  : (
                    <div className="grid grid-cols-2 pc:grid-cols-3 gap-1">
                      {sortPlatforms(platforms[activeType] || []).map((platform) => (
                        <button key={platform.id || platform.name}
                          onClick={() => handlePlatformClick(platform)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            platformFilter?.name === platform.name
                              ? "bg-primary-600/10 dark:bg-primary-600/20 text-primary-600 border border-primary-600/20"
                              : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 border border-transparent"
                          }`}
                        >
                          {platform.image_path && <img src={platform.image_path} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" onError={(e) => { e.target.style.display = "none"; }} />}
                          <span className="flex-1 text-left truncate">{platform.name}</span>
                          {platformFilter?.name === platform.name && <span className="w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE: Bottom-sheet popup ── */}
      <AnimatePresence>
        {activeType && subItems.length > 0 && (
          <div className="tab:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => { setActiveType(null); setPlatformFilter({}); setOpenDarkCat(null); }}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              ref={mobileSheetRef}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl max-h-[75vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-slate-700" />
              </div>

              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
                {(() => {
                  const t = types.find((x) => x.name === activeType);
                  const TIcon = t?.icon;
                  return TIcon ? (
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${t.color}`}>
                      <TIcon size={13} />
                    </span>
                  ) : null;
                })()}
                <span className="text-sm font-extrabold text-gray-800 dark:text-white">{activeType}</span>
                {platformFilter?.name && (
                  <><span className="text-gray-300 dark:text-slate-600 text-xs">›</span>
                  <span className="text-xs font-bold text-primary-600 truncate max-w-[140px]">{platformFilter.name}</span></>
                )}
                {platformFilter?.groupId && (
                  <><span className="text-gray-300 dark:text-slate-600 text-xs">›</span>
                  <span className="text-xs font-bold text-primary-600">
                    {darkCategories.flatMap((c) => c.groups || []).find((g) => g.id === platformFilter.groupId)?.name || ""}
                  </span></>
                )}
                {(platformFilter?.name || platformFilter?.groupId) && (
                  <button onClick={() => { setPlatformFilter({}); setOpenDarkCat(null); }}
                    className="ml-1 text-[10px] text-gray-400 dark:text-slate-500 hover:text-primary-600 font-bold transition-colors flex-shrink-0">
                    Clear
                  </button>
                )}
                <button onClick={() => { setActiveType(null); setPlatformFilter({}); setOpenDarkCat(null); }}
                  className="ml-auto w-7 h-7 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all flex-shrink-0">
                  <BiX size={15} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-3">
                {activeType === "Advanced"
                  ? (
                    <div className="flex flex-col gap-0.5">
                      {darkCategories.map((cat) => (
                        <div key={cat.id}>
                          <button onClick={() => setOpenDarkCat(openDarkCat === cat.id ? null : cat.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                              platformFilter?.categoryId === cat.id
                                ? "bg-primary-600/10 dark:bg-primary-600/20 text-primary-600 border border-primary-600/20"
                                : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-100 border border-transparent"
                            }`}
                          >
                            {cat.icon && <img src={cat.icon} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" onError={(e) => { e.target.style.display = "none"; }} />}
                            <span className="flex-1 text-left">{cat.name}</span>
                            {cat.groups?.length > 0 && (
                              <HiChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 text-gray-400 ${openDarkCat === cat.id ? "rotate-180" : ""}`} />
                            )}
                          </button>
                          <AnimatePresence>
                            {openDarkCat === cat.id && cat.groups?.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="flex flex-col gap-0.5 pl-5 pb-2 pt-0.5">
                                  {cat.groups.map((group) => (
                                    <button key={group.id} onClick={() => { handleGroupClick(cat, group); setActiveType(null); }}
                                      className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        platformFilter?.groupId === group.id
                                          ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
                                          : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-primary-600"
                                      }`}
                                    >{group.name}</button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )
                  : (
                    <div className="flex flex-col gap-0.5">
                      {sortPlatforms(platforms[activeType] || []).map((platform) => (
                        <button key={platform.id || platform.name}
                          onClick={() => { handlePlatformClick(platform); setActiveType(null); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                            platformFilter?.name === platform.name
                              ? "bg-primary-600/10 dark:bg-primary-600/20 text-primary-600 border border-primary-600/20"
                              : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-100 border border-transparent"
                          }`}
                        >
                          {platform.image_path && <img src={platform.image_path} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" onError={(e) => { e.target.style.display = "none"; }} />}
                          <span className="flex-1 text-left">{platform.name}</span>
                          {platformFilter?.name === platform.name && <span className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )
                }
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════ TOOLBAR ══════════ */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.4, delay: 0.05 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 mb-4 shadow-sm flex items-center gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <BiX size={16} />
            </button>
          )}
        </div>

        {/* Price filter */}
        <div ref={priceRef} className="relative flex-shrink-0">
          <button
            onClick={() => setShowPriceFilter((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all ${
              priceRange[1] < 1000
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300"
            }`}
          >
            <HiAdjustments size={14} />
            <span className="hidden tab:inline">Price</span>
            {priceRange[1] < 1000 && <span className="hidden tab:inline">· ${priceRange[1]}</span>}
          </button>

          <AnimatePresence>
            {showPriceFilter && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-30 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-xl p-4 w-60"
              >
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">Max Price</p>
                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  <span>$0</span>
                  <span className="text-primary-600">${priceRange[1]}</span>
                </div>
                <input
                  type="range" min="0" max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-primary-600 h-1.5 rounded-full"
                />
                {priceRange[1] < 1000 && (
                  <button
                    onClick={() => { setPriceRange([0, 1000]); setShowPriceFilter(false); }}
                    className="mt-3 w-full text-xs text-gray-500 dark:text-slate-400 hover:text-primary-600 font-semibold py-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-primary-600/5 transition-all flex items-center justify-center gap-1"
                  >
                    <BiX size={13} /> Reset
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 flex-shrink-0">
          {[{ mode: "column", Icon: PiTextColumns }, { mode: "grid", Icon: IoGridOutline }].map(({ mode, Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                viewMode === mode ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </motion.div>

      {/* ══════════ RESULTS HEADER ══════════ */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h1 className="text-base font-extrabold text-gray-900 dark:text-white">
            {activeType || (hasActiveFilter ? "Filtered Results" : "Latest Products")}
          </h1>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            {loading ? "Loading..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {(activeType || hasActiveFilter) && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-primary-600 font-semibold bg-primary-600/10 hover:bg-primary-600/20 px-3 py-1.5 rounded-xl transition-all"
          >
            <BiX size={13} /> Clear all
          </button>
        )}
      </div>

      {/* ══════════ PRODUCT LIST ══════════ */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-2 tab:grid-cols-3 pc:grid-cols-4 gap-4" : "flex flex-col gap-3"}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl animate-pulse ${viewMode === "grid" ? "p-3" : "p-4 flex items-center gap-4"}`}>
              {viewMode === "grid" ? (
                <>
                  <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-slate-700 rounded-xl mb-3" />
                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded w-1/2" />
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gray-100 dark:bg-slate-700 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/2" />
                    <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded w-1/3" />
                  </div>
                  <div className="h-8 w-20 bg-gray-100 dark:bg-slate-700 rounded-xl" />
                </>
              )}
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl py-20 flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-3xl">🛍️</div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-500 dark:text-slate-400">No products found</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
              {searchQuery ? "Try a different search term" : "Try adjusting your filters"}
            </p>
          </div>
          <button onClick={clearAll} className="text-xs text-primary-600 font-semibold bg-primary-600/10 hover:bg-primary-600/20 px-4 py-2 rounded-xl transition-all">
            Clear filters
          </button>
        </div>
      ) : viewMode === "column" ? (
        <ColumnView products={paginatedProducts} cart={cart} handleAddToCart={addToCart} openDetailsModal={setModalProduct} />
      ) : (
        <GridView products={paginatedProducts} cart={cart} handleAddToCart={addToCart} openDetailsModal={setModalProduct} />
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {modalProduct && <ViewDetails product={modalProduct} onClose={() => setModalProduct(null)} />}
    </div>
  );
};

export default Marketplace;

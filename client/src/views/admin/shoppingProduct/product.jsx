import { useEffect, useState } from "react";
import { Table, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { getDarkCategories, getDarkProducts } from "../../../components/backendApis/admin/apis/darkshop";
import Pagination from "../../admin/partials/pagination";
import { useShopping } from "../../../components/control/shoppingContext";

export default function ShoppingCategories() {
  const navigate = useNavigate();

  const {
    categories,
    setCategories,
    products,
    setProducts,
    currentSlide,
    setCurrentSlide,
    openCategoryId,
    setOpenCategoryId,
    selectedGroupId,
    setSelectedGroupId,
    currentProductPage,
    setCurrentProductPage,
    scrollY,
    setScrollY,
  } = useShopping();

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_SLIDE = 20;
  const ITEMS_PER_PAGE = 100;

  /* -------------------- Fetch Categories -------------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.length > 0) {
        setLoading(false);
        return;
      }
      try {
        const res = await getDarkCategories();
        if (!res.success) throw new Error(res.message);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.message || "Error fetching categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [categories, setCategories]);

  /* -------------------- Fetch Products -------------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length > 0) {
        setProductsLoading(false);
        return;
      }
      try {
        const res = await getDarkProducts();
        if (!res.success) throw new Error(res.message);
        setProducts(res.data);
      } catch (err) {
        setError(err.message || "Error fetching products");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [products, setProducts]);

  /* -------------------- Restore Scroll -------------------- */
  useEffect(() => {
    if (scrollY) window.scrollTo(0, scrollY);
  }, [scrollY]);

  /* -------------------- Categories Logic -------------------- */
  const totalSlides = Math.ceil(categories.length / ITEMS_PER_SLIDE);
  const activeCategory = categories.find((c) => c.id === openCategoryId);
  const visibleCategories = openCategoryId
    ? [activeCategory]
    : categories.slice(
        currentSlide * ITEMS_PER_SLIDE,
        currentSlide * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE
      );

  /* -------------------- Products Filtering + Search -------------------- */
  const filteredProducts = products
    .filter((p) => (selectedGroupId ? p.group_id === selectedGroupId : true))
    .filter((p) => {
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        String(p.id).includes(term) ||
        p.name?.toLowerCase().includes(term)
      );
    });

  const totalProductPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const visibleProducts = filteredProducts.slice(
    (currentProductPage - 1) * ITEMS_PER_PAGE,
    currentProductPage * ITEMS_PER_PAGE
  );

  /* -------------------- Navigation -------------------- */
  const handlePrev = () => setCurrentSlide(Math.max(currentSlide - 1, 0));
  const handleNext = () =>
    setCurrentSlide(Math.min(currentSlide + 1, totalSlides - 1));

  const handleEdit = (id) => {
    setScrollY(window.scrollY);
    navigate(`/admin/shopping/product/edit/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* -------------------- Categories Section -------------------- */}
      <div className="bg-white rounded-xl shadow-sm px-6 pb-6 pt-4 w-full">
        {!openCategoryId && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              All Categories
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="px-3 py-1 rounded-full border bg-gray-400 hover:bg-blue-600 disabled:opacity-40"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlide === totalSlides - 1}
                className="px-3 py-1 rounded-full border bg-gray-400 hover:bg-blue-600 disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-500 text-center">
            Loading categories...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {openCategoryId && (
          <button
            onClick={() => {
              setOpenCategoryId(null);
              setSelectedGroupId(null);
            }}
            className="mb-4 text-sm bg-blue-600 text-white px-2 py-1 rounded-lg"
          >
            ← Back to categories
          </button>
        )}

        {!loading && !error && visibleCategories.length > 0 && (
          <div
            className={
              openCategoryId
                ? "flex flex-col gap-4"
                : "grid grid-cols-10 gap-4"
            }
          >
            {visibleCategories.map(
              (category) =>
                category && (
                  <div key={category.id}>
                    <button
                      onClick={() => setOpenCategoryId(category.id)}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-3 py-3 rounded-lg hover:bg-gray-200 transition"
                    >
                      {category.icon && (
                        <img
                          src={category.icon}
                          alt={category.name || "category icon"}
                          className="w-4 h-4 object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/20";
                          }}
                        />
                      )}
                      <span className="truncate">{category.name}</span>
                    </button>

                    {openCategoryId === category.id &&
                      category.groups?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 max-w-full">
                          {category.groups.map((group) => (
                            <button
                              key={group.id}
                              onClick={() => {
                                setSelectedGroupId(group.id);
                                setCurrentProductPage(1);
                              }}
                              className={`text-xs px-3 py-1 rounded truncate whitespace-nowrap ${
                                selectedGroupId === group.id
                                  ? "bg-blue-600 text-white"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                              style={{ maxWidth: "150px" }}
                            >
                              {group.name}
                            </button>
                          ))}
                          {selectedGroupId && (
                            <button
                              onClick={() => setSelectedGroupId(null)}
                              className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-700"
                            >
                              Clear Filter
                            </button>
                          )}
                        </div>
                      )}
                  </div>
                )
            )}
          </div>
        )}
      </div>

      {/* -------------------- Products Section -------------------- */}
      <div className="bg-white rounded-xl shadow-sm px-6 pb-6 pt-4 w-full">
        {/* 🔍 Search Bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Products</h2>
          <input
            type="text"
            placeholder="Search by ID or Product Name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentProductPage(1);
            }}
            className="w-72 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {productsLoading && (
          <p className="text-sm text-gray-500 text-center">
            Loading products...
          </p>
        )}

        {!productsLoading && visibleProducts.length > 0 && (
          <>
            <Table hoverable className="bg-transparent">
              <Table.Head className="bg-transparent text-gray-600 text-sm">
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Avatar</Table.HeadCell>
                <Table.HeadCell>Product Title</Table.HeadCell>
                <Table.HeadCell>Price (RUB)</Table.HeadCell>
                <Table.HeadCell>Price (USD)</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {visibleProducts.map((product) => (
                  <Table.Row key={product.id} className="text-sm">
                    <Table.Cell>{product.id}</Table.Cell>
                    <Table.Cell>
                      {product.miniature ? (
                        <img
                          src={product.miniature}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        "N/A"
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-gray-600 flex flex-col">
                        <span className="line-clamp-2 max-w-[500px]">
                          {product.name}
                        </span>
                        <span className="text-xs">
                          Quantity: {product.quantity}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {product.price_rub
                        ? `${Number(product.price_rub).toFixed(2)} ₽`
                        : "0 ₽"}
                    </Table.Cell>
                    <Table.Cell>
                      {Number(product.price).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        onClick={() => handleEdit(product.id)}
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <Pagination
              totalPages={totalProductPages}
              initialPage={currentProductPage}
              onPageChange={setCurrentProductPage}
            />
          </>
        )}

        {!productsLoading && filteredProducts.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}

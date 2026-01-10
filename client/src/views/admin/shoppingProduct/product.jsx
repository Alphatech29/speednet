import { useEffect, useState } from "react";
import { Table, Button } from "flowbite-react";
import { NavLink } from "react-router-dom";
import {
  getDarkCategories,
  getDarkProducts,
} from "../../../components/backendApis/admin/apis/darkshop";
import Pagination from "../../admin/partials/pagination";

export default function ShoppingCategories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_SLIDE = 20;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Pagination for products
  const ITEMS_PER_PAGE = 100;
  const [currentProductPage, setCurrentProductPage] = useState(1);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await getDarkCategories();
        if (!catRes.success) throw new Error(catRes.message);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      } catch (err) {
        setError(
          err.message || "Something went wrong while fetching categories."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prodRes = await getDarkProducts();
        if (!prodRes.success) throw new Error(prodRes.message);
        setProducts(prodRes.data);
      } catch (err) {
        setError(
          err.message || "Something went wrong while fetching products."
        );
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalSlides = Math.ceil(categories.length / ITEMS_PER_SLIDE);

  const handlePrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));

  const handleEdit = (id) => {
    navigate(`/admin/shopping/product/edit/${id}`);
  };

  const activeCategory = categories.find(
    (category) => category.id === openCategoryId
  );

  const visibleCategories = openCategoryId
    ? [activeCategory]
    : categories.slice(
        currentSlide * ITEMS_PER_SLIDE,
        currentSlide * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE
      );

  // Filter products based on selected group
  const filteredProducts = selectedGroupId
    ? products.filter((product) => product.group_id === selectedGroupId)
    : products;

  const totalProductPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Slice products for current page
  const visibleProducts = filteredProducts.slice(
    (currentProductPage - 1) * ITEMS_PER_PAGE,
    currentProductPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Categories Section */}
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
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {openCategoryId && (
          <button
            onClick={() => {
              setOpenCategoryId(null);
              setSelectedGroupId(null); // reset group when going back
            }}
            className="mb-4 text-sm bg-blue-600 text-white px-2 py-1 rounded-lg"
          >
            ← Back to categories
          </button>
        )}

        {!loading && !error && visibleCategories.length > 0 && (
          <div
            className={
              openCategoryId ? "flex flex-col gap-4" : "grid grid-cols-10 gap-4"
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

                    {/* Groups */}
                    {openCategoryId === category.id &&
                      category.groups?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 max-w-full">
                          {category.groups.map((group) => (
                            <button
                              key={group.id}
                              onClick={() => {
                                setSelectedGroupId(group.id);
                                setCurrentProductPage(1); // reset page
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

      {/* Products Section */}
      <div className="bg-white rounded-xl shadow-sm px-6 pb-6 pt-4 w-full">
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
                          alt={product.name || "Product Image"}
                          className="h-10 w-10 rounded-full bg-white object-cover"
                        />
                      ) : (
                        "N/A"
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-gray-600 flex flex-col items-start justify-start">
                        <span className="line-clamp-2 max-w-[500px]">
                          {product.name}
                        </span>
                        <span className="text-xs">
                          Quantity: {product.quantity}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {product.price_rub !== undefined
                        ? Number(product.price_rub)
                            .toFixed(2)
                            .replace(",", ".") + " ₽"
                        : "0 ₽"}
                    </Table.Cell>

                    <Table.Cell>
                      {Number(product.price).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Table.Cell>
                    <Table.Cell className="flex gap-1">
                      <NavLink
                        to={`/admin/shopping/product/edit/${product.id}`}
                      >
                        <Button
                          size="sm"
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Edit
                        </Button>
                      </NavLink>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {/* Product Pagination */}
            <Pagination
              totalPages={totalProductPages}
              initialPage={1}
              onPageChange={setCurrentProductPage}
            />
          </>
        )}

        {!productsLoading && filteredProducts.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Table, Button } from "flowbite-react";
import { getDarkCategories, getDarkProducts } from "../../../components/backendApis/admin/apis/darkshop";

export default function ShoppingCategories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [productError, setProductError] = useState(null);

  const ITEMS_PER_SLIDE = 20;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const catRes = await getDarkCategories();
        console.log("Categories Response:", catRes);
        if (!catRes.success) throw new Error(catRes.message);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      } catch (err) {
        setCategoryError(err.message || "Failed to fetch categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const prodRes = await getDarkProducts();
        console.log("Products Response:", prodRes);
        if (!prodRes.success) throw new Error(prodRes.message);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      } catch (err) {
        setProductError(err.message || "Failed to fetch products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const totalSlides = Math.ceil(categories.length / ITEMS_PER_SLIDE);
  const handlePrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  const toggleCategory = (id) => setOpenCategoryId((prev) => (prev === id ? null : id));

  const activeCategory = categories.find((category) => category.id === openCategoryId);
  const visibleCategories = openCategoryId
    ? [activeCategory]
    : categories.slice(currentSlide * ITEMS_PER_SLIDE, currentSlide * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE);

  return (
    <div className="bg-white rounded-xl shadow-sm px-6 pb-6 pt-4">
      {/* Categories Section */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">All Categories</h2>

      {loadingCategories && <p className="text-sm text-gray-500 text-center">Loading categories...</p>}
      {!loadingCategories && categoryError && <p className="text-sm text-red-500 text-center">{categoryError}</p>}

      {!loadingCategories && !categoryError && visibleCategories.length > 0 && (
        <div className={openCategoryId ? "flex flex-col gap-4 mb-6" : "grid grid-cols-10 gap-4 mb-6"}>
          {visibleCategories.map((category) => (
            category && (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-3 py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  {category.icon && (
                    <img
                      src={category.icon || "https://via.placeholder.com/20"}
                      alt={category.name}
                      className="w-4 h-4 object-contain"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/20"; }}
                    />
                  )}
                  <span className="truncate">{category.name}</span>
                </button>

                {openCategoryId === category.id && category.groups?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {category.groups.map((group) => (
                      <span
                        key={group.id}
                        className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded"
                      >
                        {group.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {!loadingCategories && !categoryError && categories.length === 0 && (
        <p className="text-sm text-gray-500 text-center mb-6">No categories available.</p>
      )}

      {/* Products Section */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">All Products</h2>

      {loadingProducts && <p className="text-sm text-gray-500 text-center">Loading products...</p>}
      {!loadingProducts && productError && <p className="text-sm text-red-500 text-center">{productError}</p>}

      {!loadingProducts && !productError && products.length > 0 && (
        <Table hoverable className="bg-transparent">
          <Table.Head className="bg-transparent text-gray-600 text-sm">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {products.map((product) => (
              <Table.Row key={product.id} className="text-sm">
                <Table.Cell>{product.id}</Table.Cell>
                <Table.Cell>
                  <img
                    src={product.miniature || "https://via.placeholder.com/50"}
                    alt={product.name || "Unnamed Product"}
                    className="w-12 h-12 object-cover rounded"
                  />
                </Table.Cell>
                <Table.Cell className="max-w-xs truncate">{product.name || "Unnamed Product"}</Table.Cell>
                <Table.Cell>{product.price || "0"}</Table.Cell>
                <Table.Cell>
                  {product.url ? (
                    <Button size="sm" className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700" onClick={() => window.open(product.url, "_blank")}>
                      View
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">No URL</span>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {!loadingProducts && !productError && products.length === 0 && (
        <p className="text-sm text-gray-500 text-center">No products available.</p>
      )}
    </div>
  );
}

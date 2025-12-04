import React, { useEffect, useState } from 'react';
import { Table, Button } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllProducts,bulkUpdateProductStatus } from '../../../../components/backendApis/admin/apis/products';
import { formatDateTime } from '../../../../components/utils/formatTimeDate';
import { NavLink } from 'react-router-dom';

const UnderReviewingTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track selected products
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

 const handleApproveSelected = async () => {
  if (selectedProducts.length === 0) {
    toast.warning("No product selected");
    return;
  }

  try {
    const payload = selectedProducts.map((id) => ({
      id,
      status: "approved",
    }));

    const res = await bulkUpdateProductStatus(payload);

    if (res?.success) {
      toast.success("Selected products approved successfully");

      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p.id))
      );

      setSelectedProducts([]);
    } else {
      toast.error(
        res?.message || "Failed to approve selected products"
      );
      console.error("Bulk approval error:", res?.error);
    }
  } catch (error) {
    toast.error("An error occurred during bulk approval");
    console.error("Bulk approval exception:", error);
  }
};


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();

        if (res?.success && Array.isArray(res.data)) {
          const filtered = res.data.filter(
            (product) => product.status?.toLowerCase() === 'under reviewing'
          );

          const sorted = filtered.sort(
            (a, b) => new Date(b.create_at) - new Date(a.create_at)
          );

          setProducts(sorted);
        } else {
          toast.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 space-y-8">

        {/* Batch Approve Button (HIDDEN if none selected) */}
        {selectedProducts.length > 0 && (
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleApproveSelected}
              className="bg-primary-600 py-1 text-white hover:bg-primary-700"
            >
              Approve Selected
            </Button>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <Table hoverable className="bg-transparent">
            <Table.Head className="bg-transparent text-gray-600 text-sm">

              {/* Select All */}
              <Table.HeadCell>
                <div className="relative z-20 pointer-events-auto">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === products.length &&
                      products.length > 0
                    }
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                </div>
              </Table.HeadCell>

              <Table.HeadCell>S/N</Table.HeadCell>
              <Table.HeadCell>Avatar</Table.HeadCell>
              <Table.HeadCell>Product Details</Table.HeadCell>
              <Table.HeadCell>Merchant</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Submitted</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <Table.Row key={product.id} className="text-sm">

                    {/* Single Row Checkbox */}
                    <Table.Cell>
                      <div className="relative z-20 pointer-events-auto">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelect(product.id)}
                          className="cursor-pointer"
                        />
                      </div>
                    </Table.Cell>

                    <Table.Cell>{index + 1}</Table.Cell>

                    <Table.Cell>
                      <img
                        src={product.logo_url}
                        alt={product.title || 'Product'}
                        className="h-10 w-10 rounded-full bg-white object-cover"
                      />
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-medium">{product.platform}</span>
                        <span className="text-gray-600 text-xs">{product.title}</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-medium">{product.user_username}</span>
                        <span className="text-gray-600 text-xs">{product.user_email}</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      {Number(product.price).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </Table.Cell>

                    <Table.Cell>
                      <span className="text-xs text-gray-700">
                        {formatDateTime(product.create_at)}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <span className="px-2 py-1 rounded-full text-white text-xs bg-yellow-400">
                        {product.status}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <NavLink to={`/admin/products/${product.id}`}>
                        <Button
                          size="sm"
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          View
                        </Button>
                      </NavLink>
                    </Table.Cell>

                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={9} className="py-24 text-gray-500 text-center">
                    No products found.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </div>
    </>
  );
};

export default UnderReviewingTab;

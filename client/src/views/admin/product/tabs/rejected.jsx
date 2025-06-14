import React, { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllProducts } from '../../../../components/backendApis/admin/apis/products';
import { formatDateTime } from '../../../../components/utils/formatTimeDate';

const RejectedTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();

        if (res?.success && Array.isArray(res.data)) {
   
          const filtered = res.data.filter(
            (product) => product.status?.toLowerCase() === 'rejected'
          );
          setProducts(filtered);
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
      <ToastContainer />
      <div className="p-4 space-y-8">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <Table hoverable className="bg-transparent">
            <Table.Head className="bg-transparent text-gray-600 text-sm">
              <Table.HeadCell>S/N</Table.HeadCell>
              <Table.HeadCell>Avatar</Table.HeadCell>
              <Table.HeadCell>Product Details</Table.HeadCell>
              <Table.HeadCell>Merchant</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <Table.Row key={product.id} className="text-sm">
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>
                      <img
                        src={product.logo_url}
                        alt={product.title}
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
                        <span className="text-[16px] font-medium">{product.username}</span>
                        <span className="text-gray-600 text-xs">{product.phone_number}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>${Number(product.price).toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      <span className="px-2 py-1 rounded-full text-white text-xs bg-yellow-400">
                        {product.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-xs text-gray-600">
                        {product.updated_at ? formatDateTime(product.updated_at) : 'N/A'}
                      </span>
                    </Table.Cell>
                   
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={8} className="text-center py-4">
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

export default RejectedTab;

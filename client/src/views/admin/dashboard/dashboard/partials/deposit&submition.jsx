import React, { useEffect, useState } from 'react';
import { Table, Spinner } from 'flowbite-react';
import { getAllProducts, getAllOrders } from '../../../../../components/backendApis/admin/apis/products';
import { formatDateTime } from '../../../../../components/utils/formatTimeDate';

// Helper function outside component
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-600';
    case 'completed':
      return 'bg-green-600';
    case 'under reviewing':
      return 'bg-yellow-500';
    case 'rejected':
      return 'bg-red-600';
    case 'sold':
      return 'bg-blue-600';
    default:
      return 'bg-gray-400';
  }
};

const RecentSubmition = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const result = await getAllProducts();
        if (result.success && Array.isArray(result.data)) {
          const sortedAndLimited = result.data
            .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
            .slice(0, 15);
          setProducts(sortedAndLimited);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const result = await getAllOrders();
        if (result.success && Array.isArray(result.data)) {
          const sortedAndLimited = result.data
            .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
            .slice(0, 15);
          setOrders(sortedAndLimited);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="pc:flex gap-4 justify-between items-start mt-3">
      {/* Recent Products Added */}
      <div className="recent-products relative flex flex-col rounded-md bg-white w-full h-[500px] overflow-auto">
        <div className="text-start text-[15px] font-bold text-zinc-600 mb-1 sticky top-0 bg-white z-10 py-2 px-3">
          Recent Products Added by Merchant
        </div>

        <div className="px-[5px] py-4">
          {loadingProducts ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable className="bg-transparent">
              <Table.Head className="bg-transparent text-gray-600 mobile:text-[13px]">
                <Table.HeadCell>S/N</Table.HeadCell>
                <Table.HeadCell>Platform</Table.HeadCell>
                <Table.HeadCell>User Name</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Status/Time</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <Table.Row key={product.id || index}>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">{index + 1}</Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">
                        <div className="flex justify-start items-start flex-col">
                          <h1 className="text-[13px] text-gray-500">{product.platform || '-'}</h1>
                          <p className="text-[16px] font-medium">{product.title || '-'}</p>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">{product.username || '-'}</Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">
                        ${Number(product.price || 0).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">
                        <div className="flex justify-start items-start flex-col">
                          <span
                            className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(product.status || '')}`}
                          >
                            {product.status || 'N/A'}
                          </span>
                          {formatDateTime(product.create_at)}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-4">
                      No products found.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>

      {/* Recent Products Purchase */}
      <div className="recent-purchase relative flex flex-col rounded-md bg-white w-full h-[500px] overflow-auto">
        <div className="text-start text-[15px] font-bold text-zinc-600 mb-1 sticky top-0 bg-white z-10 py-2 px-3">
          Recent Products Purchase
        </div>

        <div className="px-[5px] py-4">
          {loadingOrders ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable className="bg-transparent">
              <Table.Head className="bg-transparent text-gray-600 mobile:text-[13px]">
                <Table.HeadCell>Order ID</Table.HeadCell>
                <Table.HeadCell>Platform</Table.HeadCell>
                <Table.HeadCell>User</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Status/Time</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <Table.Row key={order.id || index}>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">{order.order_no || index + 1}</Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">
                        <div className="flex justify-start items-start flex-col">
                          <h1 className="text-[13px] text-gray-500">{order.platform || '-'}</h1>
                          <p className="text-[16px] font-medium">{order.title || '-'}</p>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">{order.buyer_name || '-'}</Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">
                        ${Number(order.price || 0).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">
                        <div className="flex justify-start items-start flex-col">
                          <span
                            className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(order.payment_status || '')}`}
                          >
                            {order.payment_status || 'N/A'}
                          </span>
                          {formatDateTime(order.create_at)}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-4">
                      No orders found.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentSubmition;

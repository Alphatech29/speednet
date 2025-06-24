import React, { useEffect, useState, useContext } from "react";
import { FaFile } from "react-icons/fa";
import { Table, Button } from "flowbite-react";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { getAccountsByUserUid } from "../../../components/backendApis/accounts/accounts";
import { AuthContext } from "../../../components/control/authContext";
import CustomPagination from "../../user/partials/sidebar";
import ProductDetails from "./modal/productDetails";

const Myproduct = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const itemsPerPage = 15;

  useEffect(() => {
    if (user?.uid) {
      getAccountsByUserUid(user.uid)
        .then((result) => {
          if (result.success) {
            const sorted = result.data.sort(
              (a, b) => new Date(b.create_at) - new Date(a.create_at)
            );
            setAccounts(sorted);
          } else {
            console.error("Failed to retrieve accounts:", result.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching accounts:", error);
        });
    }
  }, [user]);

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getStatusClass = (status) => {
    switch (status) {
      case "under reviewing":
        return "bg-yellow-500 text-white";
      case "approved":
        return "bg-green-500 text-white";
      case "sold":
        return "bg-blue-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const paginatedAccounts = accounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <span className="text-lg font-medium text-gray-300">My Product</span>
      </div>

      {/* Product Table */}
      <div className="bg-slate-700 flex flex-col w-full border border-gray-400 rounded-lg px-3 py-4 overflow-auto">
        <Table hoverable={true} className="bg-transparent">
          <Table.Head className="text-gray-200 font-semibold">
            <Table.HeadCell>S/N</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Platform</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Details</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {paginatedAccounts.length > 0 ? (
              paginatedAccounts.map((account, index) => (
                <Table.Row key={account.id} className="text-gray-400">
                  <Table.Cell>{(currentPage - 1) * itemsPerPage + index + 1}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={account.logo_url}
                      alt={account.platform}
                      className="w-10 h-10 object-fill border rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{account.platform}</Table.Cell>
                  <Table.Cell>{account.title}</Table.Cell>
                  <Table.Cell>
                    {webSettings?.currency}
                    {account.price}
                  </Table.Cell>
                  <Table.Cell>
                    <div
                      className={`inline-block py-1 px-3 rounded-full text-sm ${getStatusClass(
                        account.status
                      )}`}
                    >
                      {capitalizeFirstLetter(account.status)}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{formatDateTime(account.create_at)}</Table.Cell>
                  <Table.Cell>
                    <Button
                      className="bg-primary-600 text-sm border-0 text-gray-200 rounded-md cursor-pointer"
                      onClick={() => setSelectedAccount(account)}
                    >
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="8" className="text-center text-gray-500">
                  No products available
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2 mt-4 text-gray-300">
            <FaFile className="text-4xl" />
            <p>No Product Record</p>
          </div>
        )}

        {/* Pagination */}
        {accounts.length > itemsPerPage && (
          <CustomPagination
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Product Details Modal */}
     {selectedAccount && (
  <ProductDetails
    account={selectedAccount} 
    onClose={() => setSelectedAccount(null)}
  />
)}

    </div>
  );
};

export default Myproduct;

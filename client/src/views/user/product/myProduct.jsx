import React, { useEffect, useState, useContext } from "react";
import { FaFile } from "react-icons/fa";
import { Table } from "flowbite-react";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { getAccountsByUserUid } from "../../../components/backendApis/accounts/accounts";
import { AuthContext } from "../../../components/control/authContext";

const Myproduct = () => {
  // Access user and webSettings from AuthContext
  const { user, webSettings } = useContext(AuthContext);
  const [userUid, setUserUid] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Ensure user.uid is available and store it in userUid
    if (user?.uid) {
      setUserUid(user.uid);
    }
  }, [user]);

  useEffect(() => {
    // Fetch accounts if userUid is available
    const fetchAccounts = async () => {
      if (!userUid) return;

      try {
        const result = await getAccountsByUserUid(userUid);
        if (result.success) {
          setAccounts(result.data);
        } else {
          console.error("Failed to retrieve accounts:", result.message);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [userUid]);

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Helper function to determine the status class
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

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div>
        <span className="text-lg font-medium text-gray-300">My Product</span>
      </div>

      {/* Product List Section */}
      <div className="bg-slate-700 flex flex-col w-full border border-gray-400 rounded-lg px-3 py-4 overflow-auto">
        {/* Table for listing products */}
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
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <Table.Row key={account.id} className="text-gray-400">
                  <Table.Cell>{index + 1}</Table.Cell>
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
                    <span className="bg-primary-600 px-2 py-1 text-sm border-0 text-gray-200 rounded-md cursor-pointer">
                      View
                    </span>
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

        {/* No Product Record Placeholder */}
        {accounts.length === 0 && (
          <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2 mt-4 text-gray-300">
            <FaFile className="text-4xl" />
            <p>No Product Record</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Myproduct;

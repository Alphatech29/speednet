import React, { useEffect, useState } from "react";
import { Table, Spinner, Button } from "flowbite-react";
import { getAllUsers } from "../../../components/backendApis/admin/apis/users";
import { NavLink } from "react-router-dom";
import Pagination from "../partials/pagination";

const MerchantPage = () => {
  const [merchants, setMerchants] = useState([]);
  const [filteredMerchants, setFilteredMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 50;

  // Fetch and filter only merchants
  const fetchMerchants = async () => {
    try {
      const res = await getAllUsers();

      if (res?.success && Array.isArray(res.data)) {
        const onlyMerchants = res.data.filter(
          (user) => user.role?.toLowerCase() === "merchant"
        );

        setMerchants(onlyMerchants);
        setFilteredMerchants(onlyMerchants);
      } else {
        setMerchants([]);
        setFilteredMerchants([]);
      }
    } catch (error) {
      console.error("Error fetching merchants:", error);
      setMerchants([]);
      setFilteredMerchants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  // Search & Status Filter
  useEffect(() => {
    let filtered = [...merchants];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (merchant) =>
          merchant.username?.toLowerCase().includes(term) ||
          merchant.email?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter(
        (merchant) => String(merchant.status) === statusFilter
      );
    }

    setFilteredMerchants(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, merchants]);

  // Pagination
  const indexOfLastMerchant = currentPage * itemsPerPage;
  const indexOfFirstMerchant = indexOfLastMerchant - itemsPerPage;
  const currentMerchants = filteredMerchants.slice(
    indexOfFirstMerchant,
    indexOfLastMerchant
  );
  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="title text-[18px] font-semibold text-zinc-700">
          Merchant Management
        </h1>
      </div>

      <div className="bg-white flex flex-col w-full border rounded-lg px-3 py-4">
        {/* Search & Filter */}
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <input
            className="rounded-md border px-2 py-1 pc:w-[300px]"
            type="search"
            placeholder="Search by Username or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="rounded-md border px-2 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Merchants</option>
            <option value="1">Active Merchants</option>
            <option value="0">Suspended Merchants</option>
          </select>
        </div>

        {/* Table */}
        <div className="pc:w-full min-h-[400px] flex flex-col gap-2 mt-4 text-gray-800 mobile:overflow-auto">
          {loading ? (
            <div className="w-full flex justify-center items-center py-10">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table hoverable className="bg-transparent">
                <Table.Head className="bg-transparent text-gray-600 mobile:text-[13px]">
                  <Table.HeadCell>S/N</Table.HeadCell>
                  <Table.HeadCell>Avatar</Table.HeadCell>
                  <Table.HeadCell>Full Name</Table.HeadCell>
                  <Table.HeadCell>Role</Table.HeadCell>
                  <Table.HeadCell>Country</Table.HeadCell>
                  <Table.HeadCell>Balance</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {currentMerchants.length > 0 ? (
                    currentMerchants.map((merchant, index) => (
                      <Table.Row
                        key={merchant.uid}
                        className="cursor-pointer"
                      >
                        <Table.Cell>
                          {indexOfFirstMerchant + index + 1}
                        </Table.Cell>

                        <Table.Cell>
                          <img
                            src={merchant.avatar}
                            alt="avatar"
                            className="h-10 w-10 rounded-full bg-white object-fill"
                          />
                        </Table.Cell>

                        <Table.Cell>{merchant.full_name}</Table.Cell>
                        <Table.Cell>{merchant.role}</Table.Cell>
                        <Table.Cell>{merchant.country}</Table.Cell>

                        <Table.Cell>
                          $
                          {Number(
                            merchant.account_balance
                          ).toLocaleString()}
                        </Table.Cell>

                        <Table.Cell>
                          <span
                            className={`px-2 py-1 rounded-full text-white text-xs ${
                              merchant.status === 1
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {merchant.status === 1
                              ? "Active"
                              : "Suspended"}
                          </span>
                        </Table.Cell>

                        <Table.Cell>
                          <NavLink
                            to={`/admin/vendor/edit/${merchant.uid}`}
                          >
                            <Button size="sm" className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">View</Button>
                          </NavLink>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={8} className="text-center py-4">
                        No merchants found.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    totalPages={totalPages}
                    initialPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantPage;

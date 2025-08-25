import React, { useEffect, useState } from "react";
import { Table, Spinner, Button } from "flowbite-react";
import { getAllUsers } from "../../../../components/backendApis/admin/apis/users";
import { NavLink } from "react-router-dom";
import Pagination from "../../partials/pagination";

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 50;

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res?.success && Array.isArray(res.data)) {
        setUsers(res.data);
        setFilteredUsers(res.data);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter(
        (user) => String(user.status) === statusFilter
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset page on filter/search
  }, [searchTerm, statusFilter, users]);

  // Pagination calculations
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="title text-[18px] font-semibold text-zinc-700">
          User's Management
        </h1>
      </div>

      <div className="bg-white flex flex-col w-full border rounded-lg px-3 py-4">
        {/* Search and Filter */}
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
            <option value="">All Users</option>
            <option value="1">Active Users</option>
            <option value="0">Suspended Users</option>
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
                  <Table.HeadCell>Full name</Table.HeadCell>
                  <Table.HeadCell>Role</Table.HeadCell>
                  <Table.HeadCell>Country</Table.HeadCell>
                  <Table.HeadCell>Balance</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <Table.Row key={user.uid}>
                        <Table.Cell className="mobile:text-[12px] pc:text-sm">
                          {indexOfFirstUser + index + 1}
                        </Table.Cell>
                        <Table.Cell className="mobile:text-[12px] pc:text-sm">
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="h-10 w-10 rounded-full bg-white object-fill"
                          />
                        </Table.Cell>
                        <Table.Cell className="mobile:text-[12px] pc:text-sm">
                          {user.full_name}
                        </Table.Cell>
                        <Table.Cell className="mobile:text-[12px] pc:text-sm">
                          {user.role}
                        </Table.Cell>
                        <Table.Cell className="mobile:text-[12px] pc:text-sm">
                          {user.country}
                        </Table.Cell>
                        <Table.Cell className="mobile:text-[12px] pc:text-sm">
                          ${Number(user.account_balance).toLocaleString()}
                        </Table.Cell>
                        <Table.Cell className="mobile:text-[12px] pc:text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-white text-xs ${
                              user.status === 1 ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {user.status === 1 ? "Active" : "Suspended"}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="mobile:text-[12px] pc:text-sm">
                          <div className="flex gap-2">
                            <NavLink to={`/admin/users/${user.uid}`}>
                              <Button
                                size="sm"
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                              >
                                View
                              </Button>
                            </NavLink>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={8} className="text-center py-4">
                        No users found.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>

              {/* Pagination - Only show if more than one page exists */}
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

export default User;
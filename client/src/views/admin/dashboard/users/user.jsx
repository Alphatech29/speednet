import React, { useEffect, useState } from "react";
import { Table, Spinner } from "flowbite-react";
import { getAllUsers } from "../../../../components/backendApis/admin/apis/users";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res?.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="title text-[18px] font-semibold text-zinc-700">
          User's Management
        </h1>
      </div>

      <div className="bg-white flex flex-col w-full border rounded-lg px-3 py-4">
        <div className="pc:w-full min-h-[400px] flex flex-col gap-2 mt-4 text-gray-800 mobile:overflow-auto">
          {loading ? (
            <div className="w-full flex justify-center items-center py-10">
              <Spinner size="lg" />
            </div>
          ) : (
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
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <Table.Row key={user.uid}>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">
                        {index + 1}
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
                        <span className="px-2 py-1 rounded-full text-white text-xs bg-green-500">
                          {user.status}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="mobile:text-[12px] pc:text-sm">
                        <div className="flex gap-2">
                          <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                            View
                          </button>
                          <button className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600">
                            Edit
                          </button>
                          <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                            Delete
                          </button>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default User;

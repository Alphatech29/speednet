import React, { useEffect, useState } from 'react';
import { Table, Button } from 'flowbite-react';
import { getAllNotices } from '../../../components/backendApis/admin/apis/notice'; 
import { formatDateTime } from '../../../components/utils/formatTimeDate';
import { NavLink } from 'react-router-dom';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const response = await getAllNotices();
      if (response.success) {
        setNotices(response.data);
      } else {
        console.error('Failed to fetch notices');
      }
    } catch (error) {
      console.error('Error fetching notices', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className='flex justify-between items-center mb-4'>
        <h2 className="text-xl font-semibold">Notice Board</h2>
        <NavLink to="/admin/announcement/create">
          <Button size="sm" className="bg-primary-600 text-white py-2">
            Create
          </Button>
        </NavLink>
      </div>

      <Table hoverable className="bg-transparent z-0">
        <Table.Head className="bg-transparent text-gray-600 text-sm">
          <Table.HeadCell>S/N</Table.HeadCell>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Role</Table.HeadCell>
          <Table.HeadCell>Message</Table.HeadCell>
          <Table.HeadCell>Time</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center py-4">
                Loading notices...
              </Table.Cell>
            </Table.Row>
          ) : notices.length > 0 ? (
            notices.map((notice, index) => (
              <Table.Row key={notice?.id || index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell className="font-medium">{notice.title}</Table.Cell>
                <Table.Cell className="capitalize">{notice.role}</Table.Cell>
                <Table.Cell className="max-w-xs truncate">{notice.message}</Table.Cell>
                <Table.Cell>{formatDateTime(notice.created_at)}</Table.Cell>
                <Table.Cell>
                  <NavLink to="/admin/announcement/edit" state={notice}>
                    <Button
                      size="sm"
                      className="py-1 bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      Edit
                    </Button>
                  </NavLink>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={6} className="py-24 text-gray-500 text-center">
                No notices available.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Notice;

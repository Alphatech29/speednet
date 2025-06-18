import React, { useEffect, useState } from 'react';
import { getAllPlatforms } from '../../../components/backendApis/admin/apis/platform';
import { Table } from 'flowbite-react';

const Platform = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatforms = async () => {
      const response = await getAllPlatforms();
      if (response.success) {
        setPlatforms(response.data);
      } else {
        console.error("Error fetching platforms:", response.message);
      }
      setLoading(false);
    };

    fetchPlatforms();
  }, []);

  return (
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <h2 className="text-xl font-semibold mb-4">List of Platforms</h2>
      <div>
        <div className='w-full flex items-center justify-between mb-4'>
          <button className='bg-primary-600 px-2 py-1 rounded-md text-white'>Add Platform</button> <input type="text" placeholder='Search' className='text-gray-700 px-3 py-1  rounded-md'/>
        </div>
      </div>
      <Table hoverable className="bg-transparent">
        <Table.Head className="bg-transparent text-gray-600 text-sm">
          <Table.HeadCell>S/N</Table.HeadCell>
          <Table.HeadCell>Avatar</Table.HeadCell>
          <Table.HeadCell>Platform Name</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-4">
                Loading platforms...
              </Table.Cell>
            </Table.Row>
          ) : platforms.length > 0 ? (
            platforms.map((platform, index) => (
              <Table.Row key={platform.id} className="text-sm">
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>
                  <img
                    src={platform.image_path}
                    alt={platform.name}
                    className="h-10 w-10 rounded-full bg-white object-cover"
                  />
                </Table.Cell>
                <Table.Cell className="font-medium">{platform.name}</Table.Cell>
                <Table.Cell>
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
              <Table.Cell colSpan={4} className="text-center py-4">
                No platforms found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>

  );
};

export default Platform;

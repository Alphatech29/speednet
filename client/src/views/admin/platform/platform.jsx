import React, { useEffect, useState } from 'react';
import { getAllPlatforms, deletePlatformById } from '../../../components/backendApis/admin/apis/platform';
import { Table, Modal, Button } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import Add from './modal/add';

const Platform = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPlatforms = async () => {
    try {
      const response = await getAllPlatforms();
      if (response.success) {
        setPlatforms(response.data);
      } else {
        toast.error('Error fetching platforms');
      }
    } catch (error) {
      toast.error('Unexpected error occurred while fetching platforms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      const response = await deletePlatformById(id);
      if (response.success) {
        setPlatforms((prev) => prev.filter((p) => p.id !== id));
        toast.success(`"${name}" has been deleted successfully`);
      } else {
        toast.error(`Failed to delete "${name}": ${response.message}`);
      }
    } catch (error) {
      toast.error(`Error deleting "${name}"`);
    }
  };

  const filteredPlatforms = platforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-semibold mb-4">List of Platforms</h2>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary-600 px-4 py-2 rounded-md text-white"
        >
          Add Platform
        </button>
        <input
          type="text"
          placeholder="Search platform"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-700 px-3 py-2 rounded-md border border-gray-300"
        />
      </div>

      <Table hoverable className="bg-transparent z-0">
        <Table.Head className="bg-transparent text-gray-600 text-sm">
          <Table.HeadCell>S/N</Table.HeadCell>
          <Table.HeadCell>Avatar</Table.HeadCell>
          <Table.HeadCell>Platform Name</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-4">
                Loading platforms...
              </Table.Cell>
            </Table.Row>
          ) : filteredPlatforms.length > 0 ? (
            filteredPlatforms.map((platform, index) => (
              <Table.Row key={platform.id}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>
                  <img
                    src={platform.image_path}
                    alt={platform.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </Table.Cell>
                <Table.Cell className="font-medium">{platform.name}</Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    color="failure"
                    onClick={() => handleDelete(platform.id, platform.name)}
                  >
                    Delete
                  </Button>
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

      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Add Platform</Modal.Header>
        <Modal.Body>
          <Add
            onClose={() => {
              setModalOpen(false);
              fetchPlatforms(); // Refresh list after adding
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Platform;

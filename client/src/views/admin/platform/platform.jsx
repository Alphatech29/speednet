import React, { useEffect, useState } from 'react';
import { getAllPlatforms, deletePlatformById } from '../../../components/backendApis/admin/apis/platform';
import { Table, Modal, Button } from 'flowbite-react';
import Swal from 'sweetalert2';
import Add from './modal/add';
import Edit from './modal/edit';

const Platform = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch platforms from backend
  const fetchPlatforms = async () => {
    try {
      const response = await getAllPlatforms();
      if (response.success) {
        setPlatforms(response.data);
      } else {
        console.error('Error fetching platforms:', response.message);
      }
    } catch (error) {
      console.error('Unexpected error while fetching platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  // Delete platform with confirmation
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Delete "${name}"?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePlatformById(id);
        if (response.success) {
          setPlatforms((prev) => prev.filter((p) => p.id !== id));
          Swal.fire('Deleted!', `"${name}" has been deleted.`, 'success');
        } else {
          Swal.fire('Error', response.message || `Failed to delete "${name}"`, 'error');
        }
      } catch (error) {
        Swal.fire('Error', `Error deleting "${name}"`, 'error');
      }
    }
  };

  const handleEdit = (platform) => {
    setEditingPlatform(platform);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPlatform(null);
    setModalOpen(true);
  };

  const filteredPlatforms = platforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">List of Platforms</h2>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleAdd}
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
           <Table.HeadCell>Platform categories</Table.HeadCell>
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
                 <Table.Cell className="font-medium"> {platform.type || "N/A"}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-gray-200 text-gray-700 py-2"
                    onClick={() => handleEdit(platform)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="py-2"
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
              <Table.Cell colSpan={4} className="py-24 text-gray-500 text-center">
                No platforms found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {/* Modal for Add / Edit */}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header className="px-8 pt-6">
          {editingPlatform ? 'Edit Platform' : 'Add New Platform'}
        </Modal.Header>
        <Modal.Body>
          {editingPlatform ? (
            <Edit
              existingData={editingPlatform}
              onClose={() => {
                setModalOpen(false);
                fetchPlatforms();
              }}
            />
          ) : (
            <Add
              onClose={() => {
                setModalOpen(false);
                fetchPlatforms();
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Platform;

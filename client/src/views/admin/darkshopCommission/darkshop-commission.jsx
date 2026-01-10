import React, { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'flowbite-react';
import Swal from 'sweetalert2';
import { getCategoryCommissionsAPI } from '../../../components/backendApis/admin/apis/darkshop';
import AddCommission from './modal/add';
import EditCommission from './modal/edit';

const CategoryCommission = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch commissions
  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const response = await getCategoryCommissionsAPI();
      if (response.success) {
        setCommissions(response.data);
      } else {
        console.error('Error fetching commissions:', response.message);
      }
    } catch (error) {
      console.error('Unexpected error while fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  // Delete commission with confirmation
  const handleDelete = async (id, categoryName) => {
    const result = await Swal.fire({
      title: `Delete commission for "${categoryName}"?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        // For now, we just remove locally; implement API delete if exists
        setCommissions((prev) => prev.filter((c) => c.category_id !== id));
        Swal.fire('Deleted!', `Commission for "${categoryName}" has been deleted.`, 'success');
      } catch (error) {
        Swal.fire('Error', `Failed to delete commission for "${categoryName}"`, 'error');
      }
    }
  };

  const handleEdit = (commission) => {
    setEditingCommission(commission);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCommission(null);
    setModalOpen(true);
  };

  const filteredCommissions = commissions.filter((c) =>
    c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Category Commissions</h2>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleAdd}
          className="bg-primary-600 px-4 py-2 rounded-md text-white"
        >
          Add Commission
        </button>
        <input
          type="text"
          placeholder="Search category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-700 px-3 py-2 rounded-md border border-gray-300"
        />
      </div>

      <Table hoverable className="bg-transparent z-0">
        <Table.Head className="bg-transparent text-gray-600 text-sm">
          <Table.HeadCell>S/N</Table.HeadCell>
          <Table.HeadCell>Category Name</Table.HeadCell>
          <Table.HeadCell>Commission Rate</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-4">
                Loading commissions...
              </Table.Cell>
            </Table.Row>
          ) : filteredCommissions.length > 0 ? (
            filteredCommissions.map((commission, index) => (
              <Table.Row key={commission.category_id}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell className="font-medium">{commission.category_name}</Table.Cell>
                <Table.Cell className="font-medium">{commission.commission}%</Table.Cell>
                <Table.Cell className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-gray-200 text-gray-700 py-2"
                    onClick={() => handleEdit(commission)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="py-2"
                    color="failure"
                    onClick={() => handleDelete(commission.category_id, commission.category_name)}
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={4} className="py-24 text-gray-500 text-center">
                No commissions found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {/* Modal for Add / Edit */}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header className="px-8 pt-6">
          {editingCommission ? 'Edit Commission' : 'Add New Commission'}
        </Modal.Header>
        <Modal.Body>
          {editingCommission ? (
            <EditCommission
              existingData={editingCommission}
              onClose={() => {
                setModalOpen(false);
                fetchCommissions();
              }}
            />
          ) : (
            <AddCommission
              onClose={() => {
                setModalOpen(false);
                fetchCommissions();
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryCommission;

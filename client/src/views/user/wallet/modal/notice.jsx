import React, { useEffect, useState, useContext } from 'react';
import { getAllNotices } from '../../../../components/backendApis/admin/apis/notice';
import { Button, Modal } from 'flowbite-react';
import { AuthContext } from '../../../../components/control/authContext';

const Notice = () => {
  const { user } = useContext(AuthContext);
  const userRole = user?.role?.toLowerCase();

  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await getAllNotices();
        if (response.success && Array.isArray(response.data)) {
          const filtered = response.data.filter(
            (notice) => notice.role?.toLowerCase() === userRole
          );
          if (filtered.length > 0) {
            setNotices(filtered);
            setShowModal(true);
          }
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    if (userRole) {
      fetchNotices();
    }
  }, [userRole]);

  const closeModal = () => {
    setShowModal(false);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentIndex < notices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      closeModal();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentNotice = notices[currentIndex];

  return (
    <>
      {currentNotice && (
        <Modal
          show={showModal}
          onClose={closeModal}
          popup
          className="w-full  rounded-md"
        >
          <Modal.Header className="bg-gray-700 flex items-start gap-1 mobile:px-4 mobile:pt-4 mobile:pb-2">
            <div>
              <h2 className="text-base tab:text-lg font-semibold text-white">
              {currentNotice.title}
            </h2>
            <p className="text-xs text-gray-400">
              Posted on: {formatDate(currentNotice.created_at)}
            </p>
            </div>
          </Modal.Header>

          <Modal.Body className="bg-gray-700 text-white mobile:px-4 mobile:py-4 max-h-[70vh] overflow-y-auto">
            <p className="text-sm tab:text-base whitespace-pre-line text-gray-300">
              {currentNotice.message}
            </p>
          </Modal.Body>

          <Modal.Footer className="justify-end bg-gray-700 mobile:px-4 mobile:pb-4 flex mobile:flex gap-2">
            <Button
              size="sm"
              color="failure"
              onClick={closeModal}
              className=" tab:w-auto"
            >
              Close
            </Button>
            <Button
              size="sm"
              color="blue"
              onClick={handleNext}
              className=" tab:w-auto"
            >
              {currentIndex < notices.length - 1 ? 'Next Notice' : 'Done'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Notice;

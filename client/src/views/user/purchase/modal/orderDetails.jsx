import { Modal, Button } from "flowbite-react";
import { formatDateTime } from "../../../../components/utils/formatTimeDate";

const OrderDetails = ({ order, onClose }) => {
  const show = !!order;

  return (
    <Modal show={show} onClose={onClose} popup size="lg">
      <Modal.Header className="bg-gray-800">
        <h2 className="text-lg font-semibold text-white">
          {order?.title || "N/A"} Details
        </h2>
      </Modal.Header>

      <Modal.Body className="bg-gray-800 text-white overflow-y-auto max-h-[80vh] px-4 pc:px-6 pb-4">
        {/* Order Info */}
        <div className="flex flex-col gap-2 text-sm tab:flex-row tab:justify-between">
          <p className="font-medium">
            Order No: {order?.order_no || "N/A"} / Account ID: {order?.id || "N/A"}
          </p>
          <p className="text-gray-400">
            Date/Time: {order?.create_at ? formatDateTime(order.create_at) : "N/A"}
          </p>
        </div>

        {/* Login Details */}
        <div className="mt-4 shadow-md shadow-gray-600 rounded-md px-3 py-2">
          <p className="text-[15px] font-medium pb-2">Login Details:</p>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Email: {order?.email || "N/A"}</p>
            <p>Username: {order?.username || "N/A"}</p>
            <p>Password: {order?.password || "N/A"}</p>
          </div>
        </div>

        {/* Recovery Details */}
        <div className="mt-4 shadow-md shadow-gray-600 rounded-md px-3 py-2">
          <p className="text-[15px] font-medium pb-2">Recovery Details:</p>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Email/Username/Phone: {order?.recovery_info || "N/A"}</p>
            <p>Password: {order?.recovery_password || "N/A"}</p>
          </div>
        </div>



        {/* Account Description */}
        <div className="mt-4 shadow-md shadow-gray-600 rounded-md px-3 py-2">
          <p className="text-[15px] font-medium pb-2">Account Description:</p>
          <div className="text-sm text-gray-400">
            <p>{order?.description || "No description available"}</p>
          </div>
        </div>

         {/* 2FA Details */}
        <div className="mt-4 shadow-md shadow-gray-600 rounded-md px-3 py-2">
          <p className="text-[15px] font-medium pb-2">2AF Description:</p>
          <div className="text-sm text-gray-400">
            <p>{order?.factor_description || "No description available"}</p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="justify-end bg-gray-800 px-4 pb-4">
        <Button  size="sm" color="failure" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetails;

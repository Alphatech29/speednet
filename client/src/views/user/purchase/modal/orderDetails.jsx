import { Modal, Button } from "flowbite-react";
import { formatDateTime } from "../../../../components/utils/formatTimeDate";

const OrderDetails = ({ order, onClose }) => {
  const show = !!order;
  return (
    <Modal show={show} onClose={onClose}  popup>
      <Modal.Header className="bg-gray-800">
        <h2 className="text-lg font-semibold text-white">
          {order?.title || "N/A"} Details
        </h2>
      </Modal.Header>

      <Modal.Body className="bg-gray-800 text-white overflow-y-auto pc:px-6 pb-4">
        <div className="pc:text-[16px] mobile:text-[14px] flex justify-between items-center">
          <p>
            Order No: {order?.order_no || "N/A"} / Account ID: {order?.id || "N/A"}
          </p>
          <p>Date/Time: {order?.create_at ? formatDateTime(order.create_at) : "N/A"}</p>
        </div>

        <div className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
          <p className="text-[16px] pb-2 font-medium">Login Details:</p>
          <div className="text-[13px] text-gray-500">
            <p>Email: {order?.email || "N/A"}</p>
            <p>Username: {order?.username || "N/A"}</p>
            <p>Password: {order?.password || "N/A"}</p>
          </div>
        </div>

        <div className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
          <p className="text-[16px] pb-2 font-medium">Recovery Details:</p>
          <div className="text-[13px] text-gray-500">
            <p>Email: {order?.recovery_email || "N/A"}</p>
            <p>Password: {order?.recovery_email_password || "N/A"}</p>
          </div>
        </div>

        <div className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
          <p className="text-[16px] pb-2 font-medium">Additional Details:</p>
          <div className="text-[13px] text-gray-500">
            <p>Email: {order?.additional_email || "N/A"}</p>
            <p>Password: {order?.additional_password || "N/A"}</p>
          </div>
        </div>

        <div className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
          <p className="text-[16px] pb-2 font-medium">Account Description:</p>
          <div className="text-[13px] text-gray-500">
            <p>{order?.description || "No description available"}</p>
          </div>
        </div>

        {order?.two_factor_enabled !== undefined && (
          <div className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
            <p className="text-[16px] pb-2 font-medium">2FA Details:</p>
            <div className="text-[13px] text-gray-500">
              <p>
                2FA:{" "}
                <span
                  className={`px-2 rounded text-white ${
                    order.two_factor_enabled ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {order.two_factor_enabled ? "Enabled" : "Disabled"}
                </span>
              </p>
              {order.two_factor_enabled === 1 && (
                <p className="mt-3">
                  {order?.two_factor_description || "No additional info"}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="justify-end bg-gray-800">
        <Button color="failure" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetails;

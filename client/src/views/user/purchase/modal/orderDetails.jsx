import { formatDateTime } from "../../../../components/utils/formatTimeDate";

const OrderDetails = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center mobile:px-3 bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-gray-800 px-6 pb-4 rounded-lg text-white pc:w-[50%] overflow-auto">
        <h2 className="text-lg font-semibold border-b py-3 mb-4">
          {order?.title || "N/A"} Details
        </h2>
        
        <div className="pc:text-[16px] mobile:text-[14px] flex justify-between items-center">
          <p>Order No: {order?.order_no || "N/A"} / Account ID: {order?.id || "N/A"}</p>
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
                <p className="mt-3">{order?.two_factor_description || "No additional info"}</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            className="bg-red-600 px-4 py-2 rounded-md text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

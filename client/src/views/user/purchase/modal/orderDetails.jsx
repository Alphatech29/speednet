import { Modal, Button } from "flowbite-react";
import { formatDateTime } from "../../../../components/utils/formatTimeDate";

const OrderDetails = ({ order, onClose }) => {
  const show = !!order;

  const formatText = (text) =>
    (text || "No description available")
      .split(/\n+/)
      .map((p) => `<p style="margin-bottom: 1rem;">${p}</p>`)
      .join("");

  if (!order) return null;

  const handleDownload = () => {
    if (!order.darkshop_content) return;

    // Generate TXT from darkshop_content
    const blob = new Blob([order.darkshop_content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${order.order_no || "darkshop_order"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL to free memory
    URL.revokeObjectURL(url);
  };

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

        {/* Dark Shop Order */}
        {order.isDarkshop && order.darkshop_content && (
          <div className="mt-4 shadow-md shadow-gray-600 rounded-md px-3 py-2">
            <p className="text-[15px] font-medium pb-2">Product Info:</p>
            <div className="text-sm text-gray-400 space-y-2">
              <Button
                size="sm"
                color="light"
                className="text-white bg-primary-600 hover:bg-primary-600/75 border-0 rounded-md py-1"
                onClick={handleDownload}
              >
                Download TXT
              </Button>

              <div className="mt-2">
                <p className="font-medium">Content Preview:</p>
                <p
                  className="break-all text-gray-300"
                  dangerouslySetInnerHTML={{ __html: formatText(order.darkshop_content) }}
                ></p>
              </div>
            </div>
          </div>
        )}

        {/* Normal Orders */}
        {!order.isDarkshop && (
          <>
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
              <div
                className="text-sm text-gray-400"
                dangerouslySetInnerHTML={{ __html: formatText(order?.description) }}
              />
            </div>

            {/* 2FA Description */}
            <div className="mt-4 shadow-md shadow-gray-600 rounded-md px-3 py-2">
              <p className="text-[15px] font-medium pb-2">2FA Description:</p>
              <div
                className="text-sm text-gray-400"
                dangerouslySetInnerHTML={{ __html: formatText(order?.factor_description) }}
              />
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="justify-end bg-gray-800 px-4 pb-4">
        <Button size="sm" color="failure" className="py-1 px-2" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetails;

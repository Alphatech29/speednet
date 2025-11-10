import { Modal, Button } from "flowbite-react";
import { formatDateTime } from "../../../../components/utils/formatTimeDate";

const ProductDetails = ({ account = null, onClose }) => {
  const show = !!account;

  // Helper function to format text with paragraphs
  const formatText = (text) =>
    (text || "No description available")
      .split(/\n+/) // split by one or more line breaks
      .map((p) => `<p style="margin-bottom: 1rem;">${p}</p>`)
      .join("");

  return (
    <Modal show={show} onClose={onClose} popup>
      <Modal.Header className="bg-gray-800">
        <h2 className="text-lg font-semibold text-white">
          {account?.title || "N/A"} Details
        </h2>
      </Modal.Header>

      <Modal.Body className="bg-gray-800 text-white overflow-y-auto max-h-[70vh]">
        <div className="pc:text-[16px] mobile:text-[14px] flex justify-between items-center flex-wrap gap-y-1">
          <p>Account ID: {account?.id || "N/A"}</p>
          <p>{account?.create_at ? formatDateTime(account.create_at) : "N/A"}</p>
        </div>

        {[
          {
            title: "Login Details",
            details: [
              { label: "Email", value: account?.email },
              { label: "Username", value: account?.username },
              { label: "Password", value: account?.password },
            ],
          },
          {
            title: "Recovery Details",
            details: [
              { label: "Email", value: account?.recovery_email },
              { label: "Password", value: account?.recoveryEmailpassword },
            ],
          },
          {
            title: "Additional Details",
            details: [
              { label: "Email", value: account?.additionalEmail },
              { label: "Password", value: account?.additionalPassword },
            ],
          },
        ].map((section, idx) => (
          <div key={idx} className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
            <p className="text-[16px] pb-2 font-medium">{section.title}:</p>
            <div className="text-[13px] text-gray-500 space-y-1">
              {section.details.map((item, i) => (
                <p key={i}>
                  {item.label}: {item.value || "N/A"}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* Account Description */}
        <div className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
          <p className="text-[16px] pb-2 font-medium">Account Description:</p>
          <div
            className="text-[13px] text-gray-500"
            dangerouslySetInnerHTML={{ __html: formatText(account?.description) }}
          />
        </div>

        {/* Subscription Details */}
        {account?.subscription_status !== undefined && (
          <div className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
            <p className="text-[16px] pb-2 font-medium">Subscription Details:</p>
            <div className="text-[13px] text-gray-500">
              <p>
                Subscription:{" "}
                <span
                  className={`px-2 rounded text-white ${
                    account.subscription_status === "active"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {account.subscription_status === "active" ? "Active" : "Expired"}
                </span>
              </p>
              {account.subscription_status === "expired" && (
                <p className="mt-3">Expiry Date: {account?.expiry_date || "N/A"}</p>
              )}
            </div>
          </div>
        )}

        {/* Two-Factor Authentication */}
        {account?.two_factor_enabled !== undefined && (
          <div className="mt-3 shadow-md shadow-gray-500 rounded-md px-3 py-2">
            <p className="text-[16px] pb-2 font-medium">2FA Details:</p>
            <div className="text-[13px] text-gray-500">
              <p>
                2FA:{" "}
                <span
                  className={`px-2 rounded text-white ${
                    account.two_factor_enabled ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {account.two_factor_enabled ? "Enabled" : "Disabled"}
                </span>
              </p>

              {account.two_factor_enabled && account?.two_factor_description && (
                <div
                  className="mt-3 text-[13px] text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: formatText(account.two_factor_description),
                  }}
                />
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

export default ProductDetails;

import React, { useContext, useState } from "react";
import { Modal, Button, Spinner } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { activateAccount } from "../../../../components/backendApis/activation/merchant";
import { AuthContext } from "../../../../components/control/authContext";

const Activate = ({ onClose }) => {
  const { user, webSettings } = useContext(AuthContext);
  const userUid = user?.uid;
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!userUid) {
      toast.error("User authentication failed.");
      return;
    }
    setLoading(true);

    try {
      const response = await activateAccount(userUid);

      if (response.success) {
        toast.success(response.message);
        setTimeout(() => {
          window.location.href = "/user/dashboard"
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal
        show={true}
        onClose={onClose}
        popup
      >
        <Modal.Header className="bg-gray-800">
          <h3 className="text-lg font-medium text-gray-200">
            Become a Merchant
          </h3>
        </Modal.Header>

        <Modal.Body className="bg-gray-800">
          <div className="space-y-4 text-gray-100">
            <p className="text-sm text-gray-400">
              A one-time payment is required to activate your merchant account. This ensures secure
              transactions, exclusive access, and seamless selling on our platform. Join now and start earning instantly!
            </p>
            <p className="text-xs text-gray-300">
              <strong>Note:</strong> A one-time activation fee of {webSettings?.currency}
              {webSettings?.merchant_activation_fee } will be deducted from your wallet.
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-gray-800">
          <div className="flex justify-end gap-3 w-full">
            <Button
              size="sm"
              className="bg-gray-300 border-0 py-2 text-gray-800"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
            size="sm"
              className="bg-primary-600 border-0 py-2"
              onClick={handleContinue}
              isProcessing={loading}
            >
              {loading ? (
                <Spinner size="sm" light />
              ) : (
                `Pay ${webSettings?.currency || '$'}${webSettings?.merchant_activation_fee || '0.00'}`
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Activate;

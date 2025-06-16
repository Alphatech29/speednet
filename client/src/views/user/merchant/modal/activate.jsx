import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { activateAccount } from "../../../../components/backendApis/activation/merchant";
import { AuthContext } from "../../../../components/control/authContext";
import { useNavigate } from "react-router-dom";

const Activate = ({ onClose }) => {
  const { user, webSettings } = useContext(AuthContext);
  const userUid = user?.uid;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

        // Delay navigation to allow toast to show
        setTimeout(() => {
          window.location.href = "/user/dashboard"; 
        }, 2000);
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
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <ToastContainer />
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[500px] flex flex-col gap-4 text-center text-gray-200">
        <div className="w-full flex flex-col items-start justify-start mb-4">
          <h2 className="text-xl font-semibold">Become a Merchant</h2>
          <p className="text-sm text-start mt-3">
            A one-time payment is required to activate your merchant account. This ensures secure
            transactions, exclusive access, and seamless selling on our platform. Join now and
            start earning instantly!
          </p>
          <p className="text-gray-300 text-[14px] mt-5 w-full text-start">
            <strong>Note:</strong> A one-time activation fee of {webSettings?.currency}
            {webSettings?.merchant_activation_fee} will be deducted from your wallet.
          </p>
        </div>

        <div className="flex w-full justify-end gap-4 mt-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              `Pay ${webSettings?.currency}${webSettings?.merchant_activation_fee}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Activate;

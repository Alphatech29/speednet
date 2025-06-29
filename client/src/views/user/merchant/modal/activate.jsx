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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <ToastContainer />
      <div className="bg-gray-800 rounded-lg shadow-lg text-gray-200 mobile:w-[90%] tab:w-[500px] p-5 tab:p-6 flex flex-col gap-4">
        <div className="flex flex-col items-start w-full gap-2">
          <h2 className="text-lg tab:text-xl font-semibold">Become a Merchant</h2>
          <p className="text-sm tab:text-base text-left">
            A one-time payment is required to activate your merchant account. This ensures secure
            transactions, exclusive access, and seamless selling on our platform. Join now and start earning instantly!
          </p>
          <p className="text-gray-300 text-[13px] tab:text-[14px] mt-3 text-left w-full">
            <strong>Note:</strong> A one-time activation fee of {webSettings?.currency}
            {webSettings?.merchant_activation_fee} will be deducted from your wallet.
          </p>
        </div>

        <div className="flex justify-end w-full gap-3 mt-4">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center"
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

import React, { useState, useContext } from 'react';
import { BsBank2 } from "react-icons/bs";
import { RiBtcFill } from "react-icons/ri";
import { SiStarlingbank } from "react-icons/si";
import { BiSolidMobileVibration } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../../../../components/control/authContext';
import { payWithCryptomus } from "../../../../components/backendApis/cryptomus/cryptomus";

const Deposit = ({ onClose }) => {
  const { user, webSettings } = useContext(AuthContext);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOnlinePopup, setShowOnlinePopup] = useState(false);

  const handleContinue = async () => {
    if (!amount || !selected) {
      toast.error("Please enter an amount and select a payment method.");
      return;
    }

    // If Online Transfer, show popup instead
    if (selected === "online") {
      setShowOnlinePopup(true);
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    if (!user?.uid) {
      toast.error("User authentication failed. Please login again.");
      return;
    }

    let currency = 'USDT';
    if (selected === 'fapshi' || selected === 'bank' || selected === 'online') {
      currency = 'USD';
    }

    const payload = {
      user_id: String(user.uid),
      email: String(user.email),
      amount: numericAmount.toFixed(2),
      paymentMethod: selected,
      currency,
    };

    setLoading(true);

    try {
      const response = await payWithCryptomus(payload);

      if (response.success && response.data?.payment_url) {
        toast.success(response.message || "Redirecting...");
        window.location.href = response.data.payment_url;
      } else {
        toast.error(response.message || "Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment processing.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate Naira equivalent
  const nairaAmount = amount && !isNaN(parseFloat(amount))
    ? (parseFloat(amount) * (webSettings?.naira_rate || 0)).toFixed(2)
    : "0.00";

  return (
    <div className="fixed inset-0 flex justify-center items-center px-4 bg-black bg-opacity-50 z-50">
      <ToastContainer />
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-[500px] flex flex-col gap-5 text-gray-200">
        
        {/* Header */}
        <div className="text-start">
          <h2 className="text-xl font-semibold mobile:text-lg">Automated Deposit</h2>
          <p className="text-sm text-gray-400 mobile:text-xs mt-1">
            You can fund your wallet through several channels. Crypto deposits are supported.
          </p>
        </div>

        {/* Amount Input */}
        <div className="flex items-center border border-gray-400 rounded-md focus-within:border-primary-600">
          <span className="text-gray-300 px-4 text-lg">$</span>
          <input
            type="number"
            step="0.01"
            disabled={loading}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent px-2 py-2 text-gray-300 focus:outline-none"
          />
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col gap-3">

          {/* MOMO */}
          <div
            className={`flex items-start gap-3 border p-3 rounded-lg cursor-pointer transition
              ${selected === 'fapshi' ? 'border-primary-600 bg-primary-600/20' : 'border-gray-400'}`}
            onClick={() => setSelected('fapshi')}
          >
            <span className={`border p-3 rounded-full ${selected === 'fapshi' ? 'border-primary-600' : 'border-primary-600/50'}`}>
              <BiSolidMobileVibration className="text-[22px]" />
            </span>
            <div className="text-start">
              <h1 className="font-semibold text-[15px]">MOMO Deposit (Cameroon)</h1>
              <p className="text-sm text-slate-400 mobile:text-xs">Use Mobile Money to fund your wallet.</p>
            </div>
          </div>

          {/* Crypto */}
          <div
            className={`flex items-start gap-3 border p-3 rounded-lg cursor-pointer transition
              ${selected === 'cryptomus' ? 'border-primary-600 bg-primary-600/20' : 'border-gray-400'}`}
            onClick={() => setSelected('cryptomus')}
          >
            <span className={`border p-3 rounded-full ${selected === 'cryptomus' ? 'border-primary-600' : 'border-primary-600/50'}`}>
              <RiBtcFill className="text-[22px]" />
            </span>
            <div className="text-start">
              <h1 className="font-semibold text-[15px]">Crypto Deposit (International)</h1>
              <p className="text-sm text-slate-400 mobile:text-xs">Fund wallet with USDT securely.</p>
            </div>
          </div>

          {/* Online Transfer */}
          <div
            className={`flex items-start gap-3 border p-3 rounded-lg cursor-pointer transition
              ${selected === 'online' ? 'border-primary-600 bg-primary-600/20' : 'border-gray-400'}`}
            onClick={() => setSelected('online')}
          >
            <span className={`border p-3 rounded-full ${selected === 'online' ? 'border-primary-600' : 'border-primary-600/50'}`}>
              <SiStarlingbank className="text-[22px]" />
            </span>
            <div className="text-start">
              <h1 className="font-semibold text-[15px]">Bank Transfer (Nigerian)</h1>
              <p className="text-sm text-slate-400 mobile:text-xs">Fund wallet using bank transfer options.</p>
            </div>
          </div>

          {/* Bank/Card */}
          <div
            className={`flex items-start gap-3 border p-3 rounded-lg cursor-pointer transition
              ${selected === 'bank' ? 'border-primary-600 bg-primary-600/20' : 'border-gray-400'}`}
            onClick={() => setSelected('bank')}
          >
            <span className={`border p-3 rounded-full ${selected === 'bank' ? 'border-primary-600' : 'border-primary-600/50'}`}>
              <BsBank2 className="text-[22px]" />
            </span>
            <div className="text-start">
              <h1 className="font-semibold text-[15px]">Bank / Card Payment (Coming Soon)</h1>
              <p className="text-sm text-slate-400 mobile:text-xs">Deposit via online transfer or card.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>

{/* Online Transfer Popup */}
{showOnlinePopup && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-[400px] text-gray-200">
      <h2 className="text-xl font-semibold mb-3">Online Transfer Instructions</h2>
      <p className="text-sm text-gray-400 mb-2">
        To deposit via online transfer, please use your banking app to transfer the desired amount:
      </p>
      <p className="text-base font-semibold mb-4">Amount in Naira: ₦{nairaAmount}</p>
      <ul className="text-gray-200 text-b mb-4">
        <li>Bank: Jaiz Bank</li>
        <li>Account Name: GABRIEL EJEH ITODO</li>
        <li>Account Number: 0020538891</li>
        <li>SWIFT Code: JAIZNGLA</li>
      </ul>

      {/* Note Section */}
      <p className="text-sm text-red-400 mb-4">
        <strong>Important:</strong> When making the transfer, please include your 
        <span className="text-yellow-400 font-semibold"> Speednet username or email </span> 
        in the remark/description of your payment. This helps us confirm your transaction faster.
      </p>

      <p className="text-sm text-yellow-400 mb-4">
        Once you complete the payment,{" "}
        <a
          href="https://t.me/bobcarly888" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-primary-600"
        >
          click here
        </a>{" "}
        to submit your receipt for confirmation. Your account will be credited immediately once your payment is confirmed.
      </p>

      <button
        className="bg-primary-600 text-white px-4 py-2 rounded-md"
        onClick={() => setShowOnlinePopup(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Deposit;

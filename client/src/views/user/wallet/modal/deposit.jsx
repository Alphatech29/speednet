import React, { useState, useContext } from 'react';
import { BsBank2 } from "react-icons/bs";
import { RiBtcFill } from "react-icons/ri";
import { BiSolidMobileVibration } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../../../../components/control/authContext';
import { payWithCryptomus } from "../../../../components/backendApis/cryptomus/cryptomus";

const Deposit = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!amount || !selected) {
      toast.error("Please enter an amount and select a payment method.");
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
    if (selected === 'fapshi' || selected === 'bank') {
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

  return (
    <div className="fixed inset-0 flex justify-center items-center px-4 bg-black bg-opacity-50 z-50">
      <ToastContainer />
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-[500px] flex flex-col gap-5 text-gray-200">
        {/* Header */}
        <div className="text-start">
          <h2 className="text-xl font-semibold mobile:text-lg">Automated Deposit</h2>
          <p className="text-sm text-gray-400 mobile:text-xs mt-1">
            You can fund your wallet through two channels. Crypto deposits are supported.
          </p>
        </div>

        {/* Amount Input */}
        <div className="flex items-center border border-gray-400 rounded-md focus-within:border-primary-600">
          <span className="text-gray-300 px-4 text-lg">$</span>
          <input
            type="number"
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
        </div>

         {/* Bank */}
          <div
            className={`flex items-start gap-3 border p-3 rounded-lg cursor-pointer transition
              ${selected === 'bank' ? 'border-primary-600 bg-primary-600/20' : 'border-gray-400'}`}
            onClick={() => setSelected('bank')}
          >
            <span className={`border p-3 rounded-full ${selected === 'bank' ? 'border-primary-600' : 'border-primary-600/50'}`}>
              <BsBank2 className="text-[22px]" />
            </span>
            <div className="text-start">
              <h1 className="font-semibold text-[15px]">Bank / Card Payment</h1>
              <p className="text-sm text-slate-400 mobile:text-xs">Deposit via bank transfer or card.</p>
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
    </div>
  );
};

export default Deposit;

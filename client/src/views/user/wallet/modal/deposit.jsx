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
      toast.error("Please enter an amount and select a payment method.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Amount must be greater than 0.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!user?.uid) {
      toast.error("User authentication failed. Please login again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    let currency = 'USDT';  // Default currency for crypto
    if (selected === 'fapshi' || selected === 'bank') {
      currency = 'USD';  // Change to USD for bank/card or mobile money
    }

    const payload = {
      user_id: String(user.uid),
      email: String(user.email),
      amount: numericAmount.toFixed(2),  // Ensure two decimal precision
      paymentMethod: selected,
      currency: currency,
    };

    setLoading(true);

    try {
      const response = await payWithCryptomus(payload);
      console.log("Backend Response:", response);

      if (response.success && response.data?.payment_url) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 2000,
        });

        // Redirect in the same tab
        window.location.href = response.data.payment_url;
      } else {
        toast.error(response.message || "Failed to initiate payment.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment processing.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <ToastContainer />
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[500px] flex flex-col gap-4 text-center text-gray-200">
        <div className="w-full flex flex-col items-start justify-start mb-4">
          <h2 className="text-xl font-semibold">Automated Deposit</h2>
          <p className="text-sm text-start">
            You can fund your wallet through two channels. Crypto deposits are supported.
          </p>
        </div>

        <div className="w-full flex justify-center items-center rounded-md border border-gray-400 focus-within:border-primary-600">
          <span className='text-[20px] text-gray-300 pl-4'>$</span>
          <input 
            type="number"
            disabled={loading}
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="0.0" 
            className="w-full bg-transparent px-3 py-2 text-gray-300 border-none focus:outline-none"
          />
        </div>

        <div className='flex gap-3 flex-col'>
          {/* Bank/Card Option */}
          <div 
            className={`flex gap-3 justify-start items-center border p-2 rounded-lg cursor-pointer transition-all 
            ${selected === 'bank' ? 'border-primary-600 bg-primary-600/20' : 'border-gray-400'}`}
            onClick={() => setSelected('bank')}
          >
            <span className={`border p-3 rounded-full ${selected === 'bank' ? 'border-primary-600' : 'border-primary-600/50'}`}>
              <BsBank2 className="text-[25px]" />
            </span>
            <div className="w-full text-start">
              <h1 className="text-[15px] font-semibold">Bank / Card Payment</h1>
              <p className="text-sm text-slate-400">Deposit funds directly using bank transfer or card payment.</p>
            </div>
          </div>

          {/* MOMO Deposit */}
          <div 
            className={`flex gap-3 justify-start items-center border p-2 rounded-lg cursor-pointer transition-all 
            ${selected === 'fapshi' ? 'border-primary-600 bg-primary-600/20' : 'border-gray-400'}`}
            onClick={() => setSelected('fapshi')}
          >
            <span className={`border p-3 rounded-full ${selected === 'fapshi' ? 'border-primary-600' : 'border-primary-600/50'}`}>
              <BiSolidMobileVibration className="text-[25px]" />
            </span>
            <div className="w-full text-start">
              <h1 className="text-[15px] font-semibold">MOMO Deposit(Cameroon)</h1>
              <p className="text-sm text-slate-400">Top up your wallet securely and conveniently using Mobile Money</p>
            </div>
          </div>

          {/* Crypto Deposit */}
          <div 
            className={`flex gap-3 justify-start items-center border p-2 rounded-lg cursor-pointer transition-all 
            ${selected === 'cryptomus' ? 'border-primary-600 bg-primary-600/20' : 'border-gray-400'}`}
            onClick={() => setSelected('cryptomus')}
          >
            <span className={`border p-3 rounded-full ${selected === 'cryptomus' ? 'border-primary-600' : 'border-primary-600/50'}`}>
              <RiBtcFill className="text-[25px]" />
            </span>
            <div className="w-full text-start">
              <h1 className="text-[15px] font-semibold">Crypto Deposit(International)</h1>
              <p className="text-sm text-slate-400">Fund your wallet with USDT securely and conveniently.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end gap-4 mt-5">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center justify-center" 
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

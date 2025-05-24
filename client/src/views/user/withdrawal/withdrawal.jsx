import React, { useState, useEffect, useContext } from 'react';
import InputField from "../../../components/interFace/InputField";
import axios from 'axios';
import { FaCheckCircle } from "react-icons/fa"; // Changed import for check icon
import { TiDelete } from "react-icons/ti";
import { AuthContext } from '../../../components/control/authContext';


const Withdrawal = () => {
  const { user, webSettings } = useContext(AuthContext);

  const [activeOption, setActiveOption] = useState('Bank');
  const [banks, setBanks] = useState([]);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [momoNumber, setMomoNumber] = useState(''); // Fixed typo here
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submission loading state

  const options = ['Bank', 'Crypto', 'MOMO'];

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('/general/bank');
        const banksArray = Array.isArray(response.data) ? response.data : response.data.data;
        setBanks(Array.isArray(banksArray) ? banksArray : []);
      } catch (error) {
        console.error('Error fetching banks:', error.message);
        setBanks([]);
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const verifyAccount = async () => {
      if (selectedBankCode && accountNumber.length === 10) {
        try {
          setVerifyingAccount(true);
          setAccountError('');
          setAccountName('');

          const res = await axios.post('/general/verify-bank-account', {
            accountNumber,
            bankCode: selectedBankCode,
          });

          if (res.data?.account_name) {
            setAccountName(res.data.account_name);
          } else {
            setAccountError('Unable to verify account. Please check details.');
          }
        } catch (err) {
          setAccountError(err.response?.data?.message || err.message);
        } finally {
          setVerifyingAccount(false);
        }
      } else {
        setAccountName('');
        setAccountError('');
      }
    };

    verifyAccount();
  }, [accountNumber, selectedBankCode]);

  const handleWithdrawal = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    try {
      const payload = {
        userId: user?._id,
        amount: Number(amount), // convert amount to number before sending
        method: activeOption,
      };

      if (activeOption === 'Bank') {
        payload.accountDetails = {
          bankCode: selectedBankCode,
          accountNumber,
          accountName,
        };
      } else if (activeOption === 'Crypto') {
        payload.walletAddress = walletAddress;
      } else if (activeOption === 'MOMO') {
        payload.momoNumber = momoNumber; // Fixed typo usage
      }

      const res = await axios.post('/withdraw', payload);
      console.log('Withdrawal successful:', res.data);
      alert('Withdrawal request submitted!');

      // Optionally reset form or keep values
    } catch (error) {
      console.error('Withdrawal error:', error.message);
      alert('Withdrawal failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='text-gray-200 flex flex-col'>
      <h1 className='text-lg font-semibold'>Withdrawal</h1>
      <p className='mb-4 mobile:text-[13px] pc:text-base'>
        Easily withdraw funds from your account! Enter the required details, choose the amount, confirm the transaction, and track your withdrawal status in real-time.
      </p>

      <div className='rounded-md px-3 py-2 bg-gray-800 justify-center items-center'>
        <div className='pc:w-[50%] mx-auto p-3 border border-gray-400/70 rounded-md space-y-4'>
          <div className='bg-primary-600 text-gray-200 p-2 rounded-md h-[7rem] flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
              <h1 className='font-medium text-sm'>Available Balance</h1>
              <span className='text-gray-200 font-semibold text-xl text-center'>
                {webSettings?.currency}{user?.merchant_balance}
              </span>
            </div>
          </div>


          {/* Withdrawal Method */}
          <div>
            <h1 className='text-gray-300 text-base'>Withdrawal Method:</h1>
            <div className='flex justify-start items-center gap-2'>
              {options.map((option) => (
                <span
                  key={option}
                  onClick={() => setActiveOption(option)}
                  className={`cursor-pointer px-4 py-1 rounded shadow-md transition duration-200 text-sm ${activeOption === option ? 'bg-primary-600 text-white' : 'bg-gray-300 text-black'
                    }`}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          {/* Bank Section */}
          {activeOption === 'Bank' && (
            <>
              <div className='flex flex-col'>
                <label htmlFor="bankName" className='font-medium'>Banks</label>
                <select
                  name="bankName"
                  id="bankName"
                  className='bg-gray-800 text-gray-300 rounded-md p-2'
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  disabled={loadingBanks}
                >
                  <option value="">Select a Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                id="accountNumber"
                label="Account Number"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 1234567890"
              />

              {accountError && (
                <div className="mt-1 bg-red-100 text-red-700 p-2 text-sm rounded-md flex justify-start items-center gap-2">
                  <span><TiDelete /></span>
                  {accountError}
                </div>
              )}

              {verifyingAccount ? (
                <div className="mt-1 bg-yellow-100 text-yellow-700 p-1 text-sm rounded-md flex justify-start items-center gap-2">
                  Checking...
                </div>
              ) : accountName ? (
                <div className="mt-1 bg-green-100 text-green-600 p-1 text-sm rounded-md flex justify-start items-center gap-2">
                  <span><FaCheckCircle /></span>
                  <strong>{accountName}</strong>
                </div>
              ) : null}
            </>
          )}

          {/* Crypto Section */}
          {activeOption === 'Crypto' && (
            <>
            <InputField
              id="walletAddress"
              label="Wallet Address"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="e.g. 0x123abc..."
            />

             <InputField
              id="walletNetwork"
              label="Wallet Network"
              type="text"
              value={walletAddress}
              onChange={(e) => setwalletNetwork(e.target.value)}
              placeholder="e.g. TRC20"
            />
            </>
          )}

          {/* MOMO Section */}
          {activeOption === 'MOMO' && (
            <InputField
              id="momoNumber"  // Fixed id
              label="Momo Number" // Fixed label casing
              type="text"
              value={momoNumber}  // Fixed variable name
              onChange={(e) => setMomoNumber(e.target.value)} // Fixed setter
              placeholder="e.g. 123456789"
            />
          )}

          {/* Amount */}
          <InputField
            id="amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
          />

          {/* Proceed Button */}
          <div className="mt-6 flex justify-end items-end gap-3">
            <button
              onClick={handleWithdrawal}
              className="px-6 py-2 rounded-md shadow-md bg-primary-600 hover:bg-primary-700 transition"
              disabled={
                isSubmitting || // disable while submitting
                (activeOption === 'Bank' && (!accountNumber || !selectedBankCode || !amount || !accountName)) ||
                (activeOption === 'Crypto' && (!walletAddress || !amount)) ||
                (activeOption === 'MOMO' && (!momoNumber || !amount))
              }
            >
              {isSubmitting ? 'Processing...' : 'Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;

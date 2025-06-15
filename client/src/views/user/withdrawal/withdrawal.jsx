import React, { useState, useEffect, useContext } from 'react';
import InputField from "../../../components/interFace/InputField";
import axios from 'axios';
import { FaCheckCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { AuthContext } from '../../../components/control/authContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withdrawalRequest } from '../../../components/backendApis/withdrawal/withdrawal';

const Withdrawal = () => {
  const { user, webSettings } = useContext(AuthContext);

  //  States
  const [activeOption, setActiveOption] = useState('Bank');
  const [banks, setBanks] = useState([]);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountError, setAccountError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletNetwork, setWalletNetwork] = useState('');
  const [coinName, setCoinName] = useState('USDT'); 
  const [momoNumber, setMomoNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = ['Bank', 'Crypto', 'MOMO'];

  // Fetch banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('/general/bank');
        const banksArray = response.data?.data || response.data || [];
        if (!Array.isArray(banksArray)) throw new Error('Invalid bank list format');
        setBanks(banksArray);
      } catch (error) {
        console.error('Error fetching banks:', error.message);
        toast.error('Failed to load banks.');
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  //  Verify account
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
    if (isSubmitting) return;

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user?.uid,
        amount: numericAmount,
        method: activeOption,
      };

      switch (activeOption) {
        case 'Bank':
          const selectedBank = banks.find((bank) => bank.code === selectedBankCode);
          if (!selectedBank) {
            toast.error("Please select a valid bank.");
            setIsSubmitting(false);
            return;
          }
          payload.bankAccount = accountNumber;
          payload.bankName = selectedBank.name;
          payload.accountName = accountName;
          break;

        case 'Crypto':
          payload.walletAddress = walletAddress;
          payload.walletNetwork = walletNetwork;
          payload.coinName = coinName;
          break;

        case 'MOMO':
          payload.momoNumber = momoNumber;
          break;

        default:
          throw new Error('Invalid withdrawal method.');
      }

      console.log("📤 Sending payload to API:", payload);

      const res = await withdrawalRequest(payload);

      if (res.success) {
        toast.success(res.message || 'Withdrawal request submitted!');
        console.log('Withdrawal successful:', res.data);

        // Reset form
        setAmount('');
        setAccountNumber('');
        setAccountName('');
        setWalletAddress('');
        setWalletNetwork('');
        setMomoNumber('');
      } else {
        throw new Error(res.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error(' Withdrawal error:', error.message);
      toast.error(error.message || 'Withdrawal failed. Please try again.');
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

          <div>
            <h1 className='text-gray-300 text-base'>Withdrawal Method:</h1>
            <div className='flex justify-start items-center gap-2'>
              {options.map((option) => (
                <span
                  key={option}
                  onClick={() => setActiveOption(option)}
                  className={`cursor-pointer px-4 py-1 rounded shadow-md transition duration-200 text-sm ${activeOption === option ? 'bg-primary-600 text-white' : 'bg-gray-300 text-black'}`}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          {activeOption === 'Bank' && (
            <>
              <div className='flex flex-col'>
                <label htmlFor="bankName" className='font-medium'>Banks</label>
                {loadingBanks ? (
                  <p className='text-sm text-gray-400'>Loading banks...</p>
                ) : banks.length === 0 ? (
                  <p className='text-red-500 text-sm'>Failed to load banks</p>
                ) : (
                  <select
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
                )}
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
                <div className="mt-1 bg-red-100 text-red-700 p-2 text-sm rounded-md flex items-center gap-2">
                  <TiDelete />
                  {accountError}
                </div>
              )}

              {verifyingAccount ? (
                <div className="mt-1 bg-yellow-100 text-yellow-700 p-1 text-sm rounded-md">Checking...</div>
              ) : accountName && (
                <div className="mt-1 bg-green-100 text-green-600 p-1 text-sm rounded-md flex items-center gap-2">
                  <FaCheckCircle />
                  <strong>{accountName}</strong>
                </div>
              )}
            </>
          )}

          {activeOption === 'Crypto' && (
            <>
              <h1 className='text-[14px]'>
                <strong>Note:</strong> Withdrawals are only supported in USDT. Using any other coin address will result in permanent loss. No recovery possible.
              </h1>
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
                value={walletNetwork}
                onChange={(e) => setWalletNetwork(e.target.value)}
                placeholder="e.g. TRC20"
              />
            </>
          )}

          {activeOption === 'MOMO' && (
            <InputField
              id="momoNumber"
              label="Momo Number"
              type="text"
              value={momoNumber}
              onChange={(e) => setMomoNumber(e.target.value)}
              placeholder="e.g. 233501234567"
            />
          )}

          <InputField
            id="amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleWithdrawal}
              className="px-6 py-2 rounded-md shadow-md bg-primary-600 hover:bg-primary-700 transition"
              disabled={
                isSubmitting ||
                (activeOption === 'Bank' && (!accountNumber || !selectedBankCode || !amount || !accountName)) ||
                (activeOption === 'Crypto' && (!walletAddress || !walletNetwork || !coinName || !amount)) ||
                (activeOption === 'MOMO' && (!momoNumber || !amount))
              }
            >
              {isSubmitting ? 'Processing...' : 'Proceed'}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Withdrawal;

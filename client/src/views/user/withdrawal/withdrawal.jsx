import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheckCircle, FaUniversity, FaBitcoin, FaMobileAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { MdOutlineAccountBalance } from "react-icons/md";
import { HiArrowRight, HiShieldCheck } from "react-icons/hi";
import { AuthContext } from "../../../components/control/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withdrawalRequest } from "../../../components/backendApis/withdrawal/withdrawal";

const FloatingInput = ({ id, label, type = "text", value, onChange, placeholder, readOnly }) => (
  <div className="relative group">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      readOnly={readOnly}
      className="peer w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-2xl px-4 pt-6 pb-2.5 text-sm focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all hover:border-gray-300 dark:hover:border-slate-600 disabled:opacity-60"
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-2 text-[11px] text-primary-600 font-semibold tracking-wide pointer-events-none transition-all
        peer-placeholder-shown:top-[1.05rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-slate-500 peer-placeholder-shown:font-normal
        peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary-600 peer-focus:font-semibold"
    >
      {label}
    </label>
  </div>
);

const methodConfig = {
  Bank:   { icon: <FaUniversity />,   color: "bg-blue-100 text-blue-600",   border: "border-blue-200" },
  Crypto: { icon: <FaBitcoin />,      color: "bg-yellow-100 text-yellow-600", border: "border-yellow-200" },
  MOMO:   { icon: <FaMobileAlt />,    color: "bg-green-100 text-green-600",  border: "border-green-200" },
};

const Withdrawal = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [activeOption, setActiveOption] = useState("Bank");
  const [banks, setBanks] = useState([]);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountError, setAccountError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletNetwork, setWalletNetwork] = useState("");
  const [coinName] = useState("USDT");
  const [momoNumber, setMomoNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const country = user?.country?.toLowerCase();
  const options = country === "nigeria" ? ["Bank", "Crypto"] : ["Crypto", "MOMO"];
  const currency = webSettings?.currency || "$";

  useEffect(() => {
    if (!options.includes(activeOption)) setActiveOption(options[0]);
  }, [country]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get("/general/bank");
        const arr = res.data?.data || res.data || [];
        if (!Array.isArray(arr)) throw new Error();
        setBanks(arr);
      } catch {
        toast.error("Failed to load banks.");
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (selectedBankCode && accountNumber.length === 10) {
        try {
          setVerifyingAccount(true);
          setAccountError("");
          setAccountName("");
          const res = await axios.post("/general/verify-bank-account", { accountNumber, bankCode: selectedBankCode });
          if (res.data?.account_name) {
            setAccountName(res.data.account_name);
          } else {
            setAccountError("Unable to verify account. Please check details.");
          }
        } catch (err) {
          setAccountError(err.response?.data?.message || err.message);
        } finally {
          setVerifyingAccount(false);
        }
      } else {
        setAccountName("");
        setAccountError("");
      }
    };
    verify();
  }, [accountNumber, selectedBankCode]);

  const handleWithdrawal = async () => {
    if (isSubmitting) return;
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) { toast.error("Please enter a valid amount."); return; }

    setIsSubmitting(true);
    try {
      const payload = { userId: user?.uid, amount: numericAmount, method: activeOption };
      if (activeOption === "Bank") {
        const bank = banks.find((b) => b.code === selectedBankCode);
        if (!bank) { toast.error("Please select a valid bank."); setIsSubmitting(false); return; }
        payload.bankAccount = accountNumber;
        payload.bankName = bank.name;
        payload.accountName = accountName;
      } else if (activeOption === "Crypto") {
        payload.walletAddress = walletAddress;
        payload.walletNetwork = walletNetwork;
        payload.coinName = coinName;
      } else if (activeOption === "MOMO") {
        payload.momoNumber = momoNumber;
      }

      const res = await withdrawalRequest(payload);
      if (res.success) {
        toast.success(res.message || "Withdrawal request submitted!");
        setAmount(""); setAccountNumber(""); setAccountName("");
        setWalletAddress(""); setWalletNetwork(""); setMomoNumber("");
        setTimeout(() => { window.location.href = "/user/dashboard"; }, 2000);
      } else {
        throw new Error(res.message || "Withdrawal failed");
      }
    } catch (error) {
      toast.error(error.message || "Withdrawal failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting ||
    (activeOption === "Bank" && (!accountNumber || !selectedBankCode || !amount || !accountName)) ||
    (activeOption === "Crypto" && (!walletAddress || !walletNetwork || !amount)) ||
    (activeOption === "MOMO" && (!momoNumber || !amount));

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ToastContainer position="top-right" theme="light" />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center">
            <MdOutlineAccountBalance size={16} className="text-primary-600" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Withdrawal</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500 ml-11">Request a payout to your preferred account</p>
      </div>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-secondary via-primary-100 to-slate-900 rounded-3xl p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Merchant Balance</p>
            <p className="text-3xl font-extrabold text-white">{currency}{parseFloat(user?.merchant_balance || 0).toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center">
            <MdOutlineAccountBalance size={22} className="text-primary-500" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm p-6 flex flex-col gap-6"
      >
        {/* Method selector */}
        <div>
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">Withdrawal Method</p>
          <div className="grid grid-cols-3 gap-3">
            {options.map((opt) => {
              const cfg = methodConfig[opt];
              return (
                <button
                  key={opt}
                  onClick={() => setActiveOption(opt)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all font-semibold text-sm ${
                    activeOption === opt
                      ? "border-primary-600 bg-primary-600/8 text-primary-600"
                      : `${cfg.border} bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 hover:border-primary-600/40`
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeOption === opt ? "bg-primary-600/15" : cfg.color}`}>
                    {cfg.icon}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Method-specific fields */}
        <div className="flex flex-col gap-4">
          {activeOption === "Bank" && (
            <>
              <div>
                <p className="text-[11px] font-semibold text-primary-600 tracking-wide mb-1.5 ml-1">Bank Name</p>
                {loadingBanks ? (
                  <div className="h-12 bg-gray-100 dark:bg-slate-700 animate-pulse rounded-2xl" />
                ) : (
                  <div className="relative">
                    <select
                      value={selectedBankCode}
                      onChange={(e) => setSelectedBankCode(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 appearance-none cursor-pointer"
                    >
                      <option value="">Select a bank</option>
                      {banks.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                )}
              </div>
              <FloatingInput
                id="accountNumber"
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="10-digit account number"
              />
              {accountError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-2xl">
                  <TiDelete size={16} />{accountError}
                </div>
              )}
              {verifyingAccount && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium px-4 py-3 rounded-2xl">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  Verifying account...
                </div>
              )}
              {accountName && !verifyingAccount && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-3 rounded-2xl">
                  <FaCheckCircle size={14} />{accountName}
                </div>
              )}
            </>
          )}

          {activeOption === "Crypto" && (
            <>
              <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
                <span className="text-yellow-600 text-lg flex-shrink-0">⚠️</span>
                <p className="text-xs text-yellow-700 font-medium leading-relaxed">
                  Withdrawals are only supported in <strong>USDT</strong>. Using any other coin address will result in permanent loss. No recovery possible.
                </p>
              </div>
              <FloatingInput id="walletAddress" label="Wallet Address (USDT)" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="e.g. TRC20 address" />
              <FloatingInput id="walletNetwork" label="Wallet Network" value={walletNetwork} onChange={(e) => setWalletNetwork(e.target.value)} placeholder="e.g. TRC20, BEP20" />
            </>
          )}

          {activeOption === "MOMO" && (
            <FloatingInput id="momoNumber" label="Mobile Money Number" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} placeholder="e.g. 233501234567" />
          )}

          <FloatingInput id="amount" label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>

        {/* Submit */}
        <button
          onClick={handleWithdrawal}
          disabled={isDisabled}
          className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm"
        >
          {isSubmitting ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Processing...</>
          ) : (
            <>Submit Withdrawal <HiArrowRight size={15} /></>
          )}
        </button>

        {/* Security note */}
        <div className="flex items-center gap-2 justify-center">
          <HiShieldCheck size={14} className="text-green-500" />
          <p className="text-xs text-gray-400 dark:text-slate-500">Your withdrawal is processed securely and encrypted</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Withdrawal;

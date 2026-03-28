import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import Deposit from "./modal/deposit";
import Notice from "./modal/notice";
import { AuthContext } from "../../../components/control/authContext";
import { getUserTransactions } from "../../../components/backendApis/history/transaction";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { FaWallet, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { MdOutlineAccountBalance } from "react-icons/md";
import { RiShieldCheckLine } from "react-icons/ri";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  const map = {
    completed:  "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
    successful: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
    failed:     "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50",
    pending:    "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${map[s] || "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-600"}`}>
      {status}
    </span>
  );
};

const Wallet = () => {
  const { user, webSettings } = useContext(AuthContext);
  const userId = user?.uid?.toString();
  const userRole = user?.role?.toLowerCase();

  const [isDepositOpen, setDepositOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getUserTransactions(userId);
        if (Array.isArray(data)) setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  useEffect(() => {
    if (user?.notice === 0 && userRole === "user") setShowNotice(true);
  }, [user?.notice, userRole]);

  if (!user || !webSettings) return null;

  const currency = webSettings.currency;
  const totalIn = transactions.filter(t => ["completed","successful"].includes(t.status?.toLowerCase()) && parseFloat(t.amount) > 0).reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalOut = transactions.filter(t => t.transaction_type?.toLowerCase().includes("withdraw") || t.transaction_type?.toLowerCase().includes("purchase")).reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {showNotice && <Notice onClose={() => setShowNotice(false)} />}

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">My Wallet</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">Manage your balance and transactions</p>
        </div>
        <NavLink to="/user/history">
          <button className="flex items-center gap-2 text-sm text-primary-600 font-semibold hover:underline">
            View all transactions <HiArrowRight size={14} />
          </button>
        </NavLink>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 tab:grid-cols-3 gap-4 mb-8">
        {/* Main balance */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
          className="tab:col-span-1 bg-gradient-to-br from-secondary via-primary-100 to-slate-900 rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-600/20 flex items-center justify-center">
                <FaWallet size={14} className="text-primary-500" />
              </div>
              <span className="text-xs font-semibold text-slate-400">Available Balance</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">{currency}{parseFloat(user?.account_balance || 0).toFixed(2)}</p>
            <p className="text-xs text-slate-500 mb-6">Main account balance</p>
            <button
              onClick={() => setDepositOpen(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-primary-600/30 transition-all hover:-translate-y-0.5 w-full justify-center"
            >
              <FaPlus size={12} /> Add Funds
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
              <FaArrowDown size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Total Received</p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">{currency}{totalIn.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
              <FaArrowUp size={16} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Total Spent</p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">{currency}{totalOut.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
          <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-4">Quick Actions</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setDepositOpen(true)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-primary-600/8 hover:bg-primary-600/15 text-primary-600 font-semibold text-sm transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-primary-600/15 flex items-center justify-center flex-shrink-0">
                <FaPlus size={13} />
              </div>
              Fund Wallet
            </button>
            <NavLink to="/user/withdraw">
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold text-sm transition-all">
                <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <MdOutlineAccountBalance size={15} className="text-gray-600 dark:text-slate-400" />
                </div>
                Withdraw
              </button>
            </NavLink>
            <NavLink to="/user/history">
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold text-sm transition-all">
                <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <BiTransfer size={15} className="text-gray-600 dark:text-slate-400" />
                </div>
                Transaction History
              </button>
            </NavLink>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center">
              <BiTransfer size={16} className="text-primary-600" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Recent Transactions</p>
          </div>
          <NavLink to="/user/history" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
            View all <HiArrowRight size={12} />
          </NavLink>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-2/3" />
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded w-1/3" />
                </div>
                <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-16" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <BiTransfer size={24} className="text-gray-300 dark:text-slate-600" />
            </div>
            <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">No transactions yet</p>
            <button onClick={() => setDepositOpen(true)} className="text-xs text-primary-600 font-semibold hover:underline">
              Fund your wallet to get started
            </button>
          </div>
        ) : (
          <>
            {/* ── Mobile cards (hidden on tab+) ── */}
            <div className="tab:hidden divide-y divide-gray-50 dark:divide-white/5">
              {transactions.slice(0, 8).map((t) => {
                const isCredit = ["completed", "successful"].includes(t.status?.toLowerCase()) && parseFloat(t.amount) > 0;
                return (
                  <div
                    key={`mob-${t.transaction_no}`}
                    className="flex items-start gap-3 p-4 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isCredit ? "bg-green-50 dark:bg-green-900/20" : "bg-primary-600/10"}`}>
                      {isCredit
                        ? <FaArrowDown size={13} className="text-green-600 dark:text-green-400" />
                        : <FaArrowUp size={13} className="text-primary-600" />
                      }
                    </div>

                    {/* left */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 capitalize truncate">{t.transaction_type}</p>
                      <p className="text-[10px] font-mono text-gray-400 dark:text-slate-500 mt-0.5 truncate">{t.transaction_no}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{formatDateTime(t.created_at)}</p>
                    </div>

                    {/* right */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {currency}{parseFloat(t.amount).toFixed(2)}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop table (hidden below tab) ── */}
            <div className="hidden tab:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-white/5">
                    {["Transaction ID", "Type", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {transactions.slice(0, 8).map((t) => (
                    <tr key={`desk-${t.transaction_no}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-500 dark:text-slate-400 whitespace-nowrap">{t.transaction_no}</td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap capitalize">{t.transaction_type}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{currency}{parseFloat(t.amount).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={t.status} /></td>
                      <td className="px-6 py-4 text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">{formatDateTime(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>

      {/* Trust strip */}
      <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
        {[
          { icon: <RiShieldCheckLine size={14} />, t: "SSL Encrypted" },
          { icon: <FaWallet size={12} />, t: "Secure Wallet" },
          { icon: <BiTransfer size={14} />, t: "Instant Processing" },
        ].map(({ icon, t }) => (
          <div key={t} className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
            <span className="text-primary-600">{icon}</span>{t}
          </div>
        ))}
      </div>

      {isDepositOpen && <Deposit onClose={() => setDepositOpen(false)} />}
    </div>
  );
};

export default Wallet;

import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GiWallet } from "react-icons/gi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { HiMiniWallet } from "react-icons/hi2";
import { MdStorefront } from "react-icons/md";
import { AuthContext } from "../../../components/control/authContext";
import { getUserOrderHistory } from "../../../components/backendApis/history/orderHistory";
import Notice from "../wallet/modal/notice";
import Transaction from "../history/transaction";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const statCards = (currency, balance, totalPrice, escrow, totalWithdrawn) => [
  {
    icon: <GiWallet size={22} />,
    label: "Available Balance",
    value: `${currency}${parseFloat(balance || 0).toFixed(2)}`,
    gradient: "from-secondary via-primary-100 to-slate-900",
    glow: "shadow-primary-600/20",
  },
  {
    icon: <FaMoneyBillTrendUp size={22} />,
    label: "Sale Balance",
    value: `${currency}${totalPrice.toFixed(2)}`,
    gradient: "from-slate-700 to-slate-900",
    glow: "shadow-slate-700/20",
  },
  {
    icon: <GrMoney size={22} />,
    label: "Escrow Balance",
    value: `${currency}${parseFloat(escrow || 0).toFixed(2)}`,
    gradient: "from-gray-700 to-gray-900",
    glow: "shadow-gray-700/20",
  },
  {
    icon: <HiMiniWallet size={22} />,
    label: "Total Cash Out",
    value: `${currency}${parseFloat(totalWithdrawn || 0).toFixed(2)}`,
    gradient: "from-zinc-700 to-zinc-900",
    glow: "shadow-zinc-700/20",
  },
];

const Marchant = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [loading, setLoading] = useState(true);

  const userRole = user?.role?.toLowerCase();
  const [showNotice, setShowNotice] = useState(user?.notice === 0 && userRole === "merchant");
  const currency = webSettings?.currency || "$";

  useEffect(() => {
    setShowNotice(user?.notice === 0 && userRole === "merchant");
  }, [user?.notice, userRole]);

  useEffect(() => {
    if (!user?.uid) return;
    getUserOrderHistory(String(user.uid))
      .then((res) => {
        if (!res.success) return;
        const { orderHistory = [], merchantHistory = [] } = res.data || {};
        const totalSale = orderHistory.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
        setTotalPrice(totalSale);
        const withdrawn = merchantHistory
          .filter((t) => String(t.transaction_type).toLowerCase() === "withdrawal request" && String(t.status).toLowerCase() === "completed")
          .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        setTotalWithdrawn(withdrawn);
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || !webSettings) return null;

  const cards = statCards(currency, user.merchant_balance, totalPrice, user.escrow_balance, totalWithdrawn);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {showNotice && <Notice onClose={() => setShowNotice(false)} />}

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center">
              <MdStorefront size={16} className="text-primary-600" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Merchant Dashboard</h1>
          </div>
          <p className="text-sm text-gray-400 dark:text-slate-500 ml-11">Welcome back, {user.name?.split(" ")[0] || "Merchant"}</p>
        </div>
      </div>

      {/* Stat cards */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.4 }}
        className="grid grid-cols-2 pc:grid-cols-4 gap-4 mb-6">
        {cards.map(({ icon, label, value, gradient, glow }, i) => (
          <motion.div
            key={label}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className={`relative bg-gradient-to-br ${gradient} rounded-3xl p-5 shadow-lg ${glow} overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            {loading ? (
              <div className="animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-white/10 mb-3" />
                <div className="h-2 bg-white/10 rounded w-2/3 mb-2" />
                <div className="h-5 bg-white/10 rounded w-1/2" />
              </div>
            ) : (
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/80 mb-3">
                  {icon}
                </div>
                <p className="text-[11px] text-white/50 font-medium mb-0.5">{label}</p>
                <p className="text-lg font-extrabold text-white">{value}</p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Transaction history */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.3 }}>
        <Transaction />
      </motion.div>
    </div>
  );
};

export default Marchant;

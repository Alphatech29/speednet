import React, { useContext, useEffect, useState } from "react";
import Transaction from "../history/transaction";
import { GiWallet } from "react-icons/gi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { HiMiniWallet } from "react-icons/hi2";
import { AuthContext } from "../../../components/control/authContext";
import { getUserOrders } from "../../../components/backendApis/history/orderHistory";

const Marchant = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!user || !user?.uid) return;

    getUserOrders(String(user.uid))
      .then((response) => {
        setOrders(response);
        const total = response.reduce((sum, order) => sum + parseFloat(order.price), 0);
        setTotalPrice(total);
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  }, [user]);

  if (!user || !webSettings) return null;

  return (
    <div className="w-full pc:h-screen mobile:pb-10 flex flex-col">
      <div className="text-lg font-medium text-gray-200 mb-4">Dashboard</div>

      {/* Card Stats Section */}
      <div className="w-full flex flex-wrap justify-start pc:justify-center tab:justify-center items-center gap-4 mobile:gap-2 mb-6 mobile:mb-4">
        {/* Available Balance */}
        <div className="bg-primary-600 text-pay px-4 h-20 rounded-lg flex items-center gap-4 min-w-[173px] tab:min-w-[200px] pc:min-w-[250px]">
          <GiWallet className="text-[30px] tab:text-[40px] pc:text-[47px]" />
          <div>
            <span className="block text-[12px] tab:text-sm">Available Balance</span>
            <p className="font-semibold text-[14px] tab:text-base">
              {webSettings.currency}{user.merchant_balance}
            </p>
          </div>
        </div>

        {/* Sale Balance */}
        <div className="bg-zinc-700 text-pay px-4 h-20 rounded-lg flex items-center gap-4 shadow-md min-w-[173px] tab:min-w-[200px] pc:min-w-[250px]">
          <FaMoneyBillTrendUp className="text-[30px] tab:text-[40px] pc:text-[47px]" />
          <div>
            <span className="block text-[12px] tab:text-sm">Sale Balance</span>
            <p className="font-semibold text-[14px] tab:text-base">
              {webSettings.currency}{totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Escrow Balance */}
        <div className="bg-gray-800 text-pay px-4 h-20 rounded-lg flex items-center gap-4 shadow-md min-w-[173px] tab:min-w-[200px] pc:min-w-[250px]">
          <GrMoney className="text-[30px] tab:text-[40px] pc:text-[47px]" />
          <div>
            <span className="block text-[12px] tab:text-sm">Escrow Balance</span>
            <p className="font-semibold text-[14px] tab:text-base">
              {webSettings.currency}{user.escrow_balance}
            </p>
          </div>
        </div>

        {/* Total Cash Out */}
        <div className="bg-zinc-700 mobile:bg-gray-900 text-pay px-4 h-20 rounded-lg flex items-center gap-4 shadow-md min-w-[173px] tab:min-w-[200px] pc:min-w-[250px]">
          <HiMiniWallet className="text-[30px] tab:text-[40px] pc:text-[47px]" />
          <div>
            <span className="block text-[12px] tab:text-sm">Total Cash Out</span>
            <p className="font-semibold text-[14px] tab:text-base">$500,000.00</p>
          </div>
        </div>
      </div>

      {/* Transaction Component */}
      <Transaction />
    </div>
  );
};

export default Marchant;

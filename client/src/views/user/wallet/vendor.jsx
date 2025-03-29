import React, { useContext } from "react";
import Transaction from "../history/transaction";
import { GiWallet } from "react-icons/gi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { HiMiniWallet } from "react-icons/hi2";
import { AuthContext } from "../../../components/control/authContext";

const Marchant = () => {
  const { user, webSettings } = useContext(AuthContext);

  if (!user || !webSettings) return null; 

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="text-lg font-medium text-gray-200">Dashboard</div>
      <div className="w-full gap-4 flex justify-start items-center pt-3">
        {/* Available Balance */}
        <div className="bg-primary-600 text-pay min-w-64 px-4 h-20 rounded-lg flex gap-5 justify-center items-center">
          <span>
            <GiWallet className="text-[47px]" />
          </span>
          <div>
            <span className="text-pay text-sm">Available Balance</span>
            <p className="text-pay text-lg font-semibold text-center">
              {webSettings.currency}{user.merchant_balance}
            </p>
          </div>
        </div>

        {/* Sale Balance */}
        <div className="min-w-64 px-4 bg-zinc-700 shadow-md h-20 rounded-lg flex justify-center items-center p-3">
          <div className="flex justify-center items-center gap-5 text-pay">
            <span>
              <FaMoneyBillTrendUp className="text-[47px]" />
            </span>
            <div>
              <span className="text-sm">Sale Balance</span>
              <p className="font-semibold text-base text-center">$500,000.00</p>
            </div>
          </div>
        </div>

        {/* Escrow Balance */}
        <div className="bg-gray-800 min-w-64 px-4 h-20 rounded-lg shadow-md flex flex-col justify-center items-center p-3">
          <div className="flex justify-center items-center gap-5 text-pay">
            <span>
              <GrMoney className="text-[47px]" />
            </span>
            <div>
              <span className="text-sm">Escrow Balance</span>
              <p className="font-semibold text-base text-center">
                {webSettings.currency}{user.escrow_balance}
              </p>
            </div>
          </div>
        </div>

        {/* Total Cash Out */}
        <div className="min-w-64 px-4 bg-zinc-700 shadow-md h-20 rounded-lg flex flex-col justify-center items-center p-3">
          <div className="flex justify-center items-center gap-5 text-pay">
            <span>
              <HiMiniWallet className="text-[47px]" />
            </span>
            <div>
              <span className="text-sm">Total Cash Out</span>
              <p className="font-semibold text-base text-center">$500,000.00</p>
            </div>
          </div>
        </div>
      </div>

      <Transaction />
    </div>
  );
};

export default Marchant;

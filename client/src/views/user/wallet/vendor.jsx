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

    if (!user) {
      console.warn("User context is not yet available.");
      return;
    }

    if (!user?.uid) {
      console.error("Invalid or missing user ID:", user?.uid);
      return;
    }

    const userUid = String(user.uid);

    getUserOrders(userUid)
      .then((response) => {
        setOrders(response);

        // Calculate the total price of all orders and update the state
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
      <div className="text-lg font-medium text-gray-200">Dashboard</div>
      <div className="w-full pc:gap-4 mobile:gap-2 flex mobile:flex-wrap   justify-start items-center pt-3">
        <div className="bg-primary-600 text-pay pc:min-w-[250px] mobile:min-w-[175px] px-4 h-20 rounded-lg flex pc:gap-5 mobile:gap-3 justify-center items-center">
          <span>
            <GiWallet className="text-[47px] mobile:text-[30px]" />
          </span>
          <div>
            <span className="text-pay pc:text-sm mobile:text-[12px]">Available Balance</span>
            <p className="text-pay pc:text-base font-semibold mobile:text-[14px] text-center">
              {webSettings.currency}{user.merchant_balance}
            </p>
          </div>
        </div>

        <div className="pc:min-w-[250px] mobile:min-w-[175px] px-4 bg-zinc-700 shadow-md h-20 rounded-lg flex pc:justify-center items-center p-3">
          <div className="flex justify-center items-center pc:gap-5 mobile:gap-3 text-pay">
            <span>
              <FaMoneyBillTrendUp className="text-[47px] mobile:text-[30px]" />
            </span>
            <div>
              <span className="pc:text-sm mobile:text-[12px]">Sale Balance</span>
              <p className="font-semibold pc:text-base mobile:text-[14px] text-center">
                {webSettings.currency}{totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 pc:min-w-[250px] mobile:w-[175px] px-4 h-20 rounded-lg shadow-md flex flex-col pc:justify-center items-center p-3">
          <div className="flex justify-center items-center pc:gap-5 mobile:gap-3 text-pay">
            <span>
              <GrMoney className="text-[47px] mobile:text-[30px]" />
            </span>
            <div>
              <span className="pc:text-sm mobile:text-[12px]">Escrow Balance</span>
              <p className="font-semibold pc:text-base mobile:text-[14px] text-center">
                {webSettings.currency}{user.escrow_balance}
              </p>
            </div>
          </div>
        </div>

        <div className="pc:min-w-[250px] mobile:min-w-[175px] px-4 bg-zinc-700 shadow-md h-20 rounded-lg flex flex-col pc:justify-center items-center p-3">
          <div className="flex justify-center items-center pc:gap-5 mobile:gap-3 text-pay">
            <span>
              <HiMiniWallet className="text-[47px] mobile:text-[30px]" />
            </span>
            <div>
              <span className="pc:text-sm mobile:text-[12px]">Total Cash Out</span>
              <p className="font-semibold pc:text-base text-center mobile:text-[14px]">$500,000.00</p>
            </div>
          </div>
        </div>
      </div>

      <Transaction />
    </div>
  );
};

export default Marchant;

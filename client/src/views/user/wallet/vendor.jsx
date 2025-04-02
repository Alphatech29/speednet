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
    <div className="w-full h-screen flex flex-col">
      <div className="text-lg font-medium text-gray-200">Dashboard</div>
      <div className="w-full gap-4 flex justify-start items-center pt-3">
        <div className="bg-primary-600 text-pay min-w-[250px] px-4 h-20 rounded-lg flex gap-5 justify-center items-center">
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

        <div className="min-w-[250px] px-4 bg-zinc-700 shadow-md h-20 rounded-lg flex justify-center items-center p-3">
          <div className="flex justify-center items-center gap-5 text-pay">
            <span>
              <FaMoneyBillTrendUp className="text-[47px]" />
            </span>
            <div>
              <span className="text-sm">Sale Balance</span>
              <p className="font-semibold text-base text-center">
                {webSettings.currency}{totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 min-w-[250px] px-4 h-20 rounded-lg shadow-md flex flex-col justify-center items-center p-3">
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

        <div className="min-w-[250px] px-4 bg-zinc-700 shadow-md h-20 rounded-lg flex flex-col justify-center items-center p-3">
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

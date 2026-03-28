import { useEffect, useState, useContext } from "react";
import { FaMoneyCheckAlt, FaChartLine, FaUsers } from "react-icons/fa";
import { PiChartPieSliceThin } from "react-icons/pi";
import { getNordHistory } from "../../../components/backendApis/nordVpn/nordVpn";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { AdminAuthContext } from "../../../components/control/adminContext";

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{children}</th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3.5 text-sm text-gray-700 ${className}`}>{children}</td>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4">
    <div>
      <p className="text-xs font-semibold text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
    </div>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={20} />
    </div>
  </div>
);

const NORD_CREDS = [
  { label: "Public Key",     value: "nord-pub-9321-LIVEz7_TyQm" },
  { label: "Secret Key",     value: "Q7mDxE3BV1aNZKLc94xgRA8yP6UTabHX7sLpJr3kXfvbEeTAyMzdTn9LBc6QWdMP4cyuBFmHTqz7kA9p2NdYr3stR5qLcxJmIKuYgXsaQDoVnLwHEu9FqvBtRwMXU" },
  { label: "API Key",        value: "API_LIVE_928a381db9fdb209d725" },
  { label: "Refresh Token",  value: "RTK_EU_REFRESH_92asd12981asd91as" },
  { label: "Server",         value: "s82p.nordvpn.com" },
  { label: "Nord URL",       value: "https://api.nordvpn.com/reseller-program" },
];

const PLANS = [
  { name: "Professional", duration: "1 Month" },
  { name: "Standard",     duration: "1 Month" },
];

const NordAdmin = () => {
  const [transactions, setTransactions]     = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { adminDetails } = useContext(AdminAuthContext);

  useEffect(() => {
    getNordHistory()
      .then((res) => {
        if (res?.success && Array.isArray(res.data?.data)) setTransactions(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-bold text-gray-800">Nord Reseller Admin</p>
        <p className="text-xs text-gray-400 mt-0.5">Manage your Nord VPN reseller dashboard and transaction history</p>
      </div>

      <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
        <span className="text-yellow-600 font-bold text-xs shrink-0">Notice:</span>
        <p className="text-xs text-yellow-700">All dashboard services and features are securely managed and powered by the Nord Server to ensure optimal performance and reliability.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-4 gap-4">
        <StatCard label="Funds" value={`$${adminDetails?.balance ?? "0.00"}`}
          icon={FaMoneyCheckAlt} color="bg-blue-100 text-blue-600" />
        <StatCard label="Total Sales" value="$0.00"
          icon={FaChartLine} color="bg-orange-100 text-orange-600" />
        <StatCard label="Commission" value={`$${adminDetails?.commission ?? "0.00"}`}
          icon={PiChartPieSliceThin} color="bg-purple-100 text-purple-600" />
        <StatCard label="Total Accounts" value="0"
          icon={FaUsers} color="bg-green-100 text-green-600" />
      </div>

      {/* Server Credentials */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nord Server Connection</p>
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-4">
          {NORD_CREDS.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">{label}</label>
              <input type="text" value={value} readOnly
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-default outline-none font-mono truncate" />
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nord Reseller Plans</p>
        </div>
        <div className="overflow-x-auto admin-table-wrap">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-gray-50/60">
              <tr>
                <Th>Plan</Th><Th>Duration</Th><Th>Accounts</Th>
                <Th>Active</Th><Th>Inactive</Th><Th>Sales</Th><Th>Commission</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PLANS.map((p) => (
                <tr key={p.name} className="hover:bg-gray-50/60 transition-colors">
                  <Td className="font-semibold text-gray-800">{p.name}</Td>
                  <Td>{p.duration}</Td>
                  <Td>0</Td><Td>0</Td><Td>0</Td>
                  <Td className="font-semibold">$0.00</Td>
                  <Td className="font-semibold">$0.00</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reseller Transaction History</p>
        </div>
        <div className="overflow-x-auto admin-table-wrap">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-gray-50/60">
              <tr>
                <Th>#</Th><Th>User Details</Th><Th>Plan</Th>
                <Th>Country</Th><Th>Amount</Th><Th>Status</Th><Th>Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loadingHistory
                ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[1,2,3,4,5,6,7].map((j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-3 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${40 + (j * 11) % 45}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
                : transactions.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">
                        No transaction history.
                      </td>
                    </tr>
                  )
                  : transactions.map((item, i) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <Td className="text-gray-400 font-medium">{i + 1}</Td>
                      <Td>
                        <p className="font-semibold text-gray-800 text-xs">{item.history_full_name}</p>
                        <p className="text-[11px] text-gray-400">{item.history_email}</p>
                      </Td>
                      <Td>{item.package_name}</Td>
                      <Td>{item.country}</Td>
                      <Td className="font-semibold">${item.amount}</Td>
                      <Td>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === "completed" ? "bg-green-100 text-green-700" :
                          item.status === "pending"   ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-red-100 text-red-700"
                        }`}>{item.status}</span>
                      </Td>
                      <Td className="text-xs text-gray-400 whitespace-nowrap">{formatDateTime(item.created_at)}</Td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NordAdmin;

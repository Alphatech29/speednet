import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { HiMiniServer } from "react-icons/hi2";
import { TabHeader } from "./_shared";

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Days left badge ───────────────────────────────────────── */
const DaysBadge = ({ days }) => {
  const n = Number(days);
  const cls = n <= 7
    ? "bg-red-50 text-red-600 border-red-100"
    : n <= 30
    ? "bg-amber-50 text-amber-600 border-amber-100"
    : "bg-emerald-50 text-emerald-600 border-emerald-100";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${n <= 7 ? "bg-red-500" : n <= 30 ? "bg-amber-500" : "bg-emerald-500"}`} />
      {days} days
    </span>
  );
};

/* ── Status badge ────────────────────────────────────────────── */
const StatusBadge = ({ state }) => {
  const running = state === "Running";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border
      ${running ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${running ? "bg-emerald-500" : "bg-red-500"}`} />
      {state}
    </span>
  );
};

/* ── Mobile card ──────────────────────────────────────────────── */
const MobileApiCard = ({ api, index }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index}
    className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm font-extrabold text-gray-900">{api.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{api.premium_plan?.plan} · {api.premium_plan?.billing_cycle}</p>
      </div>
      <StatusBadge state={api.state} />
    </div>
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-bold text-gray-700">${api.premium_plan?.price_usd}</span>
      <span className="text-gray-300">·</span>
      <span className="text-gray-500">Expires {api.expires_on}</span>
      <DaysBadge days={api.days_remaining} />
    </div>
  </motion.div>
);

/* ── Skeleton ─────────────────────────────────────────────────── */
const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-3 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${40 + (i * 11) % 45}%` }} />
      </td>
    ))}
  </tr>
);

/* ── Component ─────────────────────────────────────────────────── */
const ApisTab = () => {
  const [apis,    setApis]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/general/apis")
      .then((res) => setApis(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <TabHeader title="Paid API Plans" subtitle="Monitor your active premium API subscriptions" />

      {/* ── Mobile cards ── */}
      <div className="flex flex-col gap-3 tab:hidden">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-20" />
              </div>
            ))
          : apis.length > 0
          ? apis.map((api, i) => <MobileApiCard key={i} api={api} index={i} />)
          : (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                <HiMiniServer size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No API plans found</p>
            </div>
          )
        }
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden tab:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />
        <div className="overflow-x-auto admin-table-wrap">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                {["#", "Name", "Plan", "Billing", "Price", "Expires On", "Days Left", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                : apis.length > 0
                ? apis.map((api, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-3.5 text-xs text-gray-400 font-medium">{i + 1}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-900">{api.name}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{api.premium_plan?.plan}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{api.premium_plan?.billing_cycle}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-800">${api.premium_plan?.price_usd}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">{api.expires_on}</td>
                      <td className="px-4 py-3.5"><DaysBadge days={api.days_remaining} /></td>
                      <td className="px-4 py-3.5"><StatusBadge state={api.state} /></td>
                    </tr>
                  ))
                : (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <HiMiniServer size={18} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400">No API plans found</p>
                      </div>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApisTab;

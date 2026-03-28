import { motion, AnimatePresence } from "framer-motion";
import { GiConfirmed } from "react-icons/gi";
import { HiCheckCircle } from "react-icons/hi";

/* ── Skeleton row ── */
const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 dark:border-white/5 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse w-3/5" />
      <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse w-2/5" />
    </div>
    <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse w-14" />
    <div className="h-6 bg-green-100 dark:bg-green-900/20 rounded-full animate-pulse w-16" />
  </div>
);

/* ── Initials avatar ── */
const Avatar = ({ email }) => {
  const letter = (email?.[0] || "?").toUpperCase();
  return (
    <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-extrabold text-green-600 dark:text-green-400">{letter}</span>
    </div>
  );
};

const Completed = ({ referrals = [], loading = false }) => {
  const completedReferrals = referrals.filter((r) => r.referral_status === 1);

  if (loading) {
    return (
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (completedReferrals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-14 text-center px-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4">
          <HiCheckCircle size={26} className="text-green-400 dark:text-green-500" />
        </div>
        <p className="text-sm font-bold text-gray-700 dark:text-slate-200 mb-1">No Completed Referrals</p>
        <p className="text-xs text-gray-400 dark:text-slate-500 max-w-[220px]">
          Completed referrals and your rewards will appear here.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Mobile cards */}
      <div className="tab:hidden divide-y divide-gray-50 dark:divide-white/5">
        <AnimatePresence>
          {completedReferrals.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-4 py-3.5"
            >
              <Avatar email={r.email} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">{r.email}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">#{i + 1}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-xs font-extrabold text-green-600 dark:text-green-400">
                  +${Number(r.referral_amount).toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700/40">
                  <GiConfirmed size={9} /> Completed
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop table */}
      <div className="hidden tab:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5">
              {["#", "Referral", "Earned", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {completedReferrals.map((r, i) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3.5 text-xs text-gray-400 dark:text-slate-500 font-medium">{i + 1}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar email={r.email} />
                    <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 truncate max-w-[180px]">
                      {r.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs font-extrabold text-green-600 dark:text-green-400">
                  +${Number(r.referral_amount).toLocaleString()}
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700/40">
                    <GiConfirmed size={9} /> Completed
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="px-4 py-2.5 border-t border-gray-50 dark:border-white/5">
        <p className="text-[10px] text-gray-400 dark:text-slate-500">
          {completedReferrals.length} completed referral{completedReferrals.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default Completed;

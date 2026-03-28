import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllUsers } from "../../../components/backendApis/admin/apis/users";
import { transferFunds } from "../../../components/backendApis/admin/apis/transfer";
import { getAllTransactions } from "../../../components/backendApis/admin/apis/histroy";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiSearch, HiPaperAirplane, HiArrowRight, HiChevronDown, HiCheckCircle } from "react-icons/hi";
import { HiArrowsRightLeft, HiClock, HiUserCircle } from "react-icons/hi2";

/* ── Animations ─────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── User avatar with colored initial ──────────────────────── */
const COLORS = [
  "bg-violet-100 text-violet-600", "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600", "bg-orange-100 text-orange-600",
  "bg-rose-100 text-rose-600", "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600", "bg-indigo-100 text-indigo-600",
];
const Avatar = ({ name = "", size = "md" }) => {
  const color = COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  const dim   = size === "sm" ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-sm";
  return (
    <div className={`${dim} ${color} rounded-full flex items-center justify-center font-extrabold flex-shrink-0`}>
      {name.charAt(0).toUpperCase() || "?"}
    </div>
  );
};

/* ── Skeleton rows ──────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse flex items-center gap-3">
    <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-2/5" />
      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
    </div>
    <div className="h-4 bg-gray-100 rounded w-16" />
  </div>
);

/* ── Mobile history card ────────────────────────────────────── */
const HistoryCard = ({ item, index }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index}
    className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
    <Avatar name={item.full_name} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-gray-900 truncate">{item.full_name}</p>
      <p className="text-[11px] text-gray-400 truncate">{item.email}</p>
      <p className="text-[10px] text-gray-300 mt-0.5">{item.created_at}</p>
    </div>
    <span className="text-sm font-extrabold text-emerald-600 flex-shrink-0">
      +${item.amount.toLocaleString()}
    </span>
  </motion.div>
);

/* ── Transfer component ─────────────────────────────────────── */
const Transfer = () => {
  const [form,         setForm]         = useState({ recipient: "", amount: "" });
  const [users,        setUsers]        = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [history,      setHistory]      = useState([]);
  const [submitting,   setSubmitting]   = useState(false);
  const dropdownRef = useRef(null);

  /* ── Load users ── */
  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setUsers(list); setFiltered(list);
      })
      .catch(() => toast.error("Failed to fetch users."))
      .finally(() => setUsersLoading(false));
  }, []);

  /* ── Load transfer history ── */
  useEffect(() => {
    if (!usersLoading) {
      getAllTransactions()
        .then((res) => {
          if (Array.isArray(res?.data)) {
            const h = res.data
              .filter((t) => t.transaction_type === "Fund from Admin")
              .map((t) => ({
                full_name: t.full_name || "Unknown",
                email:     t.email     || "Unknown",
                amount:    parseFloat(t.amount),
                created_at: formatDateTime(t.created_at),
              }));
            setHistory(h.slice(0, 10));
          }
        })
        .catch(console.error);
    }
  }, [usersLoading]);

  /* ── Filter users ── */
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFiltered(users.filter((u) =>
      (u.full_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
    ));
  }, [searchQuery, users]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedUser = users.find((u) => u.uid === form.recipient);
  const amountNum    = parseFloat(form.amount) || 0;
  const canSubmit    = form.recipient && amountNum > 0 && !submitting;

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipient || !form.amount) { toast.warning("Please fill all fields."); return; }
    setSubmitting(true);
    try {
      const res = await transferFunds({ userId: form.recipient, amount: form.amount });
      if (res?.success) {
        toast.success(res.message || "Transfer successful");
        setHistory((prev) => [{
          full_name:  selectedUser?.full_name || "Unknown",
          email:      selectedUser?.email     || "Unknown",
          amount:     amountNum,
          created_at: formatDateTime(new Date()),
        }, ...prev.slice(0, 9)]);
        setForm({ recipient: "", amount: "" });
      } else toast.error(res?.message || "Transfer failed");
    } catch { toast.error("Something went wrong during the transfer."); }
    setSubmitting(false);
  };

  /* ── Total stats ── */
  const totalTransferred = history.reduce((s, h) => s + h.amount, 0);

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* ── Page header ── */}
      <div>
        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-xl font-extrabold text-gray-900">Fund Transfer</h1>
        <p className="text-sm text-gray-400 mt-0.5">Send funds directly to a user's account balance</p>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 tab:grid-cols-3 gap-3">
        {[
          { label: "Users Loaded", value: usersLoading ? "—" : users.length.toLocaleString(), icon: HiUserCircle,      color: "bg-blue-50 text-blue-600" },
          { label: "Recent Transfers", value: history.length,                                  icon: HiArrowsRightLeft, color: "bg-emerald-50 text-emerald-600" },
          { label: "Total Funded",   value: `$${totalTransferred.toLocaleString()}`,           icon: HiPaperAirplane,   color: "bg-orange-50 text-orange-600" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} variants={fadeUp} initial="hidden" animate="visible" custom={i}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-extrabold text-gray-900 leading-tight truncate">{value}</p>
              <p className="text-[11px] text-gray-400">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main grid: form + history ── */}
      <div className="grid grid-cols-1 pc:grid-cols-[420px_1fr] gap-5 items-start">

        {/* ── Transfer Form ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Accent */}
          <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

          {/* Card header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
              <HiArrowsRightLeft size={15} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">New Transfer</p>
              <p className="text-[11px] text-gray-400">Select a recipient and enter amount</p>
            </div>
          </div>

          <div className="p-5">
            {usersLoading ? (
              <div className="flex items-center gap-3 py-6">
                <div className="w-5 h-5 rounded-full border-2 border-primary-600 border-t-transparent animate-spin flex-shrink-0" />
                <p className="text-sm text-gray-400">Loading users…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Recipient picker */}
                <div className="flex flex-col gap-1.5" ref={dropdownRef}>
                  <label className="text-xs font-bold text-gray-500">Recipient</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((v) => !v)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm rounded-xl border transition-all outline-none
                        ${dropdownOpen
                          ? "border-primary-600 ring-2 ring-primary-600/10 bg-white"
                          : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {selectedUser
                          ? <>
                              <Avatar name={selectedUser.full_name} size="sm" />
                              <div className="min-w-0 text-left">
                                <p className="text-xs font-bold text-gray-800 truncate">{selectedUser.full_name}</p>
                                <p className="text-[10px] text-gray-400 truncate">{selectedUser.email}</p>
                              </div>
                            </>
                          : <span className="text-sm text-gray-400">Select recipient…</span>
                        }
                      </div>
                      <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <HiChevronDown size={15} className="text-gray-400 flex-shrink-0" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0,  scale: 1    }}
                          exit={{    opacity: 0, y: -6, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden max-h-64 flex flex-col"
                        >
                          {/* Search */}
                          <div className="p-2.5 border-b border-gray-50">
                            <div className="relative">
                              <HiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text" value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or email…"
                                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:border-primary-600 focus:bg-white outline-none transition-all"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* List */}
                          <div className="overflow-y-auto flex-1 py-1">
                            {filtered.length > 0
                              ? filtered.map((u) => (
                                  <button
                                    type="button" key={u.uid}
                                    onClick={() => { setForm((p) => ({ ...p, recipient: u.uid })); setDropdownOpen(false); setSearchQuery(""); }}
                                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors
                                      ${form.recipient === u.uid ? "bg-primary-600/5" : "hover:bg-gray-50"}`}
                                  >
                                    <Avatar name={u.full_name} size="sm" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-bold text-gray-800 truncate">{u.full_name}</p>
                                      <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                                    </div>
                                    {form.recipient === u.uid && (
                                      <HiCheckCircle size={14} className="text-primary-600 flex-shrink-0" />
                                    )}
                                  </button>
                                ))
                              : (
                                <div className="px-4 py-6 text-center">
                                  <p className="text-xs text-gray-400">No users found</p>
                                </div>
                              )
                            }
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
                    <input
                      type="number" value={form.amount}
                      onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="0.00" min={1} required
                      className="w-full pl-8 pr-4 py-3 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Transfer preview */}
                <AnimatePresence>
                  {selectedUser && amountNum > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{    opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                        <Avatar name={selectedUser.full_name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-400">Sending to</p>
                          <p className="text-xs font-bold text-gray-800 truncate">{selectedUser.full_name}</p>
                        </div>
                        <HiArrowRight size={13} className="text-gray-300 flex-shrink-0" />
                        <span className="text-sm font-extrabold text-emerald-600 flex-shrink-0">
                          ${amountNum.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                    ${canSubmit
                      ? "bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-600/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {submitting
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Processing…</>
                    : <><HiPaperAirplane size={13} /> Send Funds</>
                  }
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* ── Transfer History ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <HiClock size={15} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Recent Transfers</p>
                <p className="text-[11px] text-gray-400">Last 10 admin-funded transactions</p>
              </div>
            </div>
            {history.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-100">
                {history.length} records
              </span>
            )}
          </div>

          {/* Mobile cards */}
          <div className="tab:hidden p-4 flex flex-col gap-3">
            {usersLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : history.length === 0
              ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <HiArrowsRightLeft size={20} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">No transfer history yet</p>
                </div>
              )
              : history.map((item, i) => <HistoryCard key={i} item={item} index={i} />)
            }
          </div>

          {/* Desktop table */}
          <div className="hidden tab:block overflow-x-auto admin-table-wrap">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  {["#", "Recipient", "Amount", "Date & Time"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usersLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        {[40, 55, 20, 35].map((w, j) => (
                          <td key={j} className="px-4 py-3.5">
                            <div className="h-3 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${w}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  : history.length === 0
                  ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <HiArrowsRightLeft size={18} className="text-gray-300" />
                          </div>
                          <p className="text-sm text-gray-400">No transfer history yet</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : history.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3.5 text-xs text-gray-400 font-medium">{i + 1}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={item.full_name} size="sm" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">{item.full_name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{item.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-extrabold">
                            +${item.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">{item.created_at}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Transfer;

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSearch } from "react-icons/bi";
import {
  HiPlus, HiX, HiChevronDown, HiEye,
  HiShieldCheck, HiBan,
} from "react-icons/hi";
import { MdStorefront } from "react-icons/md";
import { getAllUsers } from "../../../components/backendApis/admin/apis/users";
import Pagination from "../partials/pagination";

/* ─── Animation ──────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.38, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

/* ─── Avatar (React-safe) ────────────────────────────────────────── */
const COLORS = [
  "bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-purple-100 text-purple-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
];
const colorFor = (str = "") => COLORS[str.charCodeAt(0) % COLORS.length];

const MerchantAvatar = ({ src, name }) => {
  const [err, setErr] = useState(false);
  const label = (name || "M").slice(0, 2).toUpperCase();
  if (err || !src)
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${colorFor(name)}`}>
        {label}
      </div>
    );
  return (
    <img src={src} alt={name} onError={() => setErr(true)}
      className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
  );
};

/* ─── Status badge ───────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const active = status === 1 || String(status) === "1";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border
      ${active
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : "bg-red-50 text-red-700 border-red-100"
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? "bg-emerald-500" : "bg-red-500"}`} />
      {active ? "Active" : "Suspended"}
    </span>
  );
};

/* ─── Stat pill ──────────────────────────────────────────────────── */
const StatPill = ({ icon: Icon, label, value, color, loading }) => (
  <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${color}`}>
    <Icon size={15} className="flex-shrink-0 opacity-80" />
    <div>
      {loading
        ? <div className="h-3.5 w-8 bg-current opacity-20 rounded animate-pulse" />
        : <p className="text-sm font-extrabold leading-none">{value}</p>
      }
      <p className="text-[10px] font-semibold opacity-60 mt-0.5 whitespace-nowrap">{label}</p>
    </div>
  </div>
);

/* ─── Table helpers ──────────────────────────────────────────────── */
const Th = ({ children, right = false }) => (
  <th className={`px-5 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap
    ${right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-5 py-4 text-sm text-gray-700 ${className}`}>{children}</td>
);

/* ─── Skeleton row ───────────────────────────────────────────────── */
const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[20, 45, 30, 35, 25, 28, 22].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-3 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${w + (i * 9) % 30}%` }} />
      </td>
    ))}
  </tr>
);

/* ─── Mobile merchant card ───────────────────────────────────────── */
const MobileMerchantCard = ({ m, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.025, ease: "easeOut" }}
    className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
  >
    <MerchantAvatar src={m.avatar} name={m.full_name || m.username} />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 leading-none truncate">{m.full_name || "—"}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">@{m.username || "—"} · {m.email || "—"}</p>
        </div>
        <StatusBadge status={m.status} />
      </div>
      <div className="flex items-center justify-between mt-2.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-medium text-gray-500 truncate">{m.country || "—"}</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs font-bold text-gray-700">${Number(m.account_balance || 0).toLocaleString()}</span>
        </div>
        <NavLink to={`/admin/vendor/edit/${m.uid}`}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-bold rounded-lg transition-all">
          <HiEye size={11} /> Manage
        </NavLink>
      </div>
    </div>
  </motion.div>
);

/* ─── Main component ─────────────────────────────────────────────── */
const MerchantPage = () => {
  const [merchants,    setMerchants]    = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage,  setCurrentPage]  = useState(1);
  const ITEMS = 50;

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          const only = res.data.filter((u) => u.role?.toLowerCase() === "merchant");
          setMerchants(only);
          setFiltered(only);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let f = [...merchants];
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      f = f.filter(
        (m) => m.username?.toLowerCase().includes(t) ||
               m.email?.toLowerCase().includes(t) ||
               m.full_name?.toLowerCase().includes(t)
      );
    }
    if (statusFilter !== "") f = f.filter((m) => String(m.status) === statusFilter);
    setFiltered(f);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, merchants]);

  const last         = currentPage * ITEMS;
  const first        = last - ITEMS;
  const current      = filtered.slice(first, last);
  const totalPages   = Math.ceil(filtered.length / ITEMS);
  const activeCount  = merchants.filter((m) => m.status === 1 || String(m.status) === "1").length;
  const suspendCount = merchants.length - activeCount;
  const hasFilters   = searchTerm || statusFilter;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Merchant Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">View, manage, and onboard merchant accounts</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Stat pills */}
          <div className="flex items-center gap-2">
            <StatPill icon={MdStorefront}  label="Total"     value={merchants.length.toLocaleString()} color="bg-orange-50 border-orange-100 text-orange-700"   loading={loading} />
            <StatPill icon={HiShieldCheck} label="Active"    value={activeCount.toLocaleString()}       color="bg-emerald-50 border-emerald-100 text-emerald-700" loading={loading} />
            <StatPill icon={HiBan}         label="Suspended" value={suspendCount.toLocaleString()}      color="bg-red-50 border-red-100 text-red-700"             loading={loading} />
          </div>

          {/* Add button */}
          <NavLink to="/admin/vendor/create"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700
              active:bg-primary-800 text-white text-xs font-bold rounded-xl transition-all
              shadow-sm shadow-primary-600/25 hover:shadow-md hover:shadow-primary-600/30">
            <HiPlus size={14} /> Add Merchant
          </NavLink>
        </div>
      </motion.div>

      {/* ── Main card ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search name, username or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10
                transition-all placeholder:text-gray-400 text-gray-800"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <HiX size={14} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200
                rounded-xl focus:outline-none focus:border-primary-600 transition-all text-gray-700 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="1">Active</option>
              <option value="0">Suspended</option>
            </select>
            <HiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Result count + clear */}
          <div className="flex items-center gap-2 ml-auto">
            {hasFilters && (
              <button onClick={() => { setSearchTerm(""); setStatusFilter(""); }}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                <HiX size={11} /> Clear
              </button>
            )}
            <span className="text-xs font-bold text-gray-400 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
              {filtered.length.toLocaleString()} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Mobile card list — below tab */}
        <div className="tab:hidden">
          {loading
            ? <div className="animate-pulse divide-y divide-gray-50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-2/5" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                    </div>
                    <div className="h-5 bg-gray-100 rounded-full w-16" />
                  </div>
                ))}
              </div>
            : current.length > 0
              ? current.map((m, i) => <MobileMerchantCard key={m.uid} m={m} i={i} />)
              : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                    <MdStorefront size={22} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">No merchants found</p>
                  <p className="text-xs text-gray-300 mt-0.5">Try adjusting your search or filters</p>
                </div>
              )
          }
        </div>

        {/* Desktop table — tab and above */}
        <div className="hidden tab:block overflow-x-auto admin-table-wrap">
          <table className="w-full text-left">
            <thead className="bg-gray-50/60 border-b border-gray-100">
              <tr>
                <Th>#</Th>
                <Th>Merchant</Th>
                <Th>Username</Th>
                <Th>Country</Th>
                <Th right>Balance</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : current.length > 0
                  ? current.map((m, i) => (
                      <motion.tr key={m.uid}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <Td className="w-10 text-gray-300 font-bold text-xs">
                          {String(first + i + 1).padStart(2, "0")}
                        </Td>

                        <Td>
                          <div className="flex items-center gap-3">
                            <MerchantAvatar src={m.avatar} name={m.full_name || m.username} />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-800 leading-none truncate">{m.full_name || "—"}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[180px]">{m.email || "—"}</p>
                            </div>
                          </div>
                        </Td>

                        <Td>
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                            @{m.username || "—"}
                          </span>
                        </Td>

                        <Td>
                          <span className="text-xs font-medium text-gray-600">{m.country || "—"}</span>
                        </Td>

                        <Td className="text-right">
                          <span className="text-sm font-extrabold text-gray-800">
                            ${Number(m.account_balance || 0).toLocaleString()}
                          </span>
                        </Td>

                        <Td><StatusBadge status={m.status} /></Td>

                        <Td>
                          <NavLink to={`/admin/vendor/edit/${m.uid}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700
                              active:bg-primary-800 text-white text-xs font-bold rounded-xl transition-all
                              shadow-sm shadow-primary-600/20 group-hover:shadow-md">
                            <HiEye size={12} /> Manage
                          </NavLink>
                        </Td>
                      </motion.tr>
                    ))
                  : (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <MdStorefront size={22} className="text-gray-300" />
                          </div>
                          <p className="text-sm font-semibold text-gray-400">No merchants found</p>
                          <p className="text-xs text-gray-300">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-5 py-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-bold text-gray-600">{first + 1}–{Math.min(last, filtered.length)}</span>
              {" "}of{" "}
              <span className="font-bold text-gray-600">{filtered.length.toLocaleString()}</span> merchants
            </p>
            {totalPages > 1 && (
              <Pagination totalPages={totalPages} initialPage={currentPage} onPageChange={setCurrentPage} />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MerchantPage;

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSearch } from "react-icons/bi";
import {
  HiEye, HiX, HiUsers, HiShieldCheck,
  HiBan, HiChevronDown,
} from "react-icons/hi";
import { MdStorefront } from "react-icons/md";
import { getAllUsers } from "../../../../components/backendApis/admin/apis/users";
import Pagination from "../../partials/pagination";

/* ─── Animation ──────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.38, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};

/* ─── Avatar (React-safe fallback) ──────────────────────────────── */
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-pink-100 text-pink-600",
  "bg-indigo-100 text-indigo-600",
  "bg-teal-100 text-teal-600",
  "bg-rose-100 text-rose-600",
];
const colorFor = (str = "") =>
  AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const UserAvatar = ({ src, name }) => {
  const [err, setErr] = useState(false);
  const initials = (name || "U")[0].toUpperCase();
  if (err || !src)
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${colorFor(name)}`}>
        {initials}
      </div>
    );
  return (
    <img src={src} alt={name} onError={() => setErr(true)}
      className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
  );
};

/* ─── Badges ─────────────────────────────────────────────────────── */
const RoleBadge = ({ role }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border
    ${role === "merchant"
      ? "bg-orange-50 text-orange-700 border-orange-100"
      : "bg-blue-50 text-blue-700 border-blue-100"
    }`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${role === "merchant" ? "bg-orange-500" : "bg-blue-500"}`} />
    {role || "user"}
  </span>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border
    ${status === 1
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-red-50 text-red-700 border-red-100"
    }`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 1 ? "bg-emerald-500" : "bg-red-500"}`} />
    {status === 1 ? "Active" : "Suspended"}
  </span>
);

/* ─── Stat pill ──────────────────────────────────────────────────── */
const StatPill = ({ icon: Icon, label, value, color, loading }) => (
  <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${color}`}>
    <Icon size={16} className="flex-shrink-0 opacity-80" />
    <div>
      {loading
        ? <div className="h-3.5 w-10 bg-current opacity-20 rounded animate-pulse" />
        : <p className="text-sm font-extrabold leading-none">{value}</p>
      }
      <p className="text-[10px] font-semibold opacity-60 mt-0.5 whitespace-nowrap">{label}</p>
    </div>
  </div>
);

/* ─── Skeleton row ───────────────────────────────────────────────── */
const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[30, 40, 55, 25, 30, 35, 28, 22].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-3 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${w + (i * 7) % 25}%` }} />
      </td>
    ))}
  </tr>
);

/* ─── Mobile user card ───────────────────────────────────────────── */
const MobileUserCard = ({ user, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.025, ease: "easeOut" }}
    className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
  >
    <UserAvatar src={user.avatar} name={user.full_name} />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 leading-none truncate">{user.full_name || "—"}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{user.email || "—"}</p>
        </div>
        <StatusBadge status={user.status} />
      </div>
      <div className="flex items-center justify-between mt-2.5 gap-2">
        <div className="flex items-center gap-1.5">
          <RoleBadge role={user.role} />
          <span className="text-[10px] text-gray-400">{user.country || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">${Number(user.account_balance || 0).toLocaleString()}</span>
          <NavLink to={`/admin/users/${user.uid}`}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-all">
            <HiEye size={11} /> View
          </NavLink>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ─── Table helpers ──────────────────────────────────────────────── */
const Th = ({ children, right = false, className = "" }) => (
  <th className={`px-5 py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap
    ${right ? "text-right" : "text-left"} ${className}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-5 py-4 text-sm text-gray-700 ${className}`}>{children}</td>
);

/* ─── Main component ─────────────────────────────────────────────── */
const User = () => {
  const [users,       setUsers]       = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatus]      = useState("");
  const [roleFilter,  setRole]        = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS = 50;

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const data = res?.success && Array.isArray(res.data) ? res.data : [];
        setUsers(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...users];
    if (search.trim()) {
      const t = search.toLowerCase();
      result = result.filter(
        (u) => u.username?.toLowerCase().includes(t) ||
               u.email?.toLowerCase().includes(t) ||
               u.full_name?.toLowerCase().includes(t)
      );
    }
    if (statusFilter !== "") result = result.filter((u) => String(u.status) === statusFilter);
    if (roleFilter   !== "") result = result.filter((u) => u.role === roleFilter);
    setFiltered(result);
    setCurrentPage(1);
  }, [search, statusFilter, roleFilter, users]);

  const totalPages   = Math.ceil(filtered.length / ITEMS);
  const start        = (currentPage - 1) * ITEMS;
  const currentUsers = filtered.slice(start, start + ITEMS);

  const activeCount   = users.filter((u) => u.status === 1).length;
  const suspendCount  = users.filter((u) => u.status !== 1).length;
  const merchantCount = users.filter((u) => u.role === "merchant").length;

  const clearFilters = () => { setSearch(""); setStatus(""); setRole(""); };
  const hasFilters   = search || statusFilter || roleFilter;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Users Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all registered platform accounts</p>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap items-center gap-2">
          <StatPill icon={HiUsers}      label="Total"     value={users.length.toLocaleString()}    color="bg-gray-50 border-gray-200 text-gray-700"         loading={loading} />
          <StatPill icon={HiShieldCheck} label="Active"   value={activeCount.toLocaleString()}      color="bg-emerald-50 border-emerald-100 text-emerald-700" loading={loading} />
          <StatPill icon={HiBan}        label="Suspended" value={suspendCount.toLocaleString()}     color="bg-red-50 border-red-100 text-red-700"             loading={loading} />
          <StatPill icon={MdStorefront} label="Merchants" value={merchantCount.toLocaleString()}    color="bg-orange-50 border-orange-100 text-orange-700"    loading={loading} />
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
              placeholder="Search name, email or username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10
                transition-all placeholder:text-gray-400 text-gray-800"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <HiX size={14} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:border-primary-600 transition-all text-gray-700 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="1">Active</option>
              <option value="0">Suspended</option>
            </select>
            <HiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Role filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:border-primary-600 transition-all text-gray-700 cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
            <HiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Result count + clear */}
          <div className="flex items-center gap-2 ml-auto">
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                <HiX size={11} /> Clear
              </button>
            )}
            <span className="text-xs font-bold text-gray-400 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
              {filtered.length.toLocaleString()} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Mobile list — below tab */}
        <div className="tab:hidden">
          {loading
            ? <div className="animate-pulse divide-y divide-gray-50">
                {Array.from({ length: 6 }).map((_, i) => (
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
            : currentUsers.length > 0
              ? currentUsers.map((user, idx) => <MobileUserCard key={user.uid} user={user} idx={idx} />)
              : <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                    <HiUsers size={22} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">No users found</p>
                  <p className="text-xs text-gray-300 mt-0.5">Try adjusting your filters</p>
                </div>
          }
        </div>

        {/* Desktop table — tab and above */}
        <div className="hidden tab:block overflow-x-auto admin-table-wrap">
          <table className="w-full text-left">
            <thead className="bg-gray-50/60 border-b border-gray-100">
              <tr>
                <Th>#</Th>
                <Th>User</Th>
                <Th>Role</Th>
                <Th>Country</Th>
                <Th right>Balance</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : currentUsers.length > 0
                  ? currentUsers.map((user, idx) => (
                      <motion.tr
                        key={user.uid}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <Td className="w-10 text-gray-300 font-bold text-xs">
                          {String(start + idx + 1).padStart(2, "0")}
                        </Td>

                        <Td>
                          <div className="flex items-center gap-3">
                            <UserAvatar src={user.avatar} name={user.full_name} />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-800 leading-none truncate">{user.full_name || "—"}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[180px]">{user.email || "—"}</p>
                            </div>
                          </div>
                        </Td>

                        <Td><RoleBadge role={user.role} /></Td>

                        <Td>
                          <span className="text-xs font-medium text-gray-600">{user.country || "—"}</span>
                        </Td>

                        <Td className="text-right">
                          <span className="text-sm font-extrabold text-gray-800">
                            ${Number(user.account_balance || 0).toLocaleString()}
                          </span>
                        </Td>

                        <Td><StatusBadge status={user.status} /></Td>

                        <Td>
                          <NavLink to={`/admin/users/${user.uid}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700
                              active:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm
                              shadow-slate-800/20 group-hover:shadow-md">
                            <HiEye size={12} /> View
                          </NavLink>
                        </Td>
                      </motion.tr>
                    ))
                  : (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <HiUsers size={22} className="text-gray-300" />
                          </div>
                          <p className="text-sm font-semibold text-gray-400">No users found</p>
                          <p className="text-xs text-gray-300">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        </div>

        {/* Footer — pagination + count */}
        {!loading && (
          <div className="px-5 py-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              Showing <span className="font-bold text-gray-600">{start + 1}–{Math.min(start + ITEMS, filtered.length)}</span> of{" "}
              <span className="font-bold text-gray-600">{filtered.length.toLocaleString()}</span> users
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

export default User;

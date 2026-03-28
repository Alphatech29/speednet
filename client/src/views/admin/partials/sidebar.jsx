import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiViewGrid, HiChevronDown, HiShieldCheck, HiX,
} from "react-icons/hi";
import { SiNordvpn } from "react-icons/si";
import { FaUsers, FaCartShopping, FaPercent } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { PiUsersFourLight } from "react-icons/pi";
import { MdOutlineAccountTree, MdCampaign, MdShortText } from "react-icons/md";
import { TbMessageReport, TbTransfer } from "react-icons/tb";
import { BiHistory } from "react-icons/bi";
import { GiBookPile } from "react-icons/gi";
import { LiaFirstOrder } from "react-icons/lia";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

/* ─── Navigation data ────────────────────────────────────────────── */
const OVERVIEW = [
  { to: "/admin/dashboard",  icon: HiViewGrid, label: "Dashboard"  },
  { to: "/admin/nord-admin", icon: SiNordvpn,  label: "Nord Admin" },
  { to: "/admin/users",      icon: FaUsers,    label: "Users"      },
];

const GROUPS = [
  {
    label: "Merchants",
    icon: PiUsersFourLight,
    children: [
      { to: "/admin/vendor",        label: "Merchant List"    },
      { to: "/admin/vendor/create", label: "Create Merchant"  },
    ],
  },
  {
    label: "Shopping",
    icon: FaCartShopping,
    children: [
      { to: "/admin/shopping/product",            label: "Products"    },
      { to: "/admin/shopping/product/categories", label: "Categories"  },
    ],
  },
  {
    label: "History",
    icon: BiHistory,
    children: [
      { to: "/admin/histroy/transaction", label: "Transactions"     },
      { to: "/admin/histroy/merchant",    label: "Merchant History" },
    ],
  },
];

const OPERATIONS = [
  { to: "/admin/announcement",        icon: MdCampaign,             label: "Announcements"   },
  { to: "/admin/short-notice",        icon: MdShortText,            label: "Short Notices"   },
  { to: "/admin/transfer",            icon: TbTransfer,             label: "Transfers"       },
  { to: "/admin/darkshop-commission", icon: FaPercent,              label: "DS Commission"   },
  { to: "/admin/platform",            icon: MdOutlineAccountTree,   label: "Platforms"       },
  { to: "/admin/products",            icon: FaCartShopping,         label: "Products"        },
  { to: "/admin/page",                icon: GiBookPile,             label: "Pages"           },
  { to: "/admin/report",              icon: TbMessageReport,        label: "Reports"         },
  { to: "/admin/order",               icon: LiaFirstOrder,          label: "Purchase Orders" },
  { to: "/admin/withdrawal",          icon: RiMoneyDollarCircleLine,label: "Withdrawals"     },
  { to: "/admin/settings",            icon: IoMdSettings,           label: "Settings"        },
];

/* ─── Section label ──────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <p className="px-4 pt-4 pb-1.5 text-[9px] font-extrabold text-slate-600 uppercase tracking-[0.18em]">
    {children}
  </p>
);

/* ─── Thin divider ───────────────────────────────────────────────── */
const Divider = () => <div className="mx-4 my-1 border-t border-white/[0.06]" />;

/* ─── Single nav link ────────────────────────────────────────────── */
const NavItem = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(to + "/");

  return (
    <NavLink
      to={to}
      className={`relative overflow-hidden flex items-center gap-3 mx-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group
        ${isActive
          ? "bg-gradient-to-r from-primary-600/20 to-transparent text-primary-400 border border-primary-600/20 shadow-sm shadow-primary-600/10"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
        }`}
    >
      {/* Left accent strip */}
      <span
        className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-150
          ${isActive ? "bg-primary-500 opacity-100" : "opacity-0 bg-primary-500"}`}
      />

      <span className={`flex-shrink-0 transition-colors ${isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300"}`}>
        <Icon size={16} />
      </span>

      <span className="flex-1 truncate leading-none">{label}</span>

      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 shadow-sm shadow-primary-500/60" />
      )}
    </NavLink>
  );
};

/* ─── Accordion group ────────────────────────────────────────────── */
const NavGroup = ({ label, icon: Icon, children }) => {
  const location  = useLocation();
  const anyActive = children.some((c) => location.pathname.startsWith(c.to));
  const [open, setOpen] = useState(anyActive);

  return (
    <div className="mx-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 border
          ${anyActive
            ? "text-primary-400 bg-primary-600/10 border-primary-600/20"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent"
          }`}
      >
        <Icon size={16} className="flex-shrink-0" />
        <span className="flex-1 text-left leading-none truncate">{label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={anyActive ? "text-primary-400" : "text-slate-600"}
        >
          <HiChevronDown size={13} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-5 pl-3 border-l border-white/[0.08] flex flex-col gap-0.5 py-1.5">
              {children.map((c) => (
                <NavLink
                  key={c.to}
                  to={c.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-xs font-medium transition-all
                     ${isActive
                       ? "bg-primary-600/20 text-primary-400"
                       : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                     }`
                  }
                >
                  {c.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Sidebar ────────────────────────────────────────────────────── */
const Sidebar = ({ onClose }) => (
  <div className="h-full bg-slate-950 flex flex-col select-none">

    {/* ── Brand / Logo ── */}
    <div className="flex-shrink-0 px-4 py-4 border-b border-white/[0.06]">
      <div className="flex items-center gap-3">

        <div className="flex-1 min-w-0">
          <a href="/admin/dashboard" className="block">
            <img
              src="/image/user-logo.png"
              alt="SpeedNet"
              className="h-6 w-auto object-contain brightness-200 max-w-[110px]"
            />
          </a>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Admin Portal</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary-600/20 text-primary-500 font-bold">v2.0</span>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="pc:hidden flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <HiX size={14} />
          </button>
        )}
      </div>
    </div>

    {/* ── Scrollable nav ── */}
    <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-4 space-y-0.5 sidebar-nav">

      <SectionLabel>Overview</SectionLabel>
      {OVERVIEW.map((n) => <NavItem key={n.to} {...n} />)}

      <Divider />
      <SectionLabel>Management</SectionLabel>
      {GROUPS.map((g) => <NavGroup key={g.label} {...g} />)}

      <Divider />
      <SectionLabel>Operations</SectionLabel>
      {OPERATIONS.map((n) => <NavItem key={n.to} {...n} />)}
    </nav>

    {/* ── Admin profile footer ── */}
    <div className="flex-shrink-0 border-t border-white/[0.06] px-4 py-3.5">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-default">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600/70 to-orange-700/70 flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
            A
          </div>
          {/* Online dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-sm shadow-emerald-500/40" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-slate-200 leading-none truncate">Administrator</p>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate">Super Admin</p>
        </div>

        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
      </div>
    </div>
  </div>
);

export default Sidebar;

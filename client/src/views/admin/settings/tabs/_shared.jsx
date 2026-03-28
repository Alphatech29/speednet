/**
 * Shared UI primitives for Settings tabs.
 * Import from here to keep every tab visually consistent.
 */
import { useState } from "react";
import { HiPencil, HiCheck, HiX, HiEye, HiEyeOff } from "react-icons/hi";

/* ── Gradient accent line ───────────────────────────────────── */
export const AccentLine = () => (
  <div className="h-0.5 w-full bg-gradient-to-r from-primary-600 via-orange-400 to-transparent" />
);

/* ── Section card wrapper ────────────────────────────────────── */
export const SectionCard = ({ children, className = "" }) => (
  <div className={`bg-gray-50/70 border border-gray-100 rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

/* ── Section header inside a card ───────────────────────────── */
export const SectionHeader = ({ title, subtitle, icon: Icon, iconClass = "bg-blue-50 text-blue-500" }) => (
  <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100 bg-white">
    {Icon && (
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${iconClass}`}>
        <Icon size={15} />
      </div>
    )}
    <div>
      <p className="text-sm font-bold text-gray-800">{title}</p>
      {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

/* ── Edit / Save / Cancel toolbar ───────────────────────────── */
export const EditBar = ({ editing, saving, onEdit, onSave, onCancel, dirty }) => (
  <div className="flex items-center gap-2 flex-shrink-0">
    {!editing ? (
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:border-primary-600/40 hover:text-primary-600 text-gray-600 text-xs font-bold rounded-xl shadow-sm transition-all"
      >
        <HiPencil size={12} /> Edit
      </button>
    ) : (
      <>
        {dirty && (
          <span className="hidden tab:inline text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
            Unsaved
          </span>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all"
        >
          {saving
            ? <><div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
            : <><HiCheck size={12} /> Save</>
          }
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all"
        >
          <HiX size={12} /> Cancel
        </button>
      </>
    )}
  </div>
);

/* ── Tab page header ─────────────────────────────────────────── */
export const TabHeader = ({ title, subtitle, children }) => (
  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
    <div>
      <p className="text-base font-extrabold text-gray-900">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

/* ── Input field ─────────────────────────────────────────────── */
export const Field = ({ label, id, name, value, onChange, readOnly, sensitive, type = "text", placeholder, step }) => {
  const [show, setShow] = useState(false);
  const inputType = sensitive ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id || name} className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          id={id || name}
          name={name || id}
          type={inputType}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          step={step ?? (type === "number" ? "0.01" : undefined)}
          className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none
            ${sensitive ? "pr-10" : ""}
            ${readOnly
              ? "bg-white border-gray-100 text-gray-500 cursor-default"
              : "bg-white border-gray-200 text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
            }`}
        />
        {sensitive && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
          >
            {show ? <HiEyeOff size={15} /> : <HiEye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Fields grid ─────────────────────────────────────────────── */
export const FieldGrid = ({ children, cols = "tab:grid-cols-2" }) => (
  <div className={`grid grid-cols-1 ${cols} gap-4`}>
    {children}
  </div>
);

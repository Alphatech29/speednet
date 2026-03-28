import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { getUserById, updateUser } from "../../../../components/backendApis/admin/apis/users";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeft, HiPencil, HiCheck, HiX } from "react-icons/hi";

const FIELDS = [
  { id: "full_name",        label: "Full Name" },
  { id: "email",            label: "Email",            type: "email" },
  { id: "username",         label: "Username" },
  { id: "phone_number",     label: "Phone Number",     type: "tel" },
  { id: "country",          label: "Country" },
  { id: "account_balance",  label: "Account Balance",  type: "number" },
  { id: "merchant_balance", label: "Merchant Balance", type: "number" },
  { id: "referral_balance", label: "Referral Balance", type: "number" },
  { id: "escrow_balance",   label: "Escrow Balance",   type: "number" },
];

const Field = ({ id, label, type = "text", value, onChange, readOnly }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold text-gray-500">{label}</label>
    <input
      id={id} type={type} value={value ?? ""} onChange={onChange} readOnly={readOnly}
      className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
        readOnly
          ? "bg-gray-50 border-gray-100 text-gray-500 cursor-default"
          : "bg-white border-gray-200 text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
      }`}
    />
  </div>
);

const SelectField = ({ id, label, value, onChange, disabled, options }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold text-gray-500">{label}</label>
    <select
      id={id} value={value || ""} onChange={onChange} disabled={disabled}
      className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
        disabled
          ? "bg-gray-50 border-gray-100 text-gray-500 cursor-default"
          : "bg-white border-gray-200 text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
      }`}
    >
      {options.map(({ value: v, label: l }) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  </div>
);

const EditUser = () => {
  const { uid } = useParams();
  const [user, setUser]       = useState(null);
  const [form, setForm]       = useState({});
  const [initial, setInitial] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getUserById(uid);
      if (res?.success) {
        setUser(res.data);
        setForm(res.data);
        setInitial(res.data);
      } else toast.error("Failed to fetch user");
    })();
  }, [uid]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((p) => ({ ...p, [id]: value }));
  };

  const handleSave = async () => {
    const changed = {};
    Object.keys(form).forEach((k) => { if (form[k] !== initial[k]) changed[k] = form[k]; });
    if (!Object.keys(changed).length) { toast.info("No changes to save"); return; }
    setSaving(true);
    try {
      const res = await updateUser(uid, changed);
      if (res?.success) {
        toast.success(res.data?.message || "User updated successfully");
        setInitial(form);
        setEditing(false);
      } else toast.error(res?.message || "Failed to update user");
    } catch { toast.error("Unexpected error"); }
    setSaving(false);
  };

  if (!user) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400">Loading user...</p>
      </div>
    </div>
  );

  const avatar = user.profile_picture;
  const initials = (user.full_name || user.username || "U").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <NavLink to="/admin/users"
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-all">
            <HiArrowLeft size={14} />
          </NavLink>
          <div>
            <p className="text-sm font-bold text-gray-800">Edit User</p>
            <p className="text-xs text-gray-400 mt-0.5">Modify account details and permissions</p>
          </div>
        </div>

        <div className="flex gap-2">
          {!editing
            ? <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all">
                <HiPencil size={12} /> Edit
              </button>
            : <>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all">
                  <HiCheck size={12} /> {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setForm(initial); setEditing(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-all">
                  <HiX size={12} /> Cancel
                </button>
              </>
          }
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-wrap items-center gap-4">
        {avatar
          ? <img src={avatar} alt={user.full_name} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
              className="w-14 h-14 rounded-2xl object-cover border border-gray-100" />
          : null
        }
        <div className={`w-14 h-14 rounded-2xl bg-primary-600/10 text-primary-600 font-bold text-lg items-center justify-center ${avatar ? "hidden" : "flex"}`}>
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{user.full_name || user.username}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
              user.role === "merchant" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
            }`}>{user.role}</span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
              String(user.status) === "1" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>{String(user.status) === "1" ? "Active" : "Suspended"}</span>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account Information</p>
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-4">
          {FIELDS.map((f) => (
            <Field key={f.id} {...f} value={form[f.id]} onChange={handleChange} readOnly={!editing} />
          ))}
          <SelectField id="role" label="Role" value={form.role} onChange={handleChange} disabled={!editing}
            options={[
              { value: "", label: "Select Role" },
              { value: "user", label: "User" },
              { value: "merchant", label: "Merchant" },
            ]}
          />
          <SelectField id="status" label="Status" value={String(form.status ?? "")} onChange={handleChange} disabled={!editing}
            options={[
              { value: "", label: "Select Status" },
              { value: "1", label: "Active" },
              { value: "0", label: "Suspended" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default EditUser;

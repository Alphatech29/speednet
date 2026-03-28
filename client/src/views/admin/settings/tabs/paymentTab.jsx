import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { getWebSettings, updateWebSettings } from "../../../../components/backendApis/admin/apis/settings";
import { AccentLine, EditBar, Field, FieldGrid, TabHeader } from "./_shared";

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Provider icons ─────────────────────────────────────────── */
const PROVIDER_COLORS = {
  fapshi:    { bg: "bg-blue-50",   dot: "bg-blue-500",    text: "text-blue-700",   border: "border-blue-100"   },
  cryptomus: { bg: "bg-purple-50", dot: "bg-purple-500",  text: "text-purple-700", border: "border-purple-100" },
  monnify:   { bg: "bg-emerald-50",dot: "bg-emerald-500", text: "text-emerald-700",border: "border-emerald-100"},
};

/* ── Provider card ──────────────────────────────────────────── */
const ProviderCard = ({ provider, title, desc, fields, editing, formData, settings, onEdit, onSave, onCancel, onChange, saving, index }) => {
  const colors = PROVIDER_COLORS[provider] || PROVIDER_COLORS.fapshi;
  const dirty  = fields.some((f) => (formData[f.name] ?? "") !== (settings[f.name] ?? ""));

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <AccentLine />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-extrabold ${colors.bg} ${colors.text} ${colors.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {title}
          </div>
        </div>
        <EditBar editing={editing} saving={saving} onEdit={onEdit} onSave={onSave} onCancel={onCancel} dirty={dirty} />
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 px-5 pt-3 pb-0">{desc}</p>

      {/* Fields */}
      <div className="p-5">
        <FieldGrid>
          {fields.map(({ label, name, sensitive, type }) => (
            <Field
              key={name}
              label={label}
              id={name}
              name={name}
              value={editing ? (formData[name] ?? "") : (settings[name] ?? "")}
              onChange={(e) => onChange(e, provider)}
              readOnly={!editing}
              sensitive={sensitive}
              type={type}
            />
          ))}
        </FieldGrid>
      </div>
    </motion.div>
  );
};

/* ── Component ──────────────────────────────────────────────── */
const PaymentTab = () => {
  const blank = {
    fapshi_url: "", fapshi_user: "", fapshi_key: "",
    cryptomus_url: "", cryptomus_merchant_uuid: "", cryptomus_api_key: "",
    monnify_baseUrl: "", monnify_apiKey: "", monnify_secretKey: "", monnify_contractCode: "",
  };

  const [settings, setSettings] = useState(blank);
  const [formData, setFormData] = useState({
    fapshi:    { fapshi_url: "", fapshi_user: "", fapshi_key: "" },
    cryptomus: { cryptomus_url: "", cryptomus_merchant_uuid: "", cryptomus_api_key: "" },
    monnify:   { monnify_baseUrl: "", monnify_apiKey: "", monnify_secretKey: "", monnify_contractCode: "" },
  });
  const [editing, setEditing] = useState({ fapshi: false, cryptomus: false, monnify: false });
  const [saving,  setSaving]  = useState({ fapshi: false, cryptomus: false, monnify: false });

  useEffect(() => {
    getWebSettings().then((res) => {
      if (!res.success) { toast.error(res.message); return; }
      const d = Array.isArray(res.data) ? res.data[0] : res.data;
      const filled = Object.fromEntries(Object.keys(blank).map((k) => [k, d[k] || ""]));
      setSettings(filled);
      setFormData({
        fapshi:    { fapshi_url: d.fapshi_url||"",    fapshi_user: d.fapshi_user||"",    fapshi_key: d.fapshi_key||""   },
        cryptomus: { cryptomus_url: d.cryptomus_url||"", cryptomus_merchant_uuid: d.cryptomus_merchant_uuid||"", cryptomus_api_key: d.cryptomus_api_key||"" },
        monnify:   { monnify_baseUrl: d.monnify_baseUrl||"", monnify_apiKey: d.monnify_apiKey||"", monnify_secretKey: d.monnify_secretKey||"", monnify_contractCode: d.monnify_contractCode||"" },
      });
    }).catch((err) => toast.error(err.message));
  }, []);

  const handleChange = (e, provider) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [provider]: { ...prev[provider], [name]: value } }));
  };

  const handleEdit   = (p) => setEditing((prev) => ({ ...prev, [p]: true  }));
  const handleCancel = (p) => {
    setFormData((prev) => ({ ...prev, [p]: Object.fromEntries(Object.keys(prev[p]).map((k) => [k, settings[k]])) }));
    setEditing((prev) => ({ ...prev, [p]: false }));
  };
  const handleSave = async (p) => {
    const payload = {};
    Object.keys(formData[p]).forEach((k) => { if (formData[p][k] !== settings[k]) payload[k] = formData[p][k]; });
    if (!Object.keys(payload).length) { toast.info("No changes"); setEditing((prev) => ({ ...prev, [p]: false })); return; }
    setSaving((prev) => ({ ...prev, [p]: true }));
    try {
      const res = await updateWebSettings(payload);
      if (!res.success) throw new Error(res.message);
      setSettings((prev) => ({ ...prev, ...payload }));
      setEditing((prev) => ({ ...prev, [p]: false }));
      toast.success(`${p.charAt(0).toUpperCase() + p.slice(1)} settings saved`);
    } catch (err) { toast.error(err.message); }
    setSaving((prev) => ({ ...prev, [p]: false }));
  };

  const providers = [
    {
      id: "fapshi", title: "Fapshi", desc: "Mobile money payment gateway for Cameroon and Central Africa.",
      fields: [
        { label: "Base URL",  name: "fapshi_url"  },
        { label: "Username",  name: "fapshi_user" },
        { label: "API Key",   name: "fapshi_key",  sensitive: true },
      ],
    },
    {
      id: "cryptomus", title: "Cryptomus", desc: "Accept cryptocurrency payments from customers worldwide.",
      fields: [
        { label: "Base URL",       name: "cryptomus_url"           },
        { label: "Merchant UUID",  name: "cryptomus_merchant_uuid" },
        { label: "API Key",        name: "cryptomus_api_key",       sensitive: true },
      ],
    },
    {
      id: "monnify", title: "Monnify", desc: "Bank transfers and card payments for Nigerian customers.",
      fields: [
        { label: "Base URL",      name: "monnify_baseUrl"      },
        { label: "API Key",       name: "monnify_apiKey",       sensitive: true },
        { label: "Secret Key",    name: "monnify_secretKey",    sensitive: true },
        { label: "Contract Code", name: "monnify_contractCode" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
      <TabHeader title="Payment Gateways" subtitle="Configure API credentials for each payment provider" />
      {providers.map((p, i) => (
        <ProviderCard
          key={p.id}
          provider={p.id}
          index={i + 1}
          {...p}
          editing={editing[p.id]}
          saving={saving[p.id]}
          formData={formData[p.id]}
          settings={settings}
          onEdit={() => handleEdit(p.id)}
          onSave={() => handleSave(p.id)}
          onCancel={() => handleCancel(p.id)}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default PaymentTab;

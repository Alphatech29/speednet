import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { HiGlobe, HiCurrencyDollar, HiShare } from "react-icons/hi";
import { getWebSettings, updateWebSettings } from "../../../../components/backendApis/admin/apis/settings";
import { AccentLine, EditBar, Field, FieldGrid, TabHeader } from "./_shared";

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

const SECTIONS = [
  {
    id: "general", label: "General Info", subtitle: "Site identity and contact details",
    icon: HiGlobe, iconClass: "bg-blue-50 text-blue-500",
    fields: [
      { id: "site_name",         label: "Site Name"       },
      { id: "tagline",           label: "Tagline"         },
      { id: "web_description",   label: "Description"     },
      { id: "web_url",           label: "Website URL",    type: "url"   },
      { id: "support_email",     label: "Support Email",  type: "email" },
      { id: "admin_alert_email", label: "Alert Email",    type: "email" },
      { id: "contact_number",    label: "Contact Number", type: "tel"   },
      { id: "address",           label: "Address"         },
    ],
  },
  {
    id: "financial", label: "Financial & Rates", subtitle: "Currency, fees, and exchange rates",
    icon: HiCurrencyDollar, iconClass: "bg-emerald-50 text-emerald-500",
    fields: [
      { id: "currency",                label: "Currency Symbol"         },
      { id: "vat",                     label: "VAT (%)",               type: "number" },
      { id: "commission",              label: "Escrow Commission (%)",  type: "number" },
      { id: "merchant_activation_fee", label: "Merchant Activation Fee", type: "number" },
      { id: "xaf_rate",                label: "XAF Rate",              type: "number" },
      { id: "naira_rate",              label: "Naira Rate",            type: "number" },
      { id: "usd_rub",                 label: "USD / RUB Rate",        type: "number" },
      { id: "referral_commission",     label: "Referral Reward ($)",   type: "number" },
      { id: "escrow_time",             label: "Escrow Time (min)"      },
    ],
  },
  {
    id: "social", label: "Social Links", subtitle: "Platform profile URLs",
    icon: HiShare, iconClass: "bg-purple-50 text-purple-500",
    fields: [
      { id: "telegram_url",  label: "Telegram",  type: "url" },
      { id: "twitter_url",   label: "Twitter",   type: "url" },
      { id: "instagram_url", label: "Instagram", type: "url" },
      { id: "tiktok_url",    label: "TikTok",    type: "url" },
    ],
  },
];

const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields);
const defaultState = Object.fromEntries(ALL_FIELDS.map((f) => [f.id, ""]));

const WebSettingsTab = () => {
  const [settings,  setSettings]  = useState(defaultState);
  const [initial,   setInitial]   = useState(defaultState);
  const [isEditing, setIsEditing] = useState(false);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    getWebSettings().then((res) => {
      if (res?.success && res.data) {
        const populated = Object.fromEntries(ALL_FIELDS.map((f) => [f.id, res.data[f.id] ?? ""]));
        setSettings(populated);
        setInitial(populated);
      } else toast.error("No web settings found");
    }).catch(() => toast.error("Failed to fetch web settings"));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    const changed = {};
    Object.keys(settings).forEach((k) => { if (settings[k] !== initial[k]) changed[k] = settings[k]; });
    if (!Object.keys(changed).length) { toast.info("No changes to save"); return; }
    setSaving(true);
    try {
      const res = await updateWebSettings(changed);
      toast.success(res?.data?.message || "Settings saved");
      setInitial(settings);
      setIsEditing(false);
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const handleCancel = () => { setSettings(initial); setIsEditing(false); };
  const dirty = ALL_FIELDS.some((f) => settings[f.id] !== initial[f.id]);

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <TabHeader title="Web Settings" subtitle="Manage your site configuration, rates, and social links">
        <EditBar editing={isEditing} saving={saving} dirty={dirty}
          onEdit={() => setIsEditing(true)} onSave={handleSave} onCancel={handleCancel} />
      </TabHeader>

      {SECTIONS.map((sec, si) => (
        <motion.div key={sec.id} variants={fadeUp} initial="hidden" animate="visible" custom={si + 1}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <AccentLine />

          {/* Section header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${sec.iconClass}`}>
              <sec.icon size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{sec.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{sec.subtitle}</p>
            </div>
          </div>

          <div className="p-5">
            <FieldGrid cols="tab:grid-cols-2 pc:grid-cols-3">
              {sec.fields.map(({ id, label, type = "text" }) => (
                <Field
                  key={id} id={id} label={label} type={type}
                  value={settings[id]} onChange={handleChange} readOnly={!isEditing}
                />
              ))}
            </FieldGrid>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WebSettingsTab;

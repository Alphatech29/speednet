import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaNode } from "react-icons/fa";
import { getWebSettings, updateWebSettings } from "../../../../components/backendApis/admin/apis/settings";
import { AccentLine, EditBar, Field, FieldGrid, TabHeader } from "./_shared";

const FIELDS = [
  { id: "smtp_service", label: "SMTP Service / Host"          },
  { id: "smtp_port",    label: "Port",         type: "number" },
  { id: "smtp_user",    label: "Mail Address", type: "email"  },
  { id: "smtp_pass",    label: "Password",     sensitive: true },
];

const SmtpserverTab = () => {
  const blank = Object.fromEntries(FIELDS.map((f) => [f.id, ""]));
  const [settings, setSettings] = useState(blank);
  const [initial,  setInitial]  = useState(blank);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    getWebSettings().then((res) => {
      if (res?.success && res.data) {
        const d = Object.fromEntries(FIELDS.map((f) => [f.id, res.data[f.id] || ""]));
        setSettings(d); setInitial(d);
      } else toast.error("SMTP settings not found");
    }).catch(() => toast.error("Failed to load settings"));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSettings((p) => ({ ...p, [id]: value }));
  };

  const handleSave = async () => {
    const changed = {};
    Object.keys(settings).forEach((k) => { if (settings[k] !== initial[k]) changed[k] = settings[k]; });
    if (!Object.keys(changed).length) { toast.info("No changes"); return; }
    setSaving(true);
    try {
      const res = await updateWebSettings(changed);
      toast.success(res?.data?.message || "SMTP settings saved");
      setInitial(settings); setEditing(false);
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const dirty = FIELDS.some((f) => settings[f.id] !== initial[f.id]);

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <TabHeader title="SMTP Server" subtitle="Configure outgoing email for transactional messages">
        <EditBar editing={editing} saving={saving} dirty={dirty}
          onEdit={() => setEditing(true)} onSave={handleSave}
          onCancel={() => { setSettings(initial); setEditing(false); }} />
      </TabHeader>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <AccentLine />
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <FaNode size={15} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">SMTP Configuration</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Email server used for order confirmations, alerts, and OTPs</p>
          </div>
        </div>
        <div className="p-5">
          <FieldGrid>
            {FIELDS.map((f) => (
              <Field key={f.id} {...f} value={settings[f.id]} onChange={handleChange} readOnly={!editing} />
            ))}
          </FieldGrid>
        </div>
      </div>
    </div>
  );
};

export default SmtpserverTab;

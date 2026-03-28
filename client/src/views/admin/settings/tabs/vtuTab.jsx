import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoWifiSharp } from "react-icons/io5";
import { getWebSettings, updateWebSettings } from "../../../../components/backendApis/admin/apis/settings";
import { AccentLine, EditBar, Field, FieldGrid, TabHeader } from "./_shared";

const FIELDS = [
  { id: "vtpass_url",     label: "VTpass URL"   },
  { id: "vtpass_sk",      label: "Secret Key",  sensitive: true },
  { id: "vtpass_pk",      label: "Public Key",  sensitive: true },
  { id: "vtpass_api_key", label: "API Key",      sensitive: true },
];

const VtuTab = () => {
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
      } else toast.error("VTpass settings not found");
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
      toast.success(res?.data?.message || "VTpass settings saved");
      setInitial(settings); setEditing(false);
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const dirty = FIELDS.some((f) => settings[f.id] !== initial[f.id]);

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <TabHeader title="VTU Service" subtitle="VTpass API credentials for airtime, data, and utility bills">
        <EditBar editing={editing} saving={saving} dirty={dirty}
          onEdit={() => setEditing(true)} onSave={handleSave}
          onCancel={() => { setSettings(initial); setEditing(false); }} />
      </TabHeader>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <AccentLine />
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
            <IoWifiSharp size={15} className="text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">VTpass Integration</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Manage your VTpass API credentials for VTU services</p>
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

export default VtuTab;

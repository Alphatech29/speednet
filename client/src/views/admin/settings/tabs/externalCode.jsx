import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi";
import { getWebSettings, updateWebSettings } from "../../../../components/backendApis/admin/apis/settings";
import { AccentLine, EditBar, TabHeader } from "./_shared";

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

const CODE_FIELDS = [
  {
    id:    "header_code",
    label: "Header Code",
    badge: "<head>",
    hint:  "Injected inside <head> — analytics scripts, meta tags, custom CSS.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id:    "footer_code",
    label: "Footer Code",
    badge: "</body>",
    hint:  "Injected before </body> — chat widgets, tracking pixels, deferred scripts.",
    color: "bg-purple-50 text-purple-600",
  },
];

const ExternalCode = () => {
  const [settings, setSettings] = useState({ header_code: "", footer_code: "" });
  const [initial,  setInitial]  = useState({ header_code: "", footer_code: "" });
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    getWebSettings().then((res) => {
      if (res?.success && res.data) {
        const d = { header_code: res.data.header_code || "", footer_code: res.data.footer_code || "" };
        setSettings(d); setInitial(d);
      } else toast.error("Settings not found");
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
      toast.success(res?.data?.message || "Code snippets saved");
      setInitial(settings); setEditing(false);
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const dirty = Object.keys(settings).some((k) => settings[k] !== initial[k]);

  return (
    <div className="flex flex-col gap-5">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <TabHeader title="External Code Injection" subtitle="Inject custom JS/CSS into the header and footer of your site">
        <EditBar editing={editing} saving={saving} dirty={dirty}
          onEdit={() => setEditing(true)} onSave={handleSave}
          onCancel={() => { setSettings(initial); setEditing(false); }} />
      </TabHeader>

      {/* Warning notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <HiInformationCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Only inject code from trusted sources. Malicious scripts can compromise your site and user data.
        </p>
      </div>

      {CODE_FIELDS.map(({ id, label, badge, hint, color }, i) => (
        <motion.div key={id} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <AccentLine />

          <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-50">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}>
              <FaCode size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-gray-800">{label}</p>
                <code className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                  {badge}
                </code>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>
            </div>
          </div>

          <div className="p-5">
            <textarea
              id={id}
              rows={10}
              value={settings[id]}
              onChange={handleChange}
              readOnly={!editing}
              placeholder={`Paste your ${label.toLowerCase()} here…`}
              className={`w-full px-4 py-3 text-xs font-mono rounded-xl border transition-all outline-none resize-y leading-relaxed
                ${editing
                  ? "bg-white border-gray-200 text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
                  : "bg-gray-50/50 border-gray-100 text-gray-500 cursor-default"
                }`}
            />
            {editing && (
              <p className="text-[10px] text-gray-300 mt-1.5">
                {settings[id].length > 0 ? `${settings[id].length} characters` : "Empty"}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ExternalCode;

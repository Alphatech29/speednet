import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { HiCheckCircle, HiChevronDown } from "react-icons/hi";
import { FaArrowRight, FaLock, FaShieldAlt, FaUserSecret } from "react-icons/fa";
import { GrShieldSecurity } from "react-icons/gr";
import { MdOutlineVisibilityOff, MdOutlineDevices } from "react-icons/md";
import { TbWorld } from "react-icons/tb";

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };

const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
    <span className="w-5 h-px bg-primary-600" />{children}<span className="w-5 h-px bg-primary-600" />
  </span>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${open ? "border-primary-600/40 shadow-md shadow-orange-100" : "border-gray-200"}`}>
      <button className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group" onClick={() => setOpen(p => !p)}>
        <span className={`text-sm font-semibold transition-colors ${open ? "text-primary-600" : "text-gray-900 group-hover:text-primary-600"}`}>{q}</span>
        <HiChevronDown size={17} className={`text-primary-600 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const vpnTypes = [
  { emoji: "🔵", name: "NordVPN", desc: "Premium subscription accounts", badge: "Most Popular" },
  { emoji: "🟢", name: "ExpressVPN", desc: "High-speed encrypted tunnels", badge: null },
  { emoji: "🔴", name: "Surfshark", desc: "Unlimited device support", badge: null },
  { emoji: "⚫", name: "Private Logs", desc: "Verified credential logs", badge: "New" },
];

const features = [
  { icon: <FaLock size={20} className="text-primary-600" />, title: "AES-256 Encryption", desc: "Military-grade encryption on every VPN account keeps your traffic completely private." },
  { icon: <MdOutlineVisibilityOff size={22} className="text-primary-600" />, title: "No-Log Policy", desc: "All VPN accounts come with verified no-log policies — your activity stays private." },
  { icon: <TbWorld size={22} className="text-primary-600" />, title: "60+ Server Countries", desc: "Access servers across 60+ countries with unlimited bandwidth on every account." },
  { icon: <MdOutlineDevices size={22} className="text-primary-600" />, title: "Multi-Device Support", desc: "One account works on phones, tablets, laptops, and routers simultaneously." },
  { icon: <FaUserSecret size={20} className="text-primary-600" />, title: "Verified Credentials", desc: "Every log and account is tested and verified before listing. You always get working access." },
  { icon: <GrShieldSecurity size={20} className="text-primary-600" />, title: "Identity Protection", desc: "Mask your real IP, bypass geo-restrictions, and browse with full anonymity." },
];

const useCases = [
  { emoji: "🌐", title: "Bypass Geo-Blocks", desc: "Access Netflix libraries, streaming services, and websites restricted in your country." },
  { emoji: "💼", title: "Business Privacy", desc: "Protect sensitive business communication and remote work traffic from interception." },
  { emoji: "📡", title: "Public WiFi Safety", desc: "Stay secure on public hotspots — airports, hotels, cafes — without risk." },
  { emoji: "🔒", title: "Identity Masking", desc: "Hide your IP address and real identity from trackers, advertisers, and surveillance." },
];

const faqs = [
  { q: "Are these genuine VPN accounts?", a: "Yes. All VPN accounts are verified working before listing. Each comes with login credentials and usage instructions. We replace any account that doesn't work." },
  { q: "How long do VPN subscriptions last?", a: "Duration varies by listing — 1 month, 6 months, or 1 year options are available. Check the product listing for the specific validity period." },
  { q: "Can I use the VPN on multiple devices?", a: "Yes! Most listed VPN accounts support 5–6 simultaneous devices. Check the product description for the exact device limit." },
  { q: "What if the account stops working?", a: "Open a dispute from your dashboard within 48 hours. We'll replace the account immediately or issue a full refund." },
];

export default function VpnPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-slate-900 via-secondary to-slate-900 pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-primary-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary-600/5 blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #E46300 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>
        <div className="relative w-full px-5 pc:px-20 py-20">
          <div className="max-w-5xl mx-auto flex flex-col pc:flex-row items-center gap-14">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }} className="flex-1 text-center pc:text-left">
              <span className="inline-flex items-center gap-2 bg-primary-600/20 text-primary-600 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-primary-600/30">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />VPN & Secure Logs
              </span>
              <h1 className="text-[2.2rem] tab:text-[3rem] pc:text-[3.8rem] font-extrabold text-white leading-tight mb-5">
                Browse Anonymously.{" "}
                <span className="text-primary-600">Stay Protected.</span>
                {" "}Always.
              </h1>
              <p className="text-gray-300 text-base pc:text-lg max-w-xl leading-relaxed mb-8">
                Premium VPN accounts and verified secure logs at unbeatable prices. Full encryption, zero tracking, instant delivery.
              </p>
              <div className="flex flex-col tab:flex-row gap-4 justify-center pc:justify-start mb-8">
                <NavLink to="/auth/register">
                  <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-600/30 transition-all text-sm w-full tab:w-auto">
                    Get VPN Access <FaArrowRight size={13} />
                  </button>
                </NavLink>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pc:justify-start">
                {["🔒 AES-256 Encrypted", "🌍 60+ Countries", "📱 Multi-Device", "✅ No-Log Policy"].map(t => (
                  <span key={t} className="text-xs text-gray-300 font-medium bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg">{t}</span>
                ))}
              </div>
            </motion.div>
            {/* Shield visual */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
              className="hidden pc:flex w-72 h-72 flex-shrink-0 items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-primary-600/10 border border-primary-600/20 animate-pulse" />
              <div className="absolute inset-6 rounded-full bg-primary-600/8 border border-primary-600/15" />
              <div className="relative w-28 h-28 rounded-full bg-primary-600/20 border-2 border-primary-600/40 flex items-center justify-center">
                <FaShieldAlt className="text-primary-600 text-5xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VPN Types ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Available Products</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Premium VPN Brands</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm pc:text-base">Choose from top-tier VPN providers and verified secure logs.</p>
        </motion.div>
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {vpnTypes.map(({ emoji, name, desc, badge }, i) => (
            <motion.div key={name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative group bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary-600/30 hover:shadow-xl hover:shadow-orange-100/50 transition-all text-center">
              {badge && <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === "Most Popular" ? "bg-primary-600 text-white" : "bg-green-100 text-green-700"}`}>{badge}</span>}
              <span className="text-4xl mb-3 block">{emoji}</span>
              <h3 className="font-extrabold text-gray-900 mb-1 text-sm">{name}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-pay px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Security Features</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Enterprise-Grade Privacy</h2>
        </motion.div>
        <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary-600/30 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-primary-600/10 flex items-center justify-center mb-4 group-hover:bg-primary-600/20 transition-colors">{icon}</div>
              <h3 className="text-base font-extrabold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="bg-secondary px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>Use Cases</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-white mt-1">Who Uses Speednet VPN?</h2>
        </motion.div>
        <div className="grid grid-cols-1 tab:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {useCases.map(({ emoji, title, desc }, i) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-4 bg-white/5 border border-white/10 hover:border-primary-600/30 rounded-2xl p-5 transition-all">
              <span className="text-3xl flex-shrink-0">{emoji}</span>
              <div>
                <h3 className="text-sm font-extrabold text-white mb-1">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white px-5 pc:px-20 py-20 pc:py-24">
        <motion.div className="text-center mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-gray-900 mt-1">Common Questions</h2>
        </motion.div>
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {faqs.map((f, i) => (
            <motion.div key={f.q} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
              <FaqItem {...f} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-gradient-to-br from-secondary via-primary-100 to-slate-900 px-5 pc:px-20 py-20 overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/15 rounded-full blur-[80px] pointer-events-none" />
        <motion.div className="relative z-10 max-w-xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="text-2xl pc:text-4xl font-extrabold text-white mb-4">Start Browsing Privately</h2>
          <p className="text-gray-300 text-sm pc:text-base mb-8">Get premium VPN access at the best price, fully protected by Speednet's escrow.</p>
          <NavLink to="/auth/register">
            <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-10 py-4 rounded-xl shadow-xl shadow-primary-600/30 transition-all text-sm">
              Get VPN Now <FaArrowRight size={13} />
            </button>
          </NavLink>
        </motion.div>
      </section>
    </>
  );
}

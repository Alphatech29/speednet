import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { HiX, HiChat } from "react-icons/hi";

const WHATSAPP_NUMBER = "17656359872";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const quickMessages = [
  "Hi, I need help with my order 👋",
  "I want to make a deposit 💰",
  "I have an issue with a product 🛒",
  "I want to become a seller 🛒",
];

const WhatsAppSupport = () => {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hidden, setHidden] = useState(() => localStorage.getItem("wa_support_hidden") === "true");

  const hide = () => {
    localStorage.setItem("wa_support_hidden", "true");
    setHidden(true);
    setOpen(false);
  };

  const restore = () => {
    localStorage.removeItem("wa_support_hidden");
    setHidden(false);
  };

  // Show greeting bubble after 4s, hide after 8s
  useEffect(() => {
    if (hidden) return;
    const show = setTimeout(() => setShowBubble(true), 4000);
    const hideTimer = setTimeout(() => setShowBubble(false), 12000);
    return () => { clearTimeout(show); clearTimeout(hideTimer); };
  }, [hidden]);

  const handleQuickMessage = (msg) => {
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (hidden) {
    return (
      <button
        onClick={restore}
        title="Show WhatsApp support"
        className="fixed bottom-6 mobile:bottom-[69px] right-5 z-50 pc:z-[9999] w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow flex items-center justify-center text-[#25d366] hover:scale-110 transition-all opacity-50 hover:opacity-100"
      >
        <FaWhatsapp size={15} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 mobile:bottom-[69px] right-5 z-[9999] flex flex-col items-end gap-3 pointer-events-none">

      {/* Greeting bubble */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="pointer-events-auto max-w-[220px] bg-white dark:bg-slate-800 rounded-2xl rounded-br-sm shadow-2xl px-4 py-3 border border-gray-100 dark:border-white/10"
          >
            <p className="text-xs font-semibold text-gray-800 dark:text-white leading-snug">
              👋 Need help? Chat with us on WhatsApp!
            </p>
            <button
              onClick={() => setShowBubble(false)}
              className="absolute top-1.5 right-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <HiX size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="pointer-events-auto w-[290px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25d366] px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <FaWhatsapp size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">SpeedNet Support</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                  <p className="text-white/80 text-[11px]">Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <HiX size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-4 space-y-3">
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                Start a conversation or pick a topic:
              </p>

              <div className="flex flex-col gap-2">
                {quickMessages.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => handleQuickMessage(msg)}
                    className="text-left text-xs font-medium text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 hover:bg-[#25d366]/10 dark:hover:bg-[#25d366]/10 hover:text-[#25d366] border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2.5 transition-all"
                  >
                    {msg}
                  </button>
                ))}
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1ebe5d] text-white text-xs font-bold py-3 rounded-2xl transition-all mt-1"
              >
                <FaWhatsapp size={15} />
                Open WhatsApp
              </a>

              <button
                onClick={hide}
                className="w-full text-center text-[11px] text-gray-400 dark:text-slate-600 hover:text-gray-600 dark:hover:text-slate-400 transition-colors py-1"
              >
                Hide support button
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB + hide button row */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Hide button — sm only */}
        <button
          onClick={hide}
          title="Hide support"
          className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow text-[11px] font-semibold text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/30 transition-all"
        >
          <HiX size={10} />
          Hide
        </button>

      {/* FAB Button */}
      <button
        onClick={() => { setOpen((p) => !p); setShowBubble(false); }}
        className="relative w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-white shadow-lg shadow-[#25d366]/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-30" />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <HiX size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FaWhatsapp size={26} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      </div>
    </div>
  );
};

export default WhatsAppSupport;

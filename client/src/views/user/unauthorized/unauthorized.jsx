import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiLockClosed, HiArrowLeft, HiHome, HiShieldExclamation } from "react-icons/hi";

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  show:    (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" } }),
};

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">

      {/* decorative background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl shadow-gray-200/60 dark:shadow-black/40 overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-primary-600 to-orange-500" />

          <div className="px-8 py-10 flex flex-col items-center text-center">

            {/* Icon ring */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="relative mb-6"
            >
              {/* outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-red-500/10 dark:bg-red-500/15 blur-xl scale-150" />
              <div className="relative w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 flex items-center justify-center">
                <HiLockClosed size={34} className="text-red-500 dark:text-red-400" />
              </div>
            </motion.div>

            {/* 403 badge */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="mb-3"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-800/40 uppercase tracking-widest">
                <HiShieldExclamation size={11} /> Error 403
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="text-2xl pc:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight"
            >
              Access Denied
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-8 max-w-xs"
            >
              You don't have permission to view this page. Please contact your administrator if you believe this is a mistake.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="w-full flex flex-col gap-3"
            >
              <button
                onClick={() => navigate("/user/marketplace")}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-600/25 transition-all hover:-translate-y-0.5"
              >
                <HiHome size={15} /> Go to Marketplace
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-sm font-bold rounded-2xl transition-all"
              >
                <HiArrowLeft size={15} /> Go Back
              </button>
            </motion.div>
          </div>

          {/* Footer strip */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2">
            <HiShieldExclamation size={13} className="text-gray-300 dark:text-slate-600" />
            <p className="text-[11px] text-gray-400 dark:text-slate-500">
              If you need access, contact{" "}
              <span className="font-bold text-primary-600">support</span>.
            </p>
          </div>
        </motion.div>

        {/* Floating 403 watermark */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] font-black text-gray-100 dark:text-slate-800/60 select-none pointer-events-none leading-none">
          403
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

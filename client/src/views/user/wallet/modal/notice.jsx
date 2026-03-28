import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllNotices } from "../../../../components/backendApis/admin/apis/notice";
import { AuthContext } from "../../../../components/control/authContext";
import { HiBell, HiX, HiChevronRight, HiCheck, HiCalendar } from "react-icons/hi";

const Notice = () => {
  const { user } = useContext(AuthContext);
  const userRole = user?.role?.toLowerCase();

  const [notices, setNotices]       = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal]   = useState(false);
  const [direction, setDirection]   = useState(1); // 1 = forward

  useEffect(() => {
    if (!userRole) return;

    const fetchNotices = async () => {
      try {
        const response = await getAllNotices();
        if (response.success && Array.isArray(response.data)) {
          const filtered = response.data.filter(
            (n) => n.role?.toLowerCase() === userRole
          );
          if (filtered.length > 0) {
            setNotices(filtered);
            setShowModal(true);
          }
        }
      } catch {
        /* silently ignore — notices are non-critical */
      }
    };

    fetchNotices();
  }, [userRole]);

  const closeModal = () => {
    setShowModal(false);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentIndex < notices.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      closeModal();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isLast    = currentIndex === notices.length - 1;
  const current   = notices[currentIndex];
  const total     = notices.length;

  const slideVariants = {
    enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" } },
    exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.2 } }),
  };

  return (
    <AnimatePresence>
      {showModal && current && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary-600 to-orange-500 px-6 py-5 overflow-hidden">
              {/* decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <HiBell size={17} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">
                      Notice {currentIndex + 1} of {total}
                    </p>
                    <h2 className="text-base font-extrabold text-white leading-snug">
                      {current.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all flex-shrink-0 mt-0.5"
                >
                  <HiX size={14} />
                </button>
              </div>

              {/* date */}
              {current.created_at && (
                <div className="relative flex items-center gap-1.5 mt-3 text-[11px] text-white/60">
                  <HiCalendar size={11} />
                  <span>{formatDate(current.created_at)}</span>
                </div>
              )}
            </div>

            {/* Body — animated slide */}
            <div className="overflow-hidden px-6 py-5 min-h-[120px] max-h-[50vh] overflow-y-auto">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.p
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-line"
                >
                  {current.message}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              {/* Step dots */}
              <div className="flex items-center gap-1.5">
                {notices.map((_, i) => (
                  <span
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-5 h-2 bg-primary-600"
                        : "w-2 h-2 bg-gray-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2.5 text-xs font-bold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-2xl transition-all"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-md shadow-primary-600/25 transition-all"
                >
                  {isLast ? (
                    <><HiCheck size={13} /> Done</>
                  ) : (
                    <>Next <HiChevronRight size={13} /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notice;

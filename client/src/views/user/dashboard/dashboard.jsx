import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../../views/user/partials/sidebar";
import Header from "../../../views/user/partials/header";
import Footer from "../../../views/user/partials/footer";
import { useTheme } from "../../../components/control/themeContext";

const Dashboard = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth >= 1024;
      setIsDesktop(wide);
      if (wide) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (!isDesktop && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen, isDesktop]);

  return (
    <div className={`min-h-screen w-full flex${theme === "dark" ? " dark bg-slate-950" : " bg-gray-50"}`}>
      {/* Desktop sidebar */}
      {isDesktop && (
        <div className="hidden pc:block w-[265px] flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Mobile sidebar */}
      <AnimatePresence>
        {!isDesktop && sidebarOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 z-50 h-full"
            >
              <Sidebar />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col pc:w-[calc(100%-265px)]">
        <Header toggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-auto px-4 pc:px-6 py-5 pb-20 pc:pb-6">
          <Outlet />
        </main>
        <Footer toggleSidebar={() => setSidebarOpen((p) => !p)} />
      </div>
    </div>
  );
};

export default Dashboard;

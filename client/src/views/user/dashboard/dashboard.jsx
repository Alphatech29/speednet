import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../views/user/partials/sidebar';
import Header from '../../../views/user/partials/header';
import Footer from '../../../views/user/partials/footer';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Resize listener to set PC/mobile state
  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth >= 1024;
      setIsDesktop(wide);
      if (wide) setSidebarOpen(false); 
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-slate-600 overflow-x-hidden">
      {/* Sidebar */}
      {isDesktop ? (
        <div className="hidden pc:block w-[265px]">
          <Sidebar />
        </div>
      ) : (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 z-50 h-full w-[265px] bg-slate-800 shadow-lg"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {/* Mobile overlay */}
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main content */}
   <div className="ml-0 flex w-full flex-col transition-all duration-300">
        <Header />
        <div className="flex-grow overflow-auto pc:py-4 mobile:py-4 mobile:mb-14 px-6 mobile:px-4">
          <Outlet />
        </div>
        {/* Footer still has optional control */}
        <Footer toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      </div>
    </div>
  );
};

export default Dashboard;

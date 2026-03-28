import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../partials/sidebar";
import Header  from "../../partials/header";
import Footer  from "../../partials/footer";
import "../../cssFile/dashboard.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm pc:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      <div className="admin-main">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 pc:p-6 bg-slate-50 min-h-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;

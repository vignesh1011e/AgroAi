import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600 dark:border-neutral-800 dark:border-t-emerald-400" />
      </div>
    );
  }

  // Redirect instantly if user logged out or session ended
  if (!user && !localStorage.getItem("agro_token")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area (offset by 64 / 16rem on md+ screens) */}
      <div className="flex flex-1 flex-col transition-all duration-300 md:pl-64">
        {/* Sticky Topbar */}
        <Topbar setMobileOpen={setMobileOpen} />

        {/* Dynamic Page Outlet */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;

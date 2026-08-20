import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardFooter } from "../../components/dashboard/DashboardFooter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserLayout() {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);

  // Determine current portal route: /admin or /seller
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSellerRoute = location.pathname.startsWith("/seller");

  useEffect(() => {
    if (!loggedInUser) {
      toast.error("Please sign in to access this portal");
      navigate("/login");
      return;
    }

    if (isAdminRoute && loggedInUser.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    if (isSellerRoute && loggedInUser.role !== "seller" && loggedInUser.role !== "admin") {
      toast.error("Access denied. Seller account required.");
      navigate("/");
      return;
    }
  }, [location.pathname, loggedInUser, navigate]);

  useEffect(() => {
    // Default sidebar closed on mobile screens on initial mount
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setShowSidebar(false);
    }
  }, []);

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <DashboardHeader
        loggedInUser={loggedInUser}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      <main className="flex flex-1 overflow-hidden relative">
        <DashboardSidebar
          loggedInUser={loggedInUser}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        <section className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 bg-slate-50 min-w-0">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ showSidebar, setShowSidebar }} />
          </div>
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
}

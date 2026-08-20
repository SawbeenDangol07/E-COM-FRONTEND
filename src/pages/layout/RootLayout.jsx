import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import CartDrawer from "../../components/common/CartDrawer";

export default function RootLayout() {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser?.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (loggedInUser?.role === "seller") {
      navigate("/seller", { replace: true });
    }
  }, [loggedInUser, navigate]);

  if (loggedInUser?.role === "admin" || loggedInUser?.role === "seller") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

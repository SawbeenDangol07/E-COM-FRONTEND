import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import {
  TbLayoutDashboard,
  TbDeviceMobile,
  TbTag,
  TbCategory,
  TbUsers,
  TbTruckDelivery,
  TbMessageDots,
  TbLogout,
  TbPhoto,
  TbX,
} from "react-icons/tb";

export const DashboardSidebar = ({ loggedInUser, showSidebar, setShowSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const role = loggedInUser?.role || "seller";
  const isAdmin = role === "admin";

  const handleLinkClick = () => {
    // On mobile screens, auto-close sidebar when navigating
    if (window.innerWidth < 768 && setShowSidebar) {
      setShowSidebar(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    toast.success("Logged out successfully");
    if (setShowSidebar) setShowSidebar(false);
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: `/${role}`,
      icon: <TbLayoutDashboard className="w-5 h-5 text-indigo-600 shrink-0" />,
      exact: true,
    },
    {
      name: "Products",
      path: `/${role}/products`,
      icon: <TbDeviceMobile className="w-5 h-5 text-indigo-600 shrink-0" />,
    },
    {
      name: "Brands",
      path: `/${role}/brands`,
      icon: <TbTag className="w-5 h-5 text-indigo-600 shrink-0" />,
    },
    {
      name: "Categories",
      path: `/${role}/categories`,
      icon: <TbCategory className="w-5 h-5 text-indigo-600 shrink-0" />,
    },
    ...(isAdmin
      ? [
          {
            name: "Banners",
            path: `/${role}/banners`,
            icon: <TbPhoto className="w-5 h-5 text-indigo-600 shrink-0" />,
          },
          {
            name: "Platform Users",
            path: `/${role}/users`,
            icon: <TbUsers className="w-5 h-5 text-indigo-600 shrink-0" />,
          },
        ]
      : []),
    {
      name: "Orders",
      path: `/${role}/orders`,
      icon: <TbTruckDelivery className="w-5 h-5 text-indigo-600 shrink-0" />,
    },
    {
      name: "Inquiries / Chat",
      path: `/${role}/messages`,
      icon: <TbMessageDots className="w-5 h-5 text-indigo-600 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setShowSidebar && setShowSidebar(false)}
        />
      )}

      {/* Sidebar Container: Mobile Drawer (fixed) & Desktop Collapsible (relative) */}
      <aside
        className={`
          bg-white border-r border-slate-200 text-slate-800 transition-all duration-300 z-50 shrink-0
          fixed inset-y-0 left-0 md:static md:inset-auto
          ${
            showSidebar
              ? "translate-x-0 w-72 md:w-64 shadow-2xl md:shadow-none"
              : "-translate-x-full md:translate-x-0 md:w-16 md:shadow-none pointer-events-none md:pointer-events-auto"
          }
        `}
      >
        <nav className="flex flex-col h-full py-5 px-3 justify-between overflow-y-auto">
          <div>
            {/* Mobile Drawer Header with Close Button */}
            <div className="flex items-center justify-between pb-4 mb-2 px-2 border-b border-slate-100 md:hidden">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-slate-900 text-base">
                  Mobi<span className="text-indigo-600">Market</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  {role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSidebar && setShowSidebar(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            {/* Section title if expanded */}
            {showSidebar && (
              <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isAdmin ? "Admin Controls" : "Merchant Tools"}
              </p>
            )}

            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-xs font-semibold ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      } ${!showSidebar ? "md:justify-center md:px-0" : ""}`
                    }
                    title={!showSidebar ? item.name : undefined}
                  >
                    {item.icon}
                    {(showSidebar || window.innerWidth < 768) && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Actions: Logout */}
          <div className="space-y-1 pt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer ${
                !showSidebar ? "md:justify-center md:px-0" : ""
              }`}
              title="Logout"
            >
              <TbLogout className="w-5 h-5 shrink-0" />
              {(showSidebar || window.innerWidth < 768) && <span>Sign Out</span>}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;

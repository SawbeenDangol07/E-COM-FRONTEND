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
} from "react-icons/tb";

export const DashboardSidebar = ({ loggedInUser, showSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const role = loggedInUser?.role || "seller";
  const isAdmin = role === "admin";

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: `/${role}`,
      icon: <TbLayoutDashboard className="w-5 h-5 text-indigo-600" />,
      exact: true,
    },
    {
      name: "Products",
      path: `/${role}/products`,
      icon: <TbDeviceMobile className="w-5 h-5 text-indigo-600" />,
    },
    {
      name: "Brands",
      path: `/${role}/brands`,
      icon: <TbTag className="w-5 h-5 text-indigo-600" />,
    },
    {
      name: "Categories",
      path: `/${role}/categories`,
      icon: <TbCategory className="w-5 h-5 text-indigo-600" />,
    },
    ...(isAdmin
      ? [
          {
            name: "Banners",
            path: `/${role}/banners`,
            icon: <TbPhoto className="w-5 h-5 text-indigo-600" />,
          },
          {
            name: "Platform Users",
            path: `/${role}/users`,
            icon: <TbUsers className="w-5 h-5 text-indigo-600" />,
          },
        ]
      : []),
    {
      name: "Orders",
      path: `/${role}/orders`,
      icon: <TbTruckDelivery className="w-5 h-5 text-indigo-600" />,
    },
    {
      name: "Inquiries / Chat",
      path: `/${role}/messages`,
      icon: <TbMessageDots className="w-5 h-5 text-indigo-600" />,
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 text-slate-800 transition-all duration-200 shrink-0 ${
        showSidebar ? "w-64" : "w-16"
      }`}
    >
      <nav className="flex flex-col h-full py-6 px-3 justify-between">
        <div>
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
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-xs font-semibold ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    } ${!showSidebar ? "justify-center px-0" : ""}`
                  }
                  title={!showSidebar ? item.name : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {showSidebar && <span className="truncate">{item.name}</span>}
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
              !showSidebar ? "justify-center px-0" : ""
            }`}
            title="Logout"
          >
            <TbLogout className="w-5 h-5 shrink-0" />
            {showSidebar && <span>Sign Out</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;

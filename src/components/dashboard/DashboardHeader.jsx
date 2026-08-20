import { useState } from "react";
import { TbMenu2, TbLayoutSidebarLeftCollapse, TbCamera, TbUser } from "react-icons/tb";
import ProfileModal from "../profile/ProfileModal";

export const DashboardHeader = ({ loggedInUser, showSidebar, setShowSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isAdmin = loggedInUser?.role === "admin";

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 w-full text-slate-900 shrink-0 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          {/* Left: Brand & Sidebar toggle */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer shrink-0"
              title="Toggle Sidebar"
            >
              {showSidebar ? (
                <TbLayoutSidebarLeftCollapse className="w-5 h-5 hidden md:block" />
              ) : null}
              <TbMenu2 className={`w-5 h-5 ${showSidebar ? "md:hidden" : "block"}`} />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-slate-900 truncate">
                {isAdmin ? "MobiMarket Admin" : "Seller Portal"}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                  isAdmin
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}
              >
                {loggedInUser?.role || "Merchant"}
              </span>
            </div>
          </div>

          {/* Right: User Profile with Edit Click */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200/80 transition cursor-pointer group text-left"
              title="Edit Profile & Avatar"
            >
              <div className="relative">
                <img
                  src={
                    loggedInUser?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                  }
                  alt={loggedInUser?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition">
                  <TbCamera className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition">
                  {loggedInUser?.name || "Admin"}
                </span>
                <span className="text-[10px] text-slate-400 capitalize font-light">
                  Edit Profile
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default DashboardHeader;

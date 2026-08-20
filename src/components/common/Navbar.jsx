import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import {
  TbSearch,
  TbShoppingBag,
  TbMessageDots,
  TbUser,
  TbLogout,
  TbMenu2,
  TbX,
  TbBuildingStore,
  TbReceipt,
  TbCamera,
} from "react-icons/tb";
import ProfileModal from "../profile/ProfileModal";

export default function Navbar() {
  const { loggedInUser, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Brands", path: "/brands" },
    { name: "Categories", path: "/categories" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <Link
              to="/"
              className="font-heading text-xl sm:text-2xl font-black tracking-tight text-slate-900 group transition hover:opacity-90"
            >
              Mobi<span className="text-indigo-600">Market</span>
            </Link>

            {/* Search Bar (Desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-md relative items-center"
            >
              <TbSearch className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iPhone 16 Pro, Galaxy S25, Pixel 9..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-full border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition outline-none"
              />
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl transition relative ${
                      isActive
                        ? "text-indigo-600 font-bold bg-indigo-50/80 border border-indigo-100"
                        : "hover:text-slate-900 hover:bg-slate-100/80"
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Actions: Wishlist, Cart, User */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Chat Icon */}
              <Link
                to="/chat"
                className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-full transition"
                title="Chats"
              >
                <TbMessageDots className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-full transition cursor-pointer"
                title="Cart"
              >
                <TbShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile / Auth Toggle */}
              {loggedInUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                  >
                    <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[100px] truncate">
                      {loggedInUser.name}
                    </span>
                    <img
                      src={
                        loggedInUser.avatar ||
                        loggedInUser.image?.url ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                      }
                      alt={loggedInUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs text-slate-400 font-light">Signed in as</p>
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {loggedInUser.name}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                            Role: {loggedInUser.role}
                          </span>
                        </div>

                        <div className="py-1 text-xs text-slate-700">
                          {loggedInUser.role === "admin" && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition text-emerald-600 font-semibold"
                            >
                              <TbBuildingStore className="w-4 h-4 text-emerald-600" />
                              <span>Admin Portal</span>
                            </Link>
                          )}

                          {loggedInUser.role === "seller" && (
                            <Link
                              to="/seller"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition text-indigo-600 font-semibold"
                            >
                              <TbBuildingStore className="w-4 h-4 text-indigo-600" />
                              <span>Seller Dashboard</span>
                            </Link>
                          )}

                          {/* Edit Profile & Avatar */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileOpen(true);
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition text-slate-700 font-medium cursor-pointer"
                          >
                            <TbCamera className="w-4 h-4 text-indigo-600" />
                            <span>Edit Profile & Avatar</span>
                          </button>

                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition text-slate-700 font-medium"
                          >
                            <TbReceipt className="w-4 h-4 text-indigo-600" />
                            <span>My Orders & History</span>
                          </Link>
                        </div>

                        <div className="pt-1 border-t border-slate-100">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <TbLogout className="w-4 h-4" />
                            <span>Log out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                title="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <TbX className="w-6 h-6" /> : <TbMenu2 className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Search & Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-150">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <TbSearch className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phones, specs, brands..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-100 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </form>

              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 font-bold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

import { Link, Outlet, useLocation } from "react-router";
import { TbDeviceMobile, TbShieldCheck, TbArrowLeft, TbLock } from "react-icons/tb";

export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname.includes("/login") || location.pathname === "/auth";
  const isRegister = location.pathname.includes("/register");
  const isForgot = location.pathname.includes("/forgot-password");
  const isActivation = location.pathname.includes("/activate");

  let pageTitle = "Welcome Back";
  let pageSubtitle = "Sign in to access your mobile listings, orders, and chats.";
  if (isRegister) {
    pageTitle = "Create an Account";
    pageSubtitle = "Join MobiMarket to buy and sell verified smartphones.";
  } else if (isForgot) {
    pageTitle = "Reset Password";
    pageSubtitle = "Enter your email to receive a secure recovery link.";
  } else if (isActivation) {
    pageTitle = "Account Activation";
    pageSubtitle = "Verify your email to activate your marketplace profile.";
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 text-slate-900 antialiased">
      {/* Top Brand Header & Back Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 space-y-4 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition group mb-2"
        >
          <TbArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex justify-center">
          <Link to="/" className="font-extrabold text-2xl tracking-tight text-slate-900 group">
            Mobi<span className="text-indigo-600">Market</span>
          </Link>
        </div>

        <div className="space-y-1 pt-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {pageTitle}
          </h2>
          <p className="text-xs text-slate-500 font-light max-w-xs mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Main Minimalist Auth Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/50 border border-slate-200/90 rounded-3xl space-y-6">
          <Outlet />

          {/* Toggle between Login and Register */}
          {(isLogin || isRegister) && (
            <div className="pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
                <Link
                  to={isLogin ? "/register" : "/login"}
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline ml-1"
                >
                  {isLogin ? "Create an account" : "Sign in here"}
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Minimalist Trust & Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <TbLock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <TbShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Verified Escrow</span>
          </div>
        </div>
      </div>
    </div>
  );
}

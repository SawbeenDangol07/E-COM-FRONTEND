import { Link, useRouteError, isRouteErrorResponse } from "react-router";
import {
  TbDeviceMobileX,
  TbArrowLeft,
  TbHome,
  TbDeviceMobile,
  TbSearch,
  TbShieldCheck,
} from "react-icons/tb";

export default function ErrorPage({
  code: propCode,
  message: propMessage,
  redirectLink = "/",
  redirectTxt = "Back to Marketplace",
}) {
  const routerError = useRouteError();

  let code = propCode || 404;
  let message = propMessage || "Page Not Found";
  let description = "The mobile phone listing or page you are looking for does not exist or has been moved.";

  if (routerError) {
    if (isRouteErrorResponse(routerError)) {
      code = routerError.status;
      message = routerError.statusText || (routerError.status === 404 ? "Page Not Found" : "Something Went Wrong");
      if (routerError.data?.message) {
        description = routerError.data.message;
      }
    } else if (routerError instanceof Error) {
      code = 500;
      message = "Application Error";
      description = routerError.message || "An unexpected error occurred.";
    }
  }

  const popularBrands = [
    { label: "Apple iPhones", path: "/products?brand=Apple" },
    { label: "Samsung Galaxy", path: "/products?brand=Samsung" },
    { label: "Google Pixel", path: "/products?brand=Google" },
    { label: "Foldables", path: "/category" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl -translate-y-24" />
        <div className="w-[350px] h-[350px] bg-purple-200/30 rounded-full blur-3xl translate-y-32" />
      </div>

      {/* Top Header / Brand Link */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group">
          Mobi<span className="text-indigo-600">Market</span>
        </Link>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <TbSearch className="w-4 h-4" />
          <span>Browse Catalog</span>
        </Link>
      </header>

      {/* Main Error Hero Card */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-auto py-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-10 text-center space-y-6">
          {/* Animated/Vibrant Icon Badge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <TbDeviceMobileX className="w-10 h-10 stroke-[2]" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-xs font-bold shadow-sm">
              {code}
            </span>
          </div>

          {/* Heading and Info */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block">
              {code === 404 ? "Missing Route / Device" : `Error Code ${code}`}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {message}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-light leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={redirectLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <TbHome className="w-4 h-4" />
              <span>{redirectTxt}</span>
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition shadow-2xs cursor-pointer"
            >
              <TbDeviceMobile className="w-4 h-4 text-indigo-600" />
              <span>Explore Mobiles</span>
            </Link>
          </div>

          {/* Popular Shortcuts */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Popular Destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularBrands.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-medium border border-slate-200/80 transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Security Assurance */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center py-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-light">
          <TbShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>MobiMarket • Verified Escrow Smartphone Trading Platform</span>
        </div>
      </footer>
    </div>
  );
}

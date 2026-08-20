import { Link } from "react-router";
import { TbDeviceMobile } from "react-icons/tb";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/90 mt-20 text-slate-600">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="font-heading text-xl font-black text-slate-900 tracking-tight block">
              Mobi<span className="text-indigo-600">Market</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-light">
              The premier marketplace for verified smartphones. Seamlessly buy and sell certified devices with direct negotiation, clean IMEI verification, and escrow security.
            </p>
            <div className="text-xs text-slate-400 font-light">
              © {new Date().getFullYear()} MobiMarket Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Explore
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/products" className="hover:text-indigo-600 transition">
                  All Smartphones
                </Link>
              </li>
              <li>
                <Link to="/category" className="hover:text-indigo-600 transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/products?category=flagship" className="hover:text-indigo-600 transition">
                  Flagship Phones
                </Link>
              </li>
              <li>
                <Link to="/products?category=refurbished" className="hover:text-indigo-600 transition">
                  Certified Refurbished
                </Link>
              </li>
              <li>
                <Link to="/products?category=foldable" className="hover:text-indigo-600 transition">
                  Foldable Mobiles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Sellers & Buyers
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/products/create" className="hover:text-indigo-600 transition">
                  Post a Mobile Listing
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-indigo-600 transition">
                  Buyer-Seller Inquiries
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 transition">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard" className="hover:text-indigo-600 transition">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Company
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/about" className="hover:text-indigo-600 transition">
                  About MobiMarket
                </Link>
              </li>
              <li>
                <span className="text-slate-400">support@mobimarket.io</span>
              </li>
              <li>
                <span className="text-slate-400">Available Mon-Sat 9am-6pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

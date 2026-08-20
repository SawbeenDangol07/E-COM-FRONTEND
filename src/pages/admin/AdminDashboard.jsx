import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../reducer/ProductReducer";
import orderService from "../../services/order.service";
import chatService from "../../services/chat.service";
import {
  TbCurrencyDollar,
  TbDeviceMobile,
  TbUsers,
  TbShieldCheck,
  TbArrowRight,
  TbReceipt,
} from "react-icons/tb";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());

    // Fetch live recent orders
    orderService
      .listOrders({ page: 1, limit: 5 })
      .then((res) => {
        setRecentOrders(res.data || []);
      })
      .catch((err) => console.warn("Failed to load dashboard orders:", err.message));

    // Fetch live users
    chatService
      .listUsers({ page: 1, limit: 1 })
      .then((res) => {
        if (res.meta?.pagination?.total) {
          setTotalUsersCount(res.meta.pagination.total);
        } else if (Array.isArray(res.data)) {
          setTotalUsersCount(res.data.length);
        }
      })
      .catch((err) => console.warn("Failed to load user counts:", err.message));
  }, [dispatch]);

  const totalGMV = products.reduce((acc, p) => acc + (p.price ? p.price / 100 : 0), 0);

  return (
    <div className="space-y-8 text-slate-900">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Admin Master Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Real-time telemetry, marketplace inventory, escrow transactions, and platform governance.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Link
            to="/admin/banners"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs"
          >
            Manage Banners
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm shadow-indigo-500/20"
          >
            Manage Products
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Platform Inventory GMV</span>
            <TbCurrencyDollar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">Rs. {Math.round(totalGMV).toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Active Inventory Value</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Mobile Listings</span>
            <TbDeviceMobile className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{products.length} Phones</p>
          <span className="text-[11px] text-indigo-600 font-semibold">Live in Catalog</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Platform Orders</span>
            <TbShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{recentOrders.length} Orders</p>
          <span className="text-[11px] text-slate-400 font-light">All active orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Accounts</span>
            <TbUsers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalUsersCount || 1}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Registered Users</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Orders</h3>
            <p className="text-xs text-slate-500 font-light">
              Live orders placed on the platform.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View all orders</span>
            <TbArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Buyer Account</th>
                <th className="pb-3">Device Item</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Escrow Status</th>
                <th className="pb-3 text-right pr-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((ord) => {
                  const displayTotal = ord.total ? (ord.total / 100).toFixed(2) : "0.00";
                  const dateStr = ord.createdAt
                    ? new Date(ord.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Recent";
                  const firstItem = ord.detail?.[0]?.product?.name || "Mobile Device";

                  return (
                    <tr key={ord._id || ord.orderId} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 pl-2 font-mono font-bold text-slate-700">
                        #{ord.orderId}
                      </td>
                      <td className="py-3.5 text-slate-800 font-medium">
                        {ord.buyer?.name || "Customer"}
                      </td>
                      <td className="py-3.5 font-semibold text-slate-900 truncate max-w-xs">
                        {firstItem}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900">${displayTotal}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            ord.status === "delivered" || ord.status === "processing"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {ord.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right text-slate-400 font-light">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <div className="space-y-1">
                      <TbReceipt className="w-6 h-6 mx-auto text-slate-300" />
                      <p className="text-xs">No orders placed yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/products"
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition flex items-center justify-between group shadow-xs"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">Moderate Mobile Listings</h4>
            <p className="text-xs text-slate-500 font-light mt-0.5">Audit IMEI reports and descriptions</p>
          </div>
          <TbArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/brands"
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition flex items-center justify-between group shadow-xs"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">Manage Mobile Brands</h4>
            <p className="text-xs text-slate-500 font-light mt-0.5">Configure supported OEM manufacturers</p>
          </div>
          <TbArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/users"
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition flex items-center justify-between group shadow-xs"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">Platform Accounts & Users</h4>
            <p className="text-xs text-slate-500 font-light mt-0.5">Audit buyer and seller accounts</p>
          </div>
          <TbArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

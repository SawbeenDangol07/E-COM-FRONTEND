import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import orderService from "../../services/order.service";
import {
  TbTruckDelivery,
  TbMessageDots,
  TbDeviceMobile,
  TbReceipt,
  TbUser,
} from "react-icons/tb";

export default function CustomerDashboard() {
  const { loggedInUser } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    orderService
      .listOrders({ page: 1, limit: 3 })
      .then((res) => setRecentOrders(res.data || []))
      .catch((err) => console.warn("Failed to load customer orders:", err.message));
  }, []);

  const avatarUrl = loggedInUser?.image?.url || (typeof loggedInUser?.image === "string" ? loggedInUser.image : null);

  return (
    <div className="space-y-8 text-slate-900">
      {/* Header */}
      <PageHeadingWithSubtitle
        title="Buyer Dashboard & Profile"
        badge="Verified Account"
      >
        Track your escrow transactions, device orders, and active negotiations.
      </PageHeadingWithSubtitle>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={loggedInUser?.name || "User"}
              className="w-16 h-16 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl">
              {loggedInUser?.name ? loggedInUser.name[0].toUpperCase() : <TbUser className="w-8 h-8" />}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-900">{loggedInUser?.name || "Customer"}</h2>
            <p className="text-xs text-slate-500 font-light">{loggedInUser?.email || "customer@mobimarket.com"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Verified Buyer
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Escrow Protected
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/products"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          Explore Mobiles
        </Link>
      </div>

      {/* Quick Nav Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/orders"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 transition flex items-center gap-4 group shadow-2xs cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <TbReceipt className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">Order History</p>
            <p className="text-[11px] text-slate-500 font-light">View past escrow orders</p>
          </div>
        </Link>

        <Link
          to="/chat"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 transition flex items-center gap-4 group shadow-2xs cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <TbMessageDots className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">Messages</p>
            <p className="text-[11px] text-slate-500 font-light">Negotiate with sellers</p>
          </div>
        </Link>

        <Link
          to="/products"
          className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 transition flex items-center gap-4 group shadow-2xs cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <TbDeviceMobile className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">Browse Phones</p>
            <p className="text-[11px] text-slate-500 font-light">Explore verified listings</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Escrow Orders</h3>
            <p className="text-xs text-slate-500 font-light mt-0.5">Your latest mobile transactions</p>
          </div>
          <Link
            to="/orders"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            View All Orders →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((ord) => (
              <div key={ord._id || ord.orderId} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-800">#{ord.orderId}</span>
                  <p className="text-[11px] text-slate-500 font-light">
                    {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : "Recent"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">
                    Rs. {ord.total ? (ord.total / 100).toLocaleString() : "0.00"}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      ord.status === "delivered" || ord.status === "processing"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}
                  >
                    {ord.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 space-y-1">
            <TbReceipt className="w-6 h-6 mx-auto text-slate-300" />
            <p className="text-xs">No orders placed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

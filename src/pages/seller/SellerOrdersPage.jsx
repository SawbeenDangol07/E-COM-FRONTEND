import { useEffect, useState, useCallback } from "react";
import { TableHeader } from "../../components/ui/TableHeader";
import { RowSkeleton } from "../../components/ui/table/TableSkeleton";
import { TablePagination } from "../../components/ui/table/TablePagination";
import orderService from "../../services/order.service";
import { TbTruckDelivery, TbDeviceMobile, TbReceipt } from "react-icons/tb";

export default function SellerOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 20,
    page: 1,
    total: 0,
    totalNoOfpages: 1,
  });

  const getOrders = useCallback(async ({ page = 1, limit = 20 } = {}) => {
    setLoading(true);
    try {
      const response = await orderService.listOrders({ page, limit });
      setOrders(response.data || []);
      if (response.meta?.pagination) {
        setPagination(response.meta.pagination);
      }
    } catch (err) {
      console.warn("Failed to fetch seller orders:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getOrders({ page: 1, limit: 20 });
  }, [getOrders]);

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="My Store Orders"
        showSearch={false}
        getSearchResult={getOrders}
      />

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-4">Order ID & Date</th>
                <th className="px-5 py-4">Buyer Customer</th>
                <th className="px-5 py-4">Device Ordered</th>
                <th className="px-5 py-4">Total Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <RowSkeleton rows={5} columns={6} />
              ) : orders && orders.length > 0 ? (
                orders.map((ord) => {
                  const displayTotal = ord.total
                    ? (ord.total / 100).toFixed(2)
                    : "0.00";
                  const dateStr = ord.createdAt
                    ? new Date(ord.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr key={ord._id || ord.orderId} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-slate-800 block text-xs">
                          #{ord.orderId}
                        </span>
                        <span className="text-[11px] text-slate-400 font-light">
                          {dateStr}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {ord.buyer?.name || "Customer"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-light">
                          {ord.buyer?.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1 max-w-xs">
                          {Array.isArray(ord.detail) && ord.detail.length > 0 ? (
                            ord.detail.map((item, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                                <TbDeviceMobile className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span className="truncate font-medium">
                                  {item.product?.name || "Device"}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  x{item.quantity}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs">No item detail</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-bold text-emerald-600 text-sm">
                          Rs. {displayTotal}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            ord.status === "delivered" || ord.status === "processing"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : ord.status === "new"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {ord.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                          <TbTruckDelivery className="w-4 h-4 text-indigo-600" />
                          <span>Dispatch Order</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <TbReceipt className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">No Orders Received Yet</p>
                      <p className="text-xs text-slate-400 font-light">
                        Orders for your mobile inventory will be displayed here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && (
          <div className="p-4 bg-slate-50/50">
            <TablePagination pagination={pagination} getDataAction={getOrders} />
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { TableHeader } from "../../components/ui/TableHeader";
import { RowSkeleton } from "../../components/ui/table/TableSkeleton";
import { TablePagination } from "../../components/ui/table/TablePagination";
import orderService from "../../services/order.service";
import { toast } from "sonner";
import {
  TbTruckDelivery,
  TbDeviceMobile,
  TbReceipt,
  TbLoader2,
  TbCheck,
} from "react-icons/tb";

export default function SellerOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 20,
    page: 1,
    total: 0,
    totalNoOfpages: 1,
  });

  const getOrders = useCallback(
    async ({ page = 1, limit = 20, status = statusFilter } = {}) => {
      setLoading(true);
      try {
        const queryStatus = status === "all" ? "" : status;
        const response = await orderService.listOrders({
          page,
          limit,
          status: queryStatus,
        });
        setOrders(response.data || []);
        if (response.meta?.pagination) {
          setPagination({
            ...response.meta.pagination,
            totalNoOfpages:
              response.meta.pagination.totalNoOfpages ||
              response.meta.pagination.noOfPages ||
              1,
          });
        } else if (response.meta) {
          setPagination({
            page: response.meta.page || page,
            limit: response.meta.limit || limit,
            total: response.meta.total || (response.data ? response.data.length : 0),
            totalNoOfpages:
              response.meta.totalNoOfpages ||
              response.meta.noOfPages ||
              Math.ceil((response.meta.total || 1) / (response.meta.limit || limit)),
          });
        }
      } catch (err) {
        toast.error(err.message || "Failed to fetch seller orders");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    getOrders({ page: 1, limit: 20, status: statusFilter });
  }, [getOrders, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      await getOrders({ page: pagination.page, limit: pagination.limit });
    } catch (err) {
      toast.error(err.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = [
    { label: "All Orders", value: "all" },
    { label: "New", value: "new" },
    { label: "Processing", value: "processing" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <TbReceipt className="w-6 h-6 text-indigo-600" />
            <span>My Store Orders</span>
          </h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Manage incoming purchase orders for your smartphone listings and dispatch status.
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                statusFilter === opt.value
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

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
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4 text-center">Fulfillment Action</th>
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

                  const isUpdating = updatingId === (ord._id || ord.orderId);

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
                                  {item.product?.name || item.name || "Device"}
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
                        {ord.transaction && ord.transaction.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <TbCheck className="w-3 h-3" />
                            <span>Paid (Khalti)</span>
                          </span>
                        ) : ord.paymentMethod === "cod" || ord.status === "processing" || ord.status === "delivered" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <span>Cash on Delivery</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span>Pending Payment</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {isUpdating ? (
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                            <TbLoader2 className="w-4 h-4 animate-spin text-indigo-600" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleStatusChange(ord.orderId || ord._id, e.target.value)
                            }
                            className={`text-xs font-bold rounded-xl px-2.5 py-1 border outline-none cursor-pointer transition ${
                              ord.status === "delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : ord.status === "processing"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : ord.status === "cancelled"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <option value="new">NEW (PENDING)</option>
                            <option value="processing">DISPATCHING / PROCESSING</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        )}
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
                        No orders matching &quot;{statusFilter}&quot; filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && orders.length > 0 && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100">
            <TablePagination
              pagination={pagination}
              getDataAction={({ page, limit }) => getOrders({ page, limit })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

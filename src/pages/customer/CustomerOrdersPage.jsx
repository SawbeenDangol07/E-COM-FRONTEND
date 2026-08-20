import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import orderService from "../../services/order.service";
import { toast } from "sonner";
import { resolveImageUrl } from "../../common/constants";
import {
  TbReceipt,
  TbDeviceMobile,
  TbArrowLeft,
  TbCreditCard,
  TbLoader2,
  TbCheck,
} from "react-icons/tb";

export default function CustomerOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [payingOrderId, setPayingOrderId] = useState(null);

  // Check for status from payment return URL
  useEffect(() => {
    const successMsg = searchParams.get("success");
    const warningMsg = searchParams.get("warning");
    const errorMsg = searchParams.get("error");

    if (successMsg) {
      toast.success(successMsg);
      searchParams.delete("success");
      setSearchParams(searchParams, { replace: true });
    } else if (warningMsg) {
      toast.warning(warningMsg);
      searchParams.delete("warning");
      setSearchParams(searchParams, { replace: true });
    } else if (errorMsg) {
      toast.error(errorMsg);
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.listOrders({ page: 1, limit: 50 });
      setOrders(response.data || []);
    } catch (err) {
      console.warn("Failed to load customer orders:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handlePayOnline = async (orderId) => {
    try {
      setPayingOrderId(orderId);
      const res = await orderService.initiatePayment({ orderId, method: "khalti" });
      if (res.data?.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        toast.info("Payment initiated. Please follow provider instructions.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setPayingOrderId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-900 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <TbReceipt className="w-6 h-6 text-indigo-600" />
            <span>My Mobile Orders & History</span>
          </h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Track and manage your verified device orders, escrow protection, and payment status.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 rounded-xl text-xs font-semibold transition self-start shadow-2xs"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
          <TbLoader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-medium">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
            <TbReceipt className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
            You haven&apos;t placed any mobile phone orders yet. Explore our verified marketplace to find your next device.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-xs"
          >
            <span>Browse Mobiles</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const displayTotal = ord.total ? (ord.total / 100).toFixed(2) : "0.00";
            const dateStr = ord.createdAt
              ? new Date(ord.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent";

            const isPaid = ord.transaction && ord.transaction.length > 0;

            return (
              <div
                key={ord._id || ord.orderId}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 space-y-4 shadow-xs hover:border-indigo-200 transition"
              >
                {/* Top bar responsive grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-100 pb-3 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 font-light block">Order ID</span>
                    <span className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                      #{ord.orderId}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-light block">Date Placed</span>
                    <span className="text-xs font-semibold text-slate-700">{dateStr}</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-light block">Order Status</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${
                        ord.status === "delivered" || ord.status === "processing"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : ord.status === "new"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {ord.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-light block">Payment</span>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <TbCheck className="w-3.5 h-3.5" />
                        <span>Paid</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-600">
                        Pending / Escrow
                      </span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {Array.isArray(ord.detail) &&
                    ord.detail.map((item, idx) => {
                      const itemImg = resolveImageUrl(
                        item.product?.images?.[0] || item.product?.image || item.product?.images
                      );
                      const itemPrice = (item.price ? item.price / 100 : 0).toFixed(2);

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {itemImg ? (
                              <img
                                src={itemImg}
                                alt={item.product?.name}
                                className="w-12 h-12 object-contain rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                <TbDeviceMobile className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">
                                {item.product?.name || "Mobile Device"}
                              </p>
                              <p className="text-[11px] text-slate-400 font-light">
                                Qty: {item.quantity} • Rs. {itemPrice} each
                              </p>
                            </div>
                          </div>

                          <span className="font-bold text-slate-900 text-sm shrink-0">
                            Rs. {((item.price * item.quantity) / 100).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                </div>

                {/* Bottom Footer & Online Payment Action */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-light">
                    <span>Total Amount: </span>
                    <strong className="text-slate-900 font-bold text-base">
                      Rs. {displayTotal}
                    </strong>
                  </div>

                  {!isPaid && (
                    <button
                      onClick={() => handlePayOnline(ord.orderId)}
                      disabled={payingOrderId === ord.orderId}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <TbCreditCard className="w-4 h-4" />
                      <span>{payingOrderId === ord.orderId ? "Connecting..." : "Pay with Khalti / Online"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

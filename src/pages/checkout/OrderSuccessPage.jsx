import { useSearchParams, Link } from "react-router";
import {
  TbCheck,
  TbArrowRight,
  TbReceipt,
  TbCash,
  TbCreditCard,
} from "react-icons/tb";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "Recent";
  const paymentMethod = searchParams.get("payment") || "khalti";
  const isKhalti = paymentMethod === "khalti";

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-8 text-slate-900 text-center">
      {/* Success Badge */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <TbCheck className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {isKhalti
            ? "Khalti Payment Successful & Order Confirmed"
            : "Order Placed (Cash on Delivery)"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-light max-w-md mx-auto">
          {isKhalti
            ? "Thank you! Your payment via Khalti was successfully completed and safely held in escrow. The seller has been notified to dispatch your mobile device."
            : "Thank you! Your mobile order has been confirmed. You will pay in cash upon doorstep delivery and device inspection."}
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 text-left space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
          <div>
            <span className="text-slate-400 block font-light">Order Reference</span>
            <span className="font-mono font-bold text-slate-900 text-sm">#{orderId}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block font-light">Payment Method</span>
            <span className={`font-bold inline-flex items-center gap-1 ${isKhalti ? "text-purple-600" : "text-indigo-600"}`}>
              {isKhalti ? <TbCreditCard className="w-3.5 h-3.5" /> : <TbCash className="w-3.5 h-3.5" />}
              <span>{isKhalti ? "Paid via Khalti" : "Cash on Delivery"}</span>
            </span>
          </div>
        </div>

        {/* 3-Step Escrow Timeline */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Escrow Protection Steps
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">
                {isKhalti ? "1. Khalti Paid" : "1. Order Confirmed"}
              </p>
              <p className="text-[10px] text-slate-500 font-light">
                {isKhalti ? "Held in escrow" : "Cash on delivery"}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">2. Dispatched</p>
              <p className="text-[10px] text-slate-500 font-light">Insured courier</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-center">
              <div className="w-2 h-2 rounded-full bg-slate-400 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">3. 48h Inspect</p>
              <p className="text-[10px] text-slate-500 font-light">Verify & release</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm shadow-indigo-500/20"
        >
          <span>Continue Shopping</span>
          <TbArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition shadow-2xs"
        >
          <TbReceipt className="w-4 h-4 text-indigo-600" />
          <span>My Orders & History</span>
        </Link>
      </div>
    </div>
  );
}

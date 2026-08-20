import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import {
  TbCheck,
  TbX,
  TbLoader2,
  TbArrowRight,
  TbRotateClockwise2,
} from "react-icons/tb";
import { toast } from "sonner";

export default function AccountActivationPage() {
  const { token } = useParams();
  const { activate, reactivate } = useAuth();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "expired" | "error"
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [resending, setResending] = useState(false);
  const activationAttemptedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Activation token is missing from the URL.");
      return;
    }

    // Prevent duplicate execution (e.g. React StrictMode in development)
    if (activationAttemptedRef.current) return;
    activationAttemptedRef.current = true;

    activate(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "Your account has been successfully activated!");
        setUser(res.data);
      })
      .catch((err) => {
        if (err.message?.toLowerCase().includes("expired")) {
          setStatus("expired");
          setMessage("Your activation token has expired. You can request a fresh link below.");
        } else {
          setStatus("error");
          setMessage(err.message || "Failed to activate account. The token may be expired or already used.");
        }
      });
  }, [token]);

  const handleResend = async () => {
    if (!token) {
      toast.error("No token available to reactivate.");
      return;
    }
    setResending(true);
    try {
      const res = await reactivate(token);
      toast.success(res.message || "A new activation token has been sent to your email!");
      setMessage("A fresh activation link has been dispatched to your email. Please check your inbox.");
    } catch (err) {
      toast.error(err.message || "Failed to request reactivation token.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="text-center py-4 space-y-6 text-slate-900">
      {/* Loading State */}
      {status === "loading" && (
        <div className="py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <TbLoader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Activating Account</h2>
            <p className="text-xs text-slate-500 font-light max-w-sm mx-auto">
              Please wait while we verify your activation token with the security server...
            </p>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === "success" && (
        <div className="py-4 space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <TbCheck className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Account Activated!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-light max-w-sm mx-auto">
              {message}
            </p>
          </div>

          {user && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-xs mx-auto text-left flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="truncate">
                <p className="font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm shadow-indigo-500/20"
            >
              <span>Sign In to Your Account</span>
              <TbArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Expired State */}
      {status === "expired" && (
        <div className="py-4 space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <TbRotateClockwise2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Activation Link Expired
            </h2>
            <p className="text-xs text-slate-500 font-light max-w-sm mx-auto">
              {message}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              {resending ? (
                <TbLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TbRotateClockwise2 className="w-4 h-4" />
              )}
              <span>Resend Activation Email</span>
            </button>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition shadow-2xs"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="py-4 space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <TbX className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Activation Failed
            </h2>
            <p className="text-xs text-slate-500 font-light max-w-sm mx-auto">
              {message}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            {token && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm shadow-indigo-500/20 cursor-pointer"
              >
                {resending ? (
                  <TbLoader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <TbRotateClockwise2 className="w-4 h-4" />
                )}
                <span>Resend Activation Email</span>
              </button>
            )}
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition shadow-2xs"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

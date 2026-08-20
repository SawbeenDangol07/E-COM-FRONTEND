import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { LoginDTO } from "../../pages/auth/auth.contract";
import { useAuth } from "../../hooks/useAuth";
import {
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbAlertCircle,
  TbRotateClockwise2,
  TbLoader2,
  TbCheck,
  TbArrowRight,
} from "react-icons/tb";

export default function LoginForm() {
  const { login, reactivate } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activationError, setActivationError] = useState(null);
  const [activationToken, setActivationToken] = useState(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
    resolver: zodResolver(LoginDTO),
  });

  const onError = (formErrors) => {
    const firstErr = Object.values(formErrors)[0];
    if (firstErr?.message) {
      toast.error(firstErr.message);
    }
  };

  const onSubmit = async (data) => {
    setActivationError(null);
    setResendSuccess(false);
    try {
      const user = await login(data);
      const displayName = user?.name || "User";
      toast.success(`Welcome back, ${displayName}!`);
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "seller") {
        navigate("/seller");
      } else {
        navigate("/");
      }
    } catch (err) {
      const isNotActivated =
        err.data?.status === "USER_NOT_ACTIVATED" ||
        err.message?.toLowerCase().includes("not activated");

      if (isNotActivated) {
        setActivationError(
          err.message ||
            "Your account is not activated. Please check your email inbox to verify your account."
        );
        const token = err.data?.data || err.data?.token || null;
        setActivationToken(token);
      }

      toast.error(err.message || "Invalid credentials or login failed");
    }
  };

  const handleResendActivation = async () => {
    if (!activationToken) {
      toast.error("Please use the activation link sent to your registered email.");
      return;
    }
    setIsResending(true);
    try {
      const res = await reactivate(activationToken);
      toast.success(
        res.message || "A fresh activation email has been dispatched to your inbox!"
      );
      setResendSuccess(true);
    } catch (err) {
      toast.error(err.message || "Failed to resend activation email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Account not activated recovery banner */}
      {activationError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3 shadow-sm animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start gap-3">
            <TbAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <p className="font-bold text-amber-950 text-sm">Account Activation Required</p>
              <p className="text-amber-800 font-light leading-relaxed">
                {activationError}
              </p>
            </div>
          </div>

          {activationToken && (
            <div className="pt-1 pl-8">
              {resendSuccess ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-300">
                  <TbCheck className="w-4 h-4 text-emerald-600" />
                  <span>Activation email resent! Check your inbox.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendActivation}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                >
                  {isResending ? (
                    <TbLoader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TbRotateClockwise2 className="w-4 h-4" />
                  )}
                  <span>Resend Activation Email</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <TbMail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              placeholder="your.email@example.com"
              {...register("email")}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl border outline-none transition focus:bg-white focus:ring-2 ${
                errors.email
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-500 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Password <span className="text-rose-500">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline font-semibold transition"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <TbLock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl border outline-none transition focus:bg-white focus:ring-2 ${
                errors.password
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <TbEyeOff className="w-4 h-4" />
              ) : (
                <TbEye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-500 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me option */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium select-none">
            <input
              type="checkbox"
              {...register("remember")}
              className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 transition"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-md shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <TbLoader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <TbArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

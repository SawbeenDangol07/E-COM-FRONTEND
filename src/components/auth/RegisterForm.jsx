import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { RegisterDTO } from "../../pages/auth/auth.contract";
import { useAuth } from "../../hooks/useAuth";
import {
  TbUser,
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbBuildingStore,
  TbMailCheck,
  TbArrowRight,
  TbPhoto,
  TbCheck,
  TbX,
  TbLoader2,
  TbDeviceMobile,
  TbShieldCheck,
} from "react-icons/tb";

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "customer",
      storeName: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(RegisterDTO),
  });

  const selectedRole = watch("role");
  const enteredPassword = watch("password") || "";

  // Password strength analysis
  const passwordCriteria = useMemo(() => {
    const minLength = enteredPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(enteredPassword);
    const hasLower = /[a-z]/.test(enteredPassword);
    const hasNumber = /[0-9]/.test(enteredPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(enteredPassword);

    let score = 0;
    if (minLength) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    return {
      minLength,
      hasUpperLower: hasUpper && hasLower,
      hasNumber,
      hasSpecial,
      score,
    };
  }, [enteredPassword]);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onError = (formErrors) => {
    const firstErr = Object.values(formErrors)[0];
    if (firstErr?.message) {
      toast.error(firstErr.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      let payload;
      if (imageFile) {
        payload = new FormData();
        payload.append("name", data.name);
        payload.append("email", data.email);
        payload.append("password", data.password);
        payload.append("confirmPassword", data.confirmPassword);
        payload.append("role", data.role || "customer");
        payload.append("image", imageFile);
      } else {
        payload = {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          role: data.role || "customer",
        };
      }

      await registerUser(payload);
      toast.success("Account registered! Please activate via email.");
      setRegisteredEmail(data.email);
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    }
  };

  // SUCCESS ACTIVATION SCREEN
  if (registeredEmail) {
    return (
      <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <TbMailCheck className="w-9 h-9 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900">Check Your Inbox</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
            We have sent an activation link to <strong className="font-bold text-slate-900">{registeredEmail}</strong>.
            Click the link in the email to activate your account and start trading.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-800 text-left space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <TbShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Didn&apos;t receive the email?</span>
          </p>
          <p className="text-indigo-600/80 font-light text-[11px]">
            Please check your spam or junk folder, or proceed to login to request an instant reactivation token.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <span>Go to Sign In</span>
            <TbArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      {/* Visual Role Selector Cards */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Account Type <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setValue("role", "customer")}
            className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 text-left ${
              selectedRole === "customer"
                ? "bg-indigo-50/80 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                selectedRole === "customer"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              <TbDeviceMobile className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs">Buy Mobiles</p>
              <p className="text-[10px] text-slate-400 font-light truncate">
                Customer account
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue("role", "seller")}
            className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 text-left ${
              selectedRole === "seller"
                ? "bg-indigo-50/80 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                selectedRole === "seller"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              <TbBuildingStore className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs">Sell & Store</p>
              <p className="text-[10px] text-slate-400 font-light truncate">
                Seller account
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Full Name & Avatar Row */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <TbUser className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. Sabin Dangol"
              {...register("name")}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl border outline-none transition focus:bg-white focus:ring-2 ${
                errors.name
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
          </div>

          {/* Quick Avatar Thumbnail */}
          <div className="relative shrink-0">
            <label
              htmlFor="avatar-upload"
              className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 hover:border-indigo-400 flex items-center justify-center cursor-pointer overflow-hidden transition shadow-2xs group"
              title="Upload profile photo"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <TbPhoto className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow cursor-pointer"
                title="Remove photo"
              >
                ×
              </button>
            )}
          </div>
        </div>
        {errors.name && (
          <p className="text-[11px] text-rose-500 font-medium">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Address */}
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

      {/* Password & Confirm Password Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <TbLock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full pl-10 pr-9 py-2.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl border outline-none transition focus:bg-white focus:ring-2 ${
                errors.password
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
            >
              {showPassword ? <TbEyeOff className="w-3.5 h-3.5" /> : <TbEye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <TbLock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`w-full pl-10 pr-9 py-2.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl border outline-none transition focus:bg-white focus:ring-2 ${
                errors.confirmPassword
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2.5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
            >
              {showConfirmPassword ? <TbEyeOff className="w-3.5 h-3.5" /> : <TbEye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Live Password Strength Meter */}
      {enteredPassword.length > 0 && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          {/* Indicator Bar */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-slate-500">
              Security Strength:{" "}
              <span
                className={`font-extrabold ${
                  passwordCriteria.score <= 1
                    ? "text-rose-500"
                    : passwordCriteria.score <= 3
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              >
                {passwordCriteria.score <= 1
                  ? "Weak"
                  : passwordCriteria.score <= 3
                  ? "Fair"
                  : "Strong"}
              </span>
            </span>
            <div className="flex items-center gap-1 flex-1 max-w-[120px]">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    level <= passwordCriteria.score
                      ? passwordCriteria.score <= 1
                        ? "bg-rose-500"
                        : passwordCriteria.score <= 3
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Checklist chips */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500 font-medium">
            <span className={`flex items-center gap-1 ${passwordCriteria.minLength ? "text-emerald-600" : ""}`}>
              {passwordCriteria.minLength ? <TbCheck className="w-3 h-3 text-emerald-500" /> : <TbX className="w-3 h-3 text-slate-400" />}
              8+ Characters
            </span>
            <span className={`flex items-center gap-1 ${passwordCriteria.hasUpperLower ? "text-emerald-600" : ""}`}>
              {passwordCriteria.hasUpperLower ? <TbCheck className="w-3 h-3 text-emerald-500" /> : <TbX className="w-3 h-3 text-slate-400" />}
              Upper & Lowercase
            </span>
            <span className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? "text-emerald-600" : ""}`}>
              {passwordCriteria.hasNumber ? <TbCheck className="w-3 h-3 text-emerald-500" /> : <TbX className="w-3 h-3 text-slate-400" />}
              At least 1 Number
            </span>
            <span className={`flex items-center gap-1 ${passwordCriteria.hasSpecial ? "text-emerald-600" : ""}`}>
              {passwordCriteria.hasSpecial ? <TbCheck className="w-3 h-3 text-emerald-500" /> : <TbX className="w-3 h-3 text-slate-400" />}
              Special Symbol
            </span>
          </div>
        </div>
      )}

      {(errors.password || errors.confirmPassword) && (
        <p className="text-[11px] text-rose-500 font-medium">
          {errors.password?.message || errors.confirmPassword?.message}
        </p>
      )}

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
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>
                {selectedRole === "seller"
                  ? "Create Verified Seller Account"
                  : "Create Buyer Account"}
              </span>
              <TbArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

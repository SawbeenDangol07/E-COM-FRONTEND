import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { FormLabel } from "../../components/form/FormLabel";
import { FormSubmitButton } from "../../components/form/FormAction";
import { TbMail, TbArrowLeft } from "react-icons/tb";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email");
      return;
    }
    toast.success("Password reset link sent to " + email);
    setSubmitted(true);
  };

  return (
    <div className="space-y-4 text-slate-900">
      {submitted ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
            <TbMail className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Check your inbox</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto font-light">
            We sent a password reset link to <strong className="text-slate-800">{email}</strong>.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormLabel htmlFor="email" required>
              Your Registered Email Address
            </FormLabel>
            <div className="relative flex items-center">
              <TbMail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white outline-none transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <FormSubmitButton label="Send Reset Link" className="w-full py-3" />
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition font-medium"
            >
              <TbArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

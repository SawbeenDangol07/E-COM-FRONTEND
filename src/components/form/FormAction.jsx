import { TbLoader2 } from "react-icons/tb";

export const FormSubmitButton = ({
  label = "Submit",
  loading = false,
  disabled = false,
  className = "",
  icon = null,
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-99 shadow-sm shadow-indigo-500/20 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <TbLoader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export const FormCancelButton = ({
  label = "Cancel",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-sm text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs ${className}`}
    >
      {label}
    </button>
  );
};

export default FormSubmitButton;

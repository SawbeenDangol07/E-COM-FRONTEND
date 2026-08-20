import { useController } from "react-hook-form";

export const FormTextareaControl = ({
  name,
  control,
  placeholder = "",
  rows = 4,
  errMsg = "",
  disabled = false,
  className = "",
  ...rest
}) => {
  const { field } = useController({
    name,
    control,
  });

  return (
    <div className="w-full">
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        {...field}
        {...rest}
        className={`w-full py-2.5 px-3.5 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-150 outline-none resize-y
          ${
            errMsg
              ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20"
              : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white"
          }
          ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200" : ""}
          ${className}`}
      />
      {errMsg && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium">{errMsg}</p>
      )}
    </div>
  );
};

export default FormTextareaControl;

import { useController } from "react-hook-form";

export const FormSelectControl = ({
  name,
  control,
  options = [],
  placeholder = "-- Select an option --",
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
      <select
        id={name}
        disabled={disabled}
        {...field}
        {...rest}
        className={`w-full py-2.5 px-3.5 text-sm bg-slate-50 text-slate-900 rounded-xl border transition-all duration-150 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_14px_center] bg-no-repeat
          ${
            errMsg
              ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20"
              : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white"
          }
          ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200" : ""}
          ${className}`}
      >
        {placeholder && <option value="" className="bg-white text-slate-500">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
            {opt.label || opt.value}
          </option>
        ))}
      </select>
      {errMsg && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium">{errMsg}</p>
      )}
    </div>
  );
};

export default FormSelectControl;

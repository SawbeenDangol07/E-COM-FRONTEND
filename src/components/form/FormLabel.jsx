export const FormLabel = ({ htmlFor, children, required = false, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 ${className}`}
    >
      {children}
      {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
    </label>
  );
};

export default FormLabel;

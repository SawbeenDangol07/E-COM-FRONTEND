import { useController } from "react-hook-form";
import { TbPhoto, TbX } from "react-icons/tb";
import { useState } from "react";

export const FormInputControl = ({
  name,
  control,
  type = "text",
  placeholder = "",
  errMsg = "",
  icon = null,
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
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...field}
          {...rest}
          className={`w-full py-2.5 px-3.5 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-150 outline-none
            ${icon ? "pl-10" : "pl-3.5"}
            ${
              errMsg
                ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white"
            }
            ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200" : ""}
            ${className}`}
        />
      </div>
      {errMsg && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
          {errMsg}
        </p>
      )}
    </div>
  );
};

export const SelectInput = ({
  name,
  control,
  options = [],
  placeholder = "-- Select Any One --",
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
        {placeholder && (
          <option value="" className="bg-white text-slate-500">
            {placeholder}
          </option>
        )}
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

export const FileInput = ({
  name,
  control,
  errMsg = "",
  isMultiple = false,
  previewUrl = null,
  existingImages = [],
  className = "",
}) => {
  const { field } = useController({
    name,
    control,
  });

  const [preview, setPreview] = useState(previewUrl);
  const [multiPreviews, setMultiPreviews] = useState([]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-3">
        <label
          htmlFor={name}
          className={`flex-1 flex items-center gap-2.5 py-2.5 px-3.5 text-sm bg-slate-50 text-slate-700 rounded-xl border cursor-pointer transition hover:bg-slate-100/70
            ${
              errMsg
                ? "border-rose-500 focus:border-rose-500 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300"
            } ${className}`}
        >
          <TbPhoto className="w-5 h-5 text-indigo-600 shrink-0" />
          <span className="truncate text-xs font-medium text-slate-600">
            {isMultiple && Array.isArray(field.value) && field.value.length > 0
              ? `${field.value.length} image(s) selected`
              : field.value instanceof File
              ? field.value.name
              : isMultiple
              ? "Choose product photos (PNG, JPG, WebP - select multiple)..."
              : "Choose image file (PNG, JPG, WebP)..."}
          </span>
          <input
            id={name}
            type="file"
            accept="image/*"
            multiple={isMultiple}
            className="hidden"
            onChange={(e) => {
              const files = Object.values(e.target.files);
              if (isMultiple) {
                field.onChange(files);
                const previews = files.map((f) => URL.createObjectURL(f));
                setMultiPreviews(previews);
              } else {
                const selectedFile = files[0];
                field.onChange(selectedFile);
                if (selectedFile) {
                  setPreview(URL.createObjectURL(selectedFile));
                }
              }
            }}
          />
        </label>

        {(field.value || preview || multiPreviews.length > 0) && (
          <button
            type="button"
            onClick={() => {
              field.onChange(isMultiple ? [] : null);
              setPreview(null);
              setMultiPreviews([]);
            }}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition border border-slate-200 cursor-pointer"
            title="Clear Images"
          >
            <TbX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Single Preview */}
      {!isMultiple && preview && (
        <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200 w-fit">
          <img
            src={preview}
            alt="Preview"
            className="w-14 h-14 object-cover rounded-xl border border-slate-200"
          />
          <span className="text-[11px] text-slate-400 font-medium pr-2">Image Preview</span>
        </div>
      )}

      {/* Multi Previews (New uploads) */}
      {isMultiple && multiPreviews.length > 0 && (
        <div className="mt-2 space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500">Newly Selected Photos:</p>
          <div className="flex flex-wrap gap-2.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
            {multiPreviews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${i}`}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-2xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images (Edit mode) */}
      {isMultiple && existingImages && existingImages.length > 0 && multiPreviews.length === 0 && (
        <div className="mt-2 space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500">Current Product Photos:</p>
          <div className="flex flex-wrap gap-2.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
            {existingImages.map((img, i) => (
              <div key={img._id || img.public_id || i} className="relative">
                <img
                  src={img.url || img.secure_url}
                  alt={`Existing ${i}`}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-2xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {errMsg && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium">{errMsg}</p>
      )}
    </div>
  );
};

export const FormInput = ({
  name,
  type = "text",
  placeholder = "",
  handler,
  errMsg = "",
  icon = null,
  className = "",
  ...rest
}) => {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...(handler ? handler(name) : {})}
          {...rest}
          className={`w-full py-2.5 px-3.5 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-150 outline-none
            ${icon ? "pl-10" : "pl-3.5"}
            ${
              errMsg
                ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white"
            }
            ${className}`}
        />
      </div>
      {errMsg && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium">{errMsg}</p>
      )}
    </div>
  );
};

export default FormInputControl;

const FormInput = ({
  label,
  name,
  register,
  error,
  icon: Icon,
  placeholder,
  type = "text",
  rows = 3,
  isTextArea = false,
  options = [],
}) => {
  const inputClassName = `w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
    error ? "border-red-500" : "border-slate-200 focus:border-blue-500"
  }`;

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-3 ${isTextArea ? "top-3" : "top-1/2 -translate-y-1/2"} text-slate-400`}
            size={18}
          />
        )}
        {options.length > 0 ? (
          <select {...register(name)} className={`${inputClassName} appearance-none`}>
            <option value="">Sélectionnez un motif</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : isTextArea ? (
          <textarea
            {...register(name)}
            rows={rows}
            className={inputClassName}
            placeholder={placeholder}
          />
        ) : (
          <input
            {...register(name)}
            type={type}
            className={inputClassName}
            placeholder={placeholder}
          />
        )}
      </div>
      {error && (
        <p className="text-red-500 text-[10px] mt-1 ml-1">{error.message}</p>
      )}
    </div>
  );
};

export default FormInput;

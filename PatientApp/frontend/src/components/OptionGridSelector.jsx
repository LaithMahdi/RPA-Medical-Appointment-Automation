const OptionGridSelector = ({
  label,
  name,
  register,
  selectedValue,
  error,
  options,
  icon: Icon,
  columnsClassName = "grid-cols-3",
  containerClassName = "",
  optionClassName = "",
}) => {
  return (
    <div className={`space-y-2 ${containerClassName}`.trim()}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-2">
          {Icon && <Icon size={14} className="text-blue-500" />}
          {label}
        </label>
      )}

      <div className={`grid ${columnsClassName} gap-2`}>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const displayLabel =
            typeof option === "string" ? option : option.label;
          const isDisabled =
            typeof option === "string" ? false : Boolean(option.disabled);
          const isSelected = selectedValue === value && !isDisabled;

          return (
            <label
              key={value}
              className={`flex items-center justify-center px-2 py-2.5 border rounded-xl transition-all ${
                isDisabled
                  ? "cursor-not-allowed bg-slate-200/40 text-slate-200 border-slate-200"
                  : "cursor-pointer"
              } ${
                isSelected
                  ? "border-blue-500 bg-blue-600 text-white ring-2 ring-blue-100 shadow-sm"
                  : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/40"
              } ${optionClassName}`.trim()}
            >
              <input
                type="radio"
                value={value}
                disabled={isDisabled}
                {...register(name)}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{displayLabel}</span>
            </label>
          );
        })}
      </div>

      {error && (
        <p className="text-red-500 text-[10px] mt-1 ml-1">{error.message}</p>
      )}
    </div>
  );
};

export default OptionGridSelector;

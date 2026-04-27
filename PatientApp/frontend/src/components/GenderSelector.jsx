const GENDER_OPTIONS = ["Masculin", "Féminin", "Autre"];

const GenderSelector = ({ register, selectedGender, error }) => {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">
        Genre
      </label>
      <div className="grid grid-cols-3 gap-3">
        {GENDER_OPTIONS.map((option) => {
          const isSelected = selectedGender === option;

          return (
            <label
              key={option}
              className={`flex items-center justify-center p-2.5 border rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                value={option}
                {...register("gender")}
                className="sr-only"
              />
              <span className="text-sm font-medium">{option}</span>
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

export default GenderSelector;

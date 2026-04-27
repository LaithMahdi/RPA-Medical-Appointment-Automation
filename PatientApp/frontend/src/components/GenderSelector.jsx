import OptionGridSelector from "./OptionGridSelector";

const GENDER_OPTIONS = ["Masculin", "Féminin"];

const GenderSelector = ({ register, selectedGender, error }) => {
  return (
    <OptionGridSelector
      label="Genre"
      name="gender"
      register={register}
      selectedValue={selectedGender}
      error={error}
      options={GENDER_OPTIONS}
      columnsClassName="grid-cols-2"
    />
  );
};

export default GenderSelector;

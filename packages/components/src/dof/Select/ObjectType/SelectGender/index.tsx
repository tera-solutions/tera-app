import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectGender = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_gender" {...props} />;
};

export default SelectGender;

import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectProvinceType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_province" {...props} />;
};

export default SelectProvinceType;

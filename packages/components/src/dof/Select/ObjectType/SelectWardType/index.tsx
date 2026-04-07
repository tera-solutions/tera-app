import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectWardType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_ward" {...props} />;
};

export default SelectWardType;

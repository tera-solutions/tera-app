import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectCallType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_call-type" {...props} />;
};

export default SelectCallType;

import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectRequestType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_request-type" {...props} />;
};

export default SelectRequestType;

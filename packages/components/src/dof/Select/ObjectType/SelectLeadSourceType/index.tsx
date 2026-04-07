import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectLeadSourceType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_channel" {...props} />;
};

export default SelectLeadSourceType;

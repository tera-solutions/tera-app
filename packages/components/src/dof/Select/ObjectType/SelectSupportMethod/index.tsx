import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectSupportMethod = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_support-method" {...props} />;
};
export default SelectSupportMethod;

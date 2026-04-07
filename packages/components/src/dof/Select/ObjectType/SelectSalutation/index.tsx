import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectSalutation = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_salutation" {...props} />;
};
export default SelectSalutation;

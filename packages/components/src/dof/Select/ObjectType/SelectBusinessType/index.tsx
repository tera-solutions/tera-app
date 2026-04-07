import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectBusinessType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_customer-object" {...props} />;
};

export default SelectBusinessType;

import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectCustomerType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_customer-type" {...props} />;
};
export default SelectCustomerType;

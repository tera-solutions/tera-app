import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectCustomerObjectType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_customer-object" {...props} />;
};
export default SelectCustomerObjectType;

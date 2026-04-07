import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectPaymentMethod = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_payments" {...props} />;
};

export default SelectPaymentMethod;

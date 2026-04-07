import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectPaymentType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_payments" {...props} />;
};

export default SelectPaymentType;

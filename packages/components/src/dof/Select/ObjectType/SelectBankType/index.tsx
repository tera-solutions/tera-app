import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectBankType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_bank" {...props} />;
};

export default SelectBankType;

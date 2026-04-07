import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectMailDriver = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_order" {...props} />;
};

export default SelectMailDriver;

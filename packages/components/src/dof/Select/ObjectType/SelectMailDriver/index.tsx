import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectMailDriver = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_mail_driver" {...props} />;
};

export default SelectMailDriver;

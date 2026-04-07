import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectContactType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_contact-type" {...props} />;
};
export default SelectContactType;

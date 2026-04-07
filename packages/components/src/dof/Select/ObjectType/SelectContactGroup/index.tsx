import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectContactGroup = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_contact-group" {...props} />;
};
export default SelectContactGroup;

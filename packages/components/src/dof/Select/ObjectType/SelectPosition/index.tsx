import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectPosition = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_position" {...props} />;
};

export default SelectPosition;

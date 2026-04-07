import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectPriorityLevel = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_priority-level" {...props} />;
};

export default SelectPriorityLevel;

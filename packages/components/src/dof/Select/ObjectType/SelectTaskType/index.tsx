import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectTaskType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_task-type" {...props} />;
};

export default SelectTaskType;

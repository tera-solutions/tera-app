import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectJobTitle = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_job-title" {...props} />;
};

export default SelectJobTitle;

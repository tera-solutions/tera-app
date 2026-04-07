import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectDepartment = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_department" {...props} />;
};

export default SelectDepartment;

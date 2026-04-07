import SelectDataType, { SelectDataTypeProps } from "../SelectDataType";

const SelectScalesType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_scales" {...props} />;
};

export default SelectScalesType;

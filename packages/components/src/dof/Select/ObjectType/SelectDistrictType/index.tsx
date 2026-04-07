import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectDistrictType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_district" {...props} />;
};

export default SelectDistrictType;
